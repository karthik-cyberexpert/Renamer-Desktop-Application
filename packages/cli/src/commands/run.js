"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const core_1 = require("@renamer/core");
async function run(options) {
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
        const rulesContent = await promises_1.default.readFile(options.rules, 'utf-8');
        const rules = JSON.parse(rulesContent);
        const files = await scanFiles(options.target, options.recursive || false);
        console.log(`Found ${files.length} files.`);
        const context = {
            index: 0,
            total: files.length,
            files: [] // We fill this iteratively or need pre-scan?
            // Context.files is useful if sequence needs global knowledge?
            // For MVP sequence uses index. 
        };
        // Populate context files lite version
        context.files = files.map(f => ({
            originalName: path_1.default.basename(f.path),
            name: path_1.default.parse(f.path).name,
            extension: path_1.default.parse(f.path).ext,
            path: f.path,
            size: 0, created: new Date(), modified: new Date() // Stubs for context
        }));
        const results = [];
        for (const file of files) {
            const fileInfo = {
                originalName: path_1.default.basename(file.path),
                name: path_1.default.parse(file.path).name,
                extension: path_1.default.parse(file.path).ext,
                path: file.path,
                size: file.stats.size,
                created: file.stats.birthtime,
                modified: file.stats.mtime,
            };
            const result = (0, core_1.applyRules)(fileInfo, rules, context);
            console.log(`[${dryRun ? 'DRY-RUN' : 'RENAME'}] ${fileInfo.originalName} -> ${result.newName}`);
            if (!dryRun) {
                const newPath = path_1.default.join(path_1.default.dirname(file.path), result.newName);
                let opStatus = 'success';
                let errorMsg;
                if (newPath !== file.path) {
                    try {
                        await promises_1.default.access(newPath);
                        console.error(`  Error: Target ${result.newName} exists. Skipping.`);
                        opStatus = 'skip';
                        errorMsg = 'Target exists';
                    }
                    catch {
                        try {
                            await promises_1.default.rename(file.path, newPath);
                        }
                        catch (err) {
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
            const logFile = path_1.default.join(process.cwd(), `renamer-log-${Date.now()}.json`);
            await promises_1.default.writeFile(logFile, JSON.stringify({
                timestamp: new Date().toISOString(),
                operations: results
            }, null, 2));
            console.log(`Operation log saved to ${logFile}`);
        }
    }
    catch (e) {
        console.error('Error:', e.message);
        process.exit(1);
    }
}
async function scanFiles(dir, recursive) {
    let results = [];
    const list = await promises_1.default.readdir(dir);
    for (const file of list) {
        const filePath = path_1.default.join(dir, file);
        const stat = await promises_1.default.stat(filePath);
        if (stat && stat.isDirectory()) {
            if (recursive) {
                results = results.concat(await scanFiles(filePath, recursive));
            }
        }
        else {
            results.push({ path: filePath, stats: stat });
        }
    }
    return results;
}
//# sourceMappingURL=run.js.map