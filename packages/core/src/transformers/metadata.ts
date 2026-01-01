
import { Rule, FileInfo } from '../types';

export const metadata = (name: string, rule: Rule, file: FileInfo): string => {
    // Stub implementation
    // On real app, we would use 'exif-reader' or similar in a utility, and populate file.metadata
    const field = rule.params.field;
    const value = file.metadata?.[field];
    
    if (value) {
        // Mode support?
        // Usually metadata is inserted or replaces.
        const mode = rule.params.mode || 'replace';
        if (mode === 'append') return name + value;
        if (mode === 'prepend') return value + name;
        return value;
    }
    
    return name;
}
