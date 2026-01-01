"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const run_js_1 = require("./commands/run.js");
const undo_js_1 = require("./commands/undo.js");
const program = new commander_1.Command();
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
    .action(run_js_1.run);
program.command('undo')
    .description('Undo operations from a log file')
    .requiredOption('-l, --log <file>', 'Log file')
    .action(undo_js_1.undo);
program.parse();
//# sourceMappingURL=index.js.map