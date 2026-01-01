
import { Rule, FileInfo, ProcessingContext } from '../types';

export const prefix = (name: string, rule: Rule): string => {
  return (rule.params.value || '') + name;
};

export const suffix = (name: string, rule: Rule): string => {
  return name + (rule.params.value || '');
};

export const replace = (name: string, rule: Rule): string => {
    const searchTerm = rule.params.find || rule.params.search;
    if (!searchTerm) return name;
    return name.replaceAll(searchTerm, rule.params.replace || '');
};

export const lowercase = (name: string): string => name.toLowerCase();
export const uppercase = (name: string): string => name.toUpperCase();

// Capitalize first letter of each word
export const capitalize = (name: string): string => {
    return name.replace(/\b\w/g, char => char.toUpperCase());
};

// Title case - capitalize first letter, rest lowercase
export const titlecase = (name: string): string => {
    return name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

// Custom rule - uses JavaScript expression
export const custom = (name: string, rule: Rule): string => {
    try {
        const expression = rule.params.expression || '';
        if (!expression) return name;
        
        // Create a simple function context with common string operations
        // The expression can use: name, i (index if available), etc.
        const fn = new Function('name', `return ${expression}`);
        const result = fn(name);
        
        // Ensure result is a string
        return String(result);
    } catch (e) {
        console.error('Custom rule error:', e);
        return name; // Return original on error
    }
};
