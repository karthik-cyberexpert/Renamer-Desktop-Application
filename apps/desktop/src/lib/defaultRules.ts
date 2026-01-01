import { Rule } from '@renamer/core';

/**
 * Default rules to initialize the app with.
 * Users can modify or replace these through the Rule Builder.
 */
export const defaultRules: Rule[] = [
  {
    id: 'default-1',
    type: 'replace',
    active: true,
    params: {
      find: '_',
      replace: '-',
      useRegex: false,
      caseSensitive: false
    }
  }
];
