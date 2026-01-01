
import * as text from './text';
import { regex } from './regex';
import { sequence } from './sequence';
import { date } from './date';
import { metadata } from './metadata';
import { Rule, FileInfo, ProcessingContext } from '../types';

export type Transformer = (name: string, rule: Rule, file: FileInfo, context: ProcessingContext) => string;

const transformers: Record<string, Transformer> = {
    prefix: text.prefix,
    suffix: text.suffix,
    replace: text.replace,
    lowercase: text.lowercase,
    uppercase: text.uppercase,
    capitalize: text.capitalize,
    titlecase: text.titlecase,
    custom: text.custom,
    regex: regex,
    sequence: sequence,
    date: date,
    metadata: metadata,
};

export default transformers;
