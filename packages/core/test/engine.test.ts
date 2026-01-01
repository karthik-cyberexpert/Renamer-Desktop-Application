
import { describe, it, expect } from 'vitest';
import { applyRules } from '../src/engine';
import { FileInfo, ProcessingContext, Rule } from '../src/types';

describe('Core Engine', () => {
    const mockFile: FileInfo = {
        name: 'testFile',
        originalName: 'testFile.txt',
        extension: '.txt',
        path: '/tmp/testFile.txt',
        size: 1024,
        created: new Date('2023-01-01T00:00:00Z'),
        modified: new Date('2023-01-02T00:00:00Z'),
        metadata: { 'camera': 'Sony' }
    };
    
    const context: ProcessingContext = {
        index: 0,
        total: 1,
        files: [mockFile]
    };

    it('should apply simple prefix rule', () => {
        const rules: Rule[] = [{
            id: '1',
            type: 'prefix',
            active: true,
            params: { value: 'PRE_' }
        }];
        
        const result = applyRules(mockFile, rules, context);
        expect(result.newName).toBe('PRE_testFile.txt');
    });
    
    it('should apply simple suffix rule', () => {
        const rules: Rule[] = [{
            id: '1',
            type: 'suffix',
            active: true,
            params: { value: '_SUF' }
        }];
        
        const result = applyRules(mockFile, rules, context);
        expect(result.newName).toBe('testFile_SUF.txt');
    });
    
    it('should replacement text', () => {
        const rules: Rule[] = [{
            id: '1',
            type: 'replace',
            active: true,
            params: { search: 'File', replace: 'Demo' } 
        }];
        
        const result = applyRules(mockFile, rules, context);
        expect(result.newName).toBe('testDemo.txt');
    });
    
    it('should format date', () => {
        const rules: Rule[] = [{
            id: '1',
            type: 'date',
            active: true,
            params: { format: 'YYYY-MM-DD', source: 'created', mode: 'append' } // append to name
        }];
        
        const result = applyRules(mockFile, rules, context);
        expect(result.newName).toBe('testFile2023-01-01.txt');
    });

    it('should sequence', () => {
         const rules: Rule[] = [{
            id: '1',
            type: 'sequence',
            active: true,
            params: { start: 1, padding: 3, mode: 'replace' }
        }];
        
        const result = applyRules(mockFile, rules, context);
        expect(result.newName).toBe('001.txt');
    });
    
    it('should chain rules', () => {
         const rules: Rule[] = [
             { id: '1', type: 'prefix', active: true, params: { value: 'IMG_' } },
             { id: '2', type: 'sequence', active: true, params: { start: 10, padding: 3, mode: 'append' } }
         ];
         // prefix: IMG_testFile
         // sequence append: IMG_testFile010
         
        const result = applyRules(mockFile, rules, context);
        expect(result.newName).toBe('IMG_testFile010.txt');
    });
    
    it('should handle metadata stub', () => {
          const rules: Rule[] = [
             { id: '1', type: 'metadata', active: true, params: { field: 'camera', mode: 'replace' } }
         ];
         
         const result = applyRules(mockFile, rules, context);
         expect(result.newName).toBe('Sony.txt');
    });
});
