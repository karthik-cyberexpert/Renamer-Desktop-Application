
import { Rule, FileInfo, ProcessingContext, RenameResult } from './types';
import transformers from './transformers';

export function applyRules(file: FileInfo, rules: Rule[], context: ProcessingContext): RenameResult {
    let currentName = file.name;
    let error: string | undefined;

    // TODO: Support rules that affect extension
    
    for (const rule of rules) {
        if (!rule.active) continue;
        
        const transformer = transformers[rule.type];
        if (transformer) {
            try {
                currentName = transformer(currentName, rule, file, context);
            } catch (err: any) {
                error = `Rule ${rule.type} failed: ${err.message}`;
            }
        }
    }
    
    return {
        original: file.path,
        // Caller acts on directories. We return the new filename.
        newPath: '', // Placeholder, logic usually at higher level combining dir + newName
        newName: currentName + file.extension, 
        error
    };
}
