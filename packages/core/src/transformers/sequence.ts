
import { Rule, ProcessingContext } from '../types';

export const sequence = (name: string, rule: Rule, _file: any, context: ProcessingContext): string => {
    const start = Number(rule.params.start) || 1;
    const step = Number(rule.params.step) || 1;
    const padding = Number(rule.params.padding) || 1;
    const mode = rule.params.mode || 'replace'; // replace, append, prepend
    
    const current = start + (context.index * step);
    const numStr = current.toString().padStart(padding, '0');
    
    if (mode === 'append') return name + numStr;
    if (mode === 'prepend') return numStr + name;
    return numStr;
};
