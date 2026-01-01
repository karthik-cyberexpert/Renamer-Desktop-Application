
import { Command } from 'commander';
import { run } from './commands/run.js';
import { undo } from './commands/undo.js';

const program = new Command();

program
  .name('renamer')
  .description('Bulk file renamer')
  .version('0.1.0');

program.command('run')
  .description('Run renaming rules')
  .option('-r, --rules <file>', 'Rules JSON file')
  .option('-t, --target <dir>', 'Target directory')
  .option('--dry-run', 'Dry run')
  .option('--no-dry-run', 'Disable dry run')
  .option('--recursive', 'Recursive search')
  .action(run);

program.command('undo')
  .description('Undo operations from a log file')
  .requiredOption('-l, --log <file>', 'Log file')
  .action(undo);

program.parse();
