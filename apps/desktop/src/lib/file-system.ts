
import { readDir, stat, rename } from '@tauri-apps/plugin-fs';
import { dirname, join } from '@tauri-apps/api/path';
import { FileInfo } from '@renamer/core';

// Directories to skip during scanning
const IGNORED_DIRS = new Set([
    'node_modules',
    '.git',
    '.svn',
    '.hg',
    'dist',
    'build',
    '.next',
    '.cache',
    '__pycache__',
    '.venv',
    'venv',
    'target',
    '.idea',
    '.vscode'
]);

// Get file extension from filename
function getExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    if (lastDot === -1 || lastDot === 0) return '';
    return filename.substring(lastDot);
}

/**
 * Does a quick shallow scan of immediate entries to estimate size.
 * Returns the count of direct files and number of subdirectories.
 */
export async function getFolderStats(dir: string): Promise<{ fileCount: number, dirCount: number }> {
    try {
        const entries = await readDir(dir);
        let fileCount = 0;
        let dirCount = 0;
        for (const entry of entries) {
            if (entry.isDirectory) {
                if (!IGNORED_DIRS.has(entry.name)) dirCount++;
            } else {
                fileCount++;
            }
        }
        return { fileCount, dirCount };
    } catch (e) {
        console.error("[getFolderStats] Error:", e);
        return { fileCount: 0, dirCount: 0 };
    }
}

export async function scanFiles(
    dir: string, 
    recursive: boolean = false, 
    onProgress?: (count: number) => void,
    _currentCount: { val: number } = { val: 0 }
): Promise<FileInfo[]> {
    console.log('[scanFiles] Starting scan of:', dir, 'recursive:', recursive);
    try {
        const entries = await readDir(dir);
        console.log('[scanFiles] Found', entries.length, 'entries');
        let files: FileInfo[] = [];
    
        for (const entry of entries) {
            if (entry.isDirectory) {
                // Skip ignored directories
                if (IGNORED_DIRS.has(entry.name)) {
                    console.log('[scanFiles] Skipping ignored dir:', entry.name);
                    continue;
                }
                
                if (recursive) {
                    try {
                        const subDir = await join(dir, entry.name);
                        const subFiles = await scanFiles(subDir, recursive, onProgress, _currentCount);
                        files = files.concat(subFiles);
                    } catch (subErr) {
                        console.warn('[scanFiles] Could not scan subdirectory:', entry.name, subErr);
                    }
                }
            } else {
                // It's a file
                try {
                    const filePath = await join(dir, entry.name);
                    const stats = await stat(filePath);
                    
                    // Get extension using our own function (more reliable)
                    const extension = getExtension(entry.name);
                    const name = extension 
                        ? entry.name.substring(0, entry.name.length - extension.length)
                        : entry.name;
                    
                    files.push({
                        originalName: entry.name,
                        name,
                        extension,
                        path: filePath,
                        size: stats.size,
                        created: stats.birthtime || new Date(),
                        modified: stats.mtime || new Date()
                    });
                    
                    _currentCount.val++;
                    if (onProgress) onProgress(_currentCount.val);
                } catch (fileErr) {
                    console.warn('[scanFiles] Could not get stats for:', entry.name, fileErr);
                }
            }
        }
        console.log('[scanFiles] Returning', files.length, 'files from', dir);
        return files;
    } catch (e) {
        console.error("[scanFiles] Error scanning", dir, e);
        return [];
    }
}

export async function performRename(oldPath: string, newName: string): Promise<void> {
    console.log('[performRename] Called with:', { oldPath, newName });
    
    try {
        // Get the parent directory
        const parent = await dirname(oldPath);
        const newPath = await join(parent, newName);
        
        console.log('[performRename] Renaming:', oldPath, '->', newPath);
        await rename(oldPath, newPath);
        console.log('[performRename] Success!');
    } catch (e) {
        console.error('[performRename] Error:', e);
        throw e;
    }
}
