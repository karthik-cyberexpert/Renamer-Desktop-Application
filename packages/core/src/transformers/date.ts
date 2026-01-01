
import { Rule, FileInfo } from '../types';

const formatDate = (date: Date, format: string): string => {
   const map: Record<string, string> = {
       YYYY: date.getFullYear().toString(),
       MM: (date.getMonth() + 1).toString().padStart(2, '0'),
       DD: date.getDate().toString().padStart(2, '0'),
       HH: date.getHours().toString().padStart(2, '0'),
       mm: date.getMinutes().toString().padStart(2, '0'),
       ss: date.getSeconds().toString().padStart(2, '0'),
   };
   
   return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => map[match] || match);
};

export const date = (name: string, rule: Rule, file: FileInfo): string => {
    const format = rule.params.format || 'YYYYMMDD';
    const source = rule.params.source || 'modified'; // created, modified, now
    const mode = rule.params.mode || 'replace';

    let targetDate = new Date();
    if (source === 'created') targetDate = file.created;
    else if (source === 'modified') targetDate = file.modified;
    // else 'now' -> new Date()

    const dateStr = formatDate(targetDate, format);

    if (mode === 'append') return name + dateStr;
    if (mode === 'prepend') return dateStr + name;
    return dateStr;
}
