import { AlertTriangle } from 'lucide-react';

interface RenameConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    count: number;
}

export function RenameConfirmationModal({ isOpen, onClose, onConfirm, count }: RenameConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 z-50 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
                onClick={onClose}
            />
            
            {/* Modal */}
            <div 
                className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-2xl p-6 overflow-hidden"
                style={{ 
                    background: '#141419',
                    border: '1px solid rgba(139,92,246,0.2)',
                    boxShadow: '0 0 40px rgba(0,0,0,0.6), 0 0 20px rgba(139,92,246,0.1)'
                }}
            >
                {/* Glow Background Effect */}
                <div 
                    className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20 pointer-events-none"
                    style={{ background: '#8b5cf6' }}
                />

                {/* Header */}
                <div className="flex flex-col items-center text-center mb-6 relative">
                    <div className="mb-4 p-4 rounded-full" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}>
                        <AlertTriangle size={32} style={{ color: '#eab308' }} />
                    </div>
                    <h2 className="text-xl font-bold mb-2" style={{ color: '#e4e4e7' }}>Confirm Rename</h2>
                    <p className="text-sm leading-relaxed" style={{ color: '#a1a1aa' }}>
                        Are you sure you want to rename <span className="font-bold underline" style={{ color: '#8b5cf6' }}>{count}</span> {count === 1 ? 'file' : 'files'}? 
                        <br />This action cannot be easily undone.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 relative">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl font-medium transition-all"
                        style={{ background: '#1e1e26', border: '1px solid rgba(255,255,255,0.06)', color: '#71717a' }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = '#262630';
                            e.currentTarget.style.color = '#a1a1aa';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = '#1e1e26';
                            e.currentTarget.style.color = '#71717a';
                        }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 py-2.5 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
                        style={{ 
                            background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                            boxShadow: '0 4px 12px rgba(239,68,68,0.2)'
                        }}
                    >
                        Yes, Rename
                    </button>
                </div>
            </div>
        </>
    );
}
