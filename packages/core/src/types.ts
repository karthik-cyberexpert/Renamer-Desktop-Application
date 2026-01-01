
export type RuleType = 'prefix' | 'suffix' | 'replace' | 'regex' | 'case' | 'sequence' | 'date' | 'metadata' | 'lowercase' | 'uppercase' | 'capitalize' | 'titlecase' | 'custom';

export interface Rule {
  id: string;
  type: RuleType;
  params: Record<string, any>;
  active: boolean;
}

export interface FileInfo {
  originalName: string; // name + ext
  name: string; // name without ext
  extension: string; // .ext
  path: string; // full path
  size: number;
  created: Date;
  modified: Date;
  metadata?: Record<string, any>;
}

export interface ProcessingContext {
  index: number;
  total: number;
  files: FileInfo[];
}

export interface RenameResult {
  original: string; // full path
  newPath: string; // full path
  newName: string; // just filename
  error?: string;
}
