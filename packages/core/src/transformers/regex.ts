
import { Rule } from '../types';

export const regex = (name: string, rule: Rule): string => {
    if (!rule.params.match) return name;
    try {
        const flags = rule.params.flags || 'g'; // Default to global
        const re = new RegExp(rule.params.match, flags);
        return name.replace(re, rule.params.replace || '');
    } catch (e) {
        // console.error("Regex error", e);
        return name;
    }
}
