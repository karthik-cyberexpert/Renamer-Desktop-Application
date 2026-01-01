"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const engine_1 = require("../src/engine");
(0, vitest_1.describe)('Core Engine', () => {
    const mockFile = {
        name: 'testFile',
        originalName: 'testFile.txt',
        extension: '.txt',
        path: '/tmp/testFile.txt',
        size: 1024,
        created: new Date('2023-01-01T00:00:00Z'),
        modified: new Date('2023-01-02T00:00:00Z'),
        metadata: { 'camera': 'Sony' }
    };
    const context = {
        index: 0,
        total: 1,
        files: [mockFile]
    };
    (0, vitest_1.it)('should apply simple prefix rule', () => {
        const rules = [{
                id: '1',
                type: 'prefix',
                active: true,
                params: { value: 'PRE_' }
            }];
        const result = (0, engine_1.applyRules)(mockFile, rules, context);
        (0, vitest_1.expect)(result.newName).toBe('PRE_testFile.txt');
    });
    (0, vitest_1.it)('should apply simple suffix rule', () => {
        const rules = [{
                id: '1',
                type: 'suffix',
                active: true,
                params: { value: '_SUF' }
            }];
        const result = (0, engine_1.applyRules)(mockFile, rules, context);
        (0, vitest_1.expect)(result.newName).toBe('testFile_SUF.txt');
    });
    (0, vitest_1.it)('should replacement text', () => {
        const rules = [{
                id: '1',
                type: 'replace',
                active: true,
                params: { search: 'File', replace: 'Demo' }
            }];
        const result = (0, engine_1.applyRules)(mockFile, rules, context);
        (0, vitest_1.expect)(result.newName).toBe('testDemo.txt');
    });
    (0, vitest_1.it)('should format date', () => {
        const rules = [{
                id: '1',
                type: 'date',
                active: true,
                params: { format: 'YYYY-MM-DD', source: 'created', mode: 'append' } // append to name
            }];
        const result = (0, engine_1.applyRules)(mockFile, rules, context);
        (0, vitest_1.expect)(result.newName).toBe('testFile2023-01-01.txt');
    });
    (0, vitest_1.it)('should sequence', () => {
        const rules = [{
                id: '1',
                type: 'sequence',
                active: true,
                params: { start: 1, padding: 3, mode: 'replace' }
            }];
        const result = (0, engine_1.applyRules)(mockFile, rules, context);
        (0, vitest_1.expect)(result.newName).toBe('001.txt');
    });
    (0, vitest_1.it)('should chain rules', () => {
        const rules = [
            { id: '1', type: 'prefix', active: true, params: { value: 'IMG_' } },
            { id: '2', type: 'sequence', active: true, params: { start: 10, padding: 3, mode: 'append' } }
        ];
        // prefix: IMG_testFile
        // sequence append: IMG_testFile010
        const result = (0, engine_1.applyRules)(mockFile, rules, context);
        (0, vitest_1.expect)(result.newName).toBe('IMG_testFile010.txt');
    });
    (0, vitest_1.it)('should handle metadata stub', () => {
        const rules = [
            { id: '1', type: 'metadata', active: true, params: { field: 'camera', mode: 'replace' } }
        ];
        const result = (0, engine_1.applyRules)(mockFile, rules, context);
        (0, vitest_1.expect)(result.newName).toBe('Sony.txt');
    });
});
//# sourceMappingURL=engine.test.js.map