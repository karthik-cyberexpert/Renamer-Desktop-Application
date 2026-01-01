"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.undo = undo;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
async function undo(options) {
    if (!options.log) {
        console.error('Log file is required for undo.');
        process.exit(1);
    }
    try {
        const logContent = await promises_1.default.readFile(options.log, 'utf-8');
        const log = JSON.parse(logContent);
        console.log(`Undoing operations from ${log.timestamp}`);
        // Reverse operations
        const ops = log.operations.reverse();
        for (const op of ops) {
            if (op.status === 'success') {
                try {
                    console.log(`Restoring ${path_1.default.basename(op.new)} -> ${path_1.default.basename(op.original)}`);
                    // Check if original exists? (It shouldn't if renamed)
                    // Check if current (new) exists?
                    await promises_1.default.rename(op.new, op.original);
                }
                catch (e) {
                    console.error(`Error restoring ${op.new}: ${e.message}`);
                }
            }
        }
    }
    catch (e) {
        console.error('Undo failed:', e.message);
        process.exit(1);
    }
}
//# sourceMappingURL=undo.js.map