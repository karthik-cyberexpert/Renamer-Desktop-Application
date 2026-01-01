
import fs from 'fs/promises';
import path from 'path';
import { applyRules, Rule, FileInfo, ProcessingContext } from '@renamer/core';

interface RunOptions {
    rules: string;
    target: string;
    dryRun?: boolean;
    recursive?: boolean;
}

export async function run(options: RunOptions) {
    const dryRun = options.dryRun !== false; // Default true if not specified as false (actually commander handles flags)
    // If user passed --no-dry-run, dryRun is false. If passed nothing, undefined? 
    // Wait, commander .option('--dry-run', 'desc', true) sets default to true.
    // So options.dryRun will be true by default.
    
    console.log('Options:', options);

    if (!options.rules || !options.target) {
        console.error('Error: --rules and --target are required.');
        process.exit(1);
    }
    
    try {
        const rulesContent = await fs.readFile(options.rules, 'utf-8');
        const rules: Rule[] = JSON.parse(rulesContent);
        
        const files = await scanFiles(options.target, options.recursive || false);
        console.log(`Found ${files.length} files.`);
        
        const context: ProcessingContext = {
            index: 0,
            total: files.length,
            files: [] // We fill this iteratively or need pre-scan?
            // Context.files is useful if sequence needs global knowledge?
            // For MVP sequence uses index. 
        };
        
        // Populate context files lite version
        context.files = files.map(f => ({
            originalName: path.basename(f.path),
            name: path.parse(f.path).name,
            extension: path.parse(f.path).ext,
            path: f.path,
            size: 0, created: new Date(), modified: new Date() // Stubs for context
        }));

        const results: any[] = [];

        for (const file of files) {
            const fileInfo: FileInfo = {
                originalName: path.basename(file.path),
                name: path.parse(file.path).name,
                extension: path.parse(file.path).ext,
                path: file.path,
                size: file.stats.size,
                created: file.stats.birthtime,
                modified: file.stats.mtime,
            };
            
            const result = applyRules(fileInfo, rules, context);
            
            console.log(`[${dryRun ? 'DRY-RUN' : 'RENAME'}] ${fileInfo.originalName} -> ${result.newName}`);
            

            if (!dryRun) {
                const newPath = path.join(path.dirname(file.path), result.newName);
                let opStatus: 'success' | 'skip' | 'error' = 'success';
                let errorMsg;

                if (newPath !== file.path) {
                    try {
                        await fs.access(newPath);
                        console.error(`  Error: Target ${result.newName} exists. Skipping.`);
                        opStatus = 'skip';
                        errorMsg = 'Target exists';
                    } catch {
                         try {
                             await fs.rename(file.path, newPath);
                         } catch (err: any) {
                             opStatus = 'error';
                             errorMsg = err.message;
                             console.error(`  Error renaming: ${err.message}`);
                         }
                    }
                }
                
                if (opStatus === 'success') {
                    results.push({
                        original: file.path,
                        new: newPath,
                        status: opStatus
                    });
                }
            }
        }
        
        if (!dryRun && results.length > 0) {
            console.log(`Writing log with ${results.length} entries...`);
            const logFile = path.join(process.cwd(), `renamer-log-${Date.now()}.json`);
            await fs.writeFile(logFile, JSON.stringify({
                timestamp: new Date().toISOString(),
                operations: results
            }, null, 2));
            console.log(`Operation log saved to ${logFile}`);
        }

    } catch (e: any) {
        console.error('Error:', e.message);
        process.exit(1);
    }
}

async function scanFiles(dir: string, recursive: boolean): Promise<{path: string, stats: any}[]> {
    let results: {path: string, stats: any}[] = [];
    const list = await fs.readdir(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        if (stat && stat.isDirectory()) {
            if (recursive) {
                results = results.concat(await scanFiles(filePath, recursive));
            }
        } else {
            results.push({ path: filePath, stats: stat });
        }
    }
    return results;
}
