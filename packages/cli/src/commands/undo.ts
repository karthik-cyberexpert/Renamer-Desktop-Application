
import fs from 'fs/promises';
import path from 'path';

interface UndoOptions {
    log: string;
}

export async function undo(options: UndoOptions) {
    if (!options.log) {
        console.error('Log file is required for undo.');
        process.exit(1);
    }
    
    try {
        const logContent = await fs.readFile(options.log, 'utf-8');
        const log = JSON.parse(logContent);
        
        console.log(`Undoing operations from ${log.timestamp}`);
        
        // Reverse operations
        const ops = log.operations.reverse();
        
        for (const op of ops) {
            if (op.status === 'success') {
                try {
                    console.log(`Restoring ${path.basename(op.new)} -> ${path.basename(op.original)}`);
                     // Check if original exists? (It shouldn't if renamed)
                     // Check if current (new) exists?
                    await fs.rename(op.new, op.original);
                } catch (e: any) {
                    console.error(`Error restoring ${op.new}: ${e.message}`);
                }
            }
        }
        
    } catch (e: any) {
        console.error('Undo failed:', e.message);
        process.exit(1);
    }
}
