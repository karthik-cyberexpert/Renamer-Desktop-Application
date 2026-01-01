
import { X, HelpCircle, FolderOpen, Plus, Play, CheckSquare, Lightbulb } from 'lucide-react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 z-50"
                style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
                onClick={onClose}
            />
            
            {/* Modal */}
            <div 
                className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] overflow-auto rounded-2xl p-6"
                style={{ 
                    background: '#141419',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' }}>
                            <HelpCircle size={20} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold" style={{ color: '#e4e4e7' }}>How to Use Renamer</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: '#71717a' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#1e1e26'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-6" style={{ color: '#a1a1aa' }}>
                    
                    {/* Step 1 */}
                    <div className="flex gap-4">
                        <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#8b5cf6', color: 'white' }}>1</div>
                        <div>
                            <h3 className="font-semibold mb-2" style={{ color: '#e4e4e7' }}>
                                <FolderOpen size={16} className="inline mr-2" style={{ color: '#8b5cf6' }} />
                                Open a Folder
                            </h3>
                            <p className="text-sm leading-relaxed">
                                Click the <strong style={{ color: '#e4e4e7' }}>"Open Folder"</strong> button on the left side. 
                                Choose any folder that contains the files you want to rename. 
                                All files in that folder will appear in the center of the screen.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4">
                        <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#8b5cf6', color: 'white' }}>2</div>
                        <div>
                            <h3 className="font-semibold mb-2" style={{ color: '#e4e4e7' }}>
                                <Plus size={16} className="inline mr-2" style={{ color: '#8b5cf6' }} />
                                Add Renaming Rules
                            </h3>
                            <p className="text-sm leading-relaxed mb-3">
                                Click <strong style={{ color: '#e4e4e7' }}>"Add Rule"</strong> on the right side and pick a rule type:
                            </p>
                            <ul className="text-sm space-y-2 pl-4">
                                <li><strong style={{ color: '#06b6d4' }}>Prefix</strong> — Adds text at the beginning (e.g., "IMG_photo.jpg")</li>
                                <li><strong style={{ color: '#06b6d4' }}>Suffix</strong> — Adds text before the extension (e.g., "photo_2024.jpg")</li>
                                <li><strong style={{ color: '#06b6d4' }}>Replace</strong> — Find and replace text in filenames</li>
                                <li><strong style={{ color: '#06b6d4' }}>Lowercase/Uppercase</strong> — Change the case of filenames</li>
                                <li><strong style={{ color: '#06b6d4' }}>Sequence</strong> — Add numbers like 001, 002, 003...</li>
                                <li><strong style={{ color: '#06b6d4' }}>Custom</strong> — Write your own JavaScript expression</li>
                            </ul>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4">
                        <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#8b5cf6', color: 'white' }}>3</div>
                        <div>
                            <h3 className="font-semibold mb-2" style={{ color: '#e4e4e7' }}>
                                <CheckSquare size={16} className="inline mr-2" style={{ color: '#8b5cf6' }} />
                                Preview Your Changes
                            </h3>
                            <p className="text-sm leading-relaxed">
                                Look at the center table — you'll see the <strong style={{ color: '#a1a1aa' }}>original names</strong> on the left 
                                and the <strong style={{ color: '#06b6d4' }}>new names</strong> on the right. 
                                Changes update instantly as you modify rules!
                            </p>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-4">
                        <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#8b5cf6', color: 'white' }}>4</div>
                        <div>
                            <h3 className="font-semibold mb-2" style={{ color: '#e4e4e7' }}>
                                <Play size={16} className="inline mr-2" style={{ color: '#8b5cf6' }} />
                                Apply Changes
                            </h3>
                            <p className="text-sm leading-relaxed">
                                When you're happy with the preview, click <strong style={{ color: '#e4e4e7' }}>"Apply Changes"</strong>. 
                                Your files will be renamed immediately. That's it!
                            </p>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="rounded-xl p-4" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                        <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#06b6d4' }}>
                            <Lightbulb size={16} /> Pro Tips
                        </h3>
                        <ul className="text-sm space-y-2">
                            <li>💡 <strong style={{ color: '#e4e4e7' }}>Selection Mode:</strong> Click "Selection" to rename only specific files</li>
                            <li>💡 <strong style={{ color: '#e4e4e7' }}>Multiple Rules:</strong> Add multiple rules — they apply in order from top to bottom</li>
                            <li>💡 <strong style={{ color: '#e4e4e7' }}>Remove Rules:</strong> Click the X button on any rule to remove it</li>
                            <li>💡 <strong style={{ color: '#e4e4e7' }}>Undo:</strong> If something goes wrong, press Ctrl+Z in File Explorer</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button 
                        onClick={onClose}
                        className="w-full py-2.5 rounded-lg font-medium text-white transition-all"
                        style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' }}
                    >
                        Got it, let's go!
                    </button>
                </div>
            </div>
        </>
    );
}
