
import { useState } from 'react';
import { Rule } from '@renamer/core';
import { Plus, X, GripVertical, Layers, ChevronDown, Code, Type, Hash, Calendar, Wand2 } from 'lucide-react';

interface RuleBuilderProps {
    rules: Rule[];
    onChange: (rules: Rule[]) => void;
}

const inputStyle = {
    background: '#0d0d12',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#e4e4e7',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    outline: 'none',
    width: '100%'
};

const textareaStyle = {
    ...inputStyle,
    minHeight: '80px',
    fontFamily: 'monospace',
    fontSize: '12px',
    resize: 'vertical' as const
};

export function RuleBuilder({ rules, onChange }: RuleBuilderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const addRule = (type: any) => {
        const newRule: Rule = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            params: {},
            active: true
        };
        onChange([...rules, newRule]);
        setIsMenuOpen(false);
    };

    const removeRule = (id: string) => {
        onChange(rules.filter(r => r.id !== id));
    };
    
    const updateRule = (id: string, updates: Partial<Rule>) => {
        onChange(rules.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    const ruleTypes = [
        { type: 'prefix', label: 'Prefix', desc: 'Add text at the start', icon: Type },
        { type: 'suffix', label: 'Suffix', desc: 'Add text at the end', icon: Type },
        { type: 'replace', label: 'Replace', desc: 'Find and replace text', icon: Wand2 },
        { type: 'sequence', label: 'Sequence', desc: 'Add numbering', icon: Hash },
        { type: 'date', label: 'Date', desc: 'Add date/time', icon: Calendar },
        { type: 'divider', label: '', desc: '' },
        { type: 'lowercase', label: 'Lowercase', desc: 'Convert to lowercase', icon: Type },
        { type: 'uppercase', label: 'Uppercase', desc: 'CONVERT TO UPPERCASE', icon: Type },
        { type: 'capitalize', label: 'Capitalize', desc: 'Capitalize Each Word', icon: Type },
        { type: 'titlecase', label: 'Title Case', desc: 'Smart Title Case', icon: Type },
        { type: 'divider2', label: '', desc: '' },
        { type: 'custom', label: 'Custom Rule', desc: 'Write your own expression', icon: Code },
    ];

    const getRuleIcon = (type: string) => {
        const ruleType = ruleTypes.find(r => r.type === type);
        return ruleType?.icon || Type;
    };

    return (
        <div className="flex flex-col h-full">
            <header className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2">
                    <Layers size={16} style={{ color: '#8b5cf6' }} />
                    <span className="font-semibold text-sm" style={{ color: '#e4e4e7' }}>Rules</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#1e1e26', color: '#71717a' }}>{rules.length}</span>
                </div>
                <div className="relative">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-1.5 text-xs font-medium text-white px-3 py-1.5 rounded-lg transition-all hover:shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' }}
                    >
                        <Plus size={12} /> Add Rule <ChevronDown size={12} />
                    </button>
                    {isMenuOpen && (
                        <>
                            <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setIsMenuOpen(false)}
                            />
                            <div 
                                className="absolute right-0 top-full mt-2 rounded-lg w-52 py-2 z-20 max-h-80 overflow-y-auto"
                                style={{ background: '#1e1e26', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                            >
                                {ruleTypes.map(({ type, label, desc, icon: Icon }) => {
                                    if (type.startsWith('divider')) {
                                        return (
                                            <div key={type} className="my-2 mx-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />
                                        );
                                    }
                                    return (
                                        <button 
                                            key={type} 
                                            onClick={() => addRule(type)} 
                                            className="flex items-start gap-3 w-full text-left px-4 py-2.5 transition-colors"
                                            style={{ color: '#e4e4e7' }}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#262630'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            {Icon && <Icon size={14} className="mt-0.5" style={{ color: '#8b5cf6' }} />}
                                            <div>
                                                <span className="text-sm font-medium block">{label}</span>
                                                <span className="text-xs" style={{ color: '#71717a' }}>{desc}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </header>
            
            <div className="flex-1 overflow-auto p-4 space-y-3">
                {rules.map((rule) => {
                    const Icon = getRuleIcon(rule.type);
                    return (
                        <div 
                            key={rule.id} 
                            className="rounded-xl p-4 group transition-all duration-200"
                            style={{ 
                                background: 'rgba(30,30,38,0.6)', 
                                border: '1px solid rgba(255,255,255,0.06)',
                                backdropFilter: 'blur(8px)'
                            }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <GripVertical size={14} className="cursor-move opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: '#71717a' }} />
                                <Icon size={14} style={{ color: '#8b5cf6' }} />
                                <span className="text-sm font-medium capitalize" style={{ color: '#e4e4e7' }}>
                                    {rule.type === 'titlecase' ? 'Title Case' : rule.type}
                                </span>
                                <div className="flex-1" />
                                <button 
                                    onClick={() => removeRule(rule.id)} 
                                    className="p-1 rounded-lg transition-colors"
                                    style={{ color: '#71717a' }}
                                    onMouseOver={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.color = '#71717a'; e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                            
                            <div className="pl-7 space-y-3">
                                 {rule.type === 'prefix' && (
                                     <input 
                                        type="text" 
                                        placeholder="Enter prefix text..." 
                                        style={inputStyle}
                                        value={rule.params.value || ''}
                                        onChange={e => updateRule(rule.id, { params: { ...rule.params, value: e.target.value } })}
                                     />
                                 )}
                                 {rule.type === 'suffix' && (
                                     <input 
                                        type="text" 
                                        placeholder="Enter suffix text..." 
                                        style={inputStyle}
                                        value={rule.params.value || ''}
                                        onChange={e => updateRule(rule.id, { params: { ...rule.params, value: e.target.value } })}
                                     />
                                 )}
                                 {rule.type === 'replace' && (
                                     <div className="space-y-2">
                                        <input 
                                            type="text" 
                                            placeholder="Find..." 
                                            style={inputStyle}
                                            value={rule.params.find || ''}
                                            onChange={e => updateRule(rule.id, { params: { ...rule.params, find: e.target.value } })}
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Replace with..." 
                                            style={inputStyle}
                                            value={rule.params.replace || ''}
                                            onChange={e => updateRule(rule.id, { params: { ...rule.params, replace: e.target.value } })}
                                        />
                                     </div>
                                 )}
                                 {rule.type === 'sequence' && (
                                     <div className="flex gap-3">
                                         <div className="flex-1">
                                            <label className="text-xs mb-1 block" style={{ color: '#71717a' }}>Start</label>
                                            <input 
                                                type="number" 
                                                style={inputStyle}
                                                value={rule.params.start || 1} 
                                                onChange={e => updateRule(rule.id, { params: { ...rule.params, start: Number(e.target.value) } })} 
                                            />
                                         </div>
                                         <div className="flex-1">
                                            <label className="text-xs mb-1 block" style={{ color: '#71717a' }}>Padding</label>
                                            <input 
                                                type="number" 
                                                style={inputStyle}
                                                value={rule.params.padding || 3} 
                                                onChange={e => updateRule(rule.id, { params: { ...rule.params, padding: Number(e.target.value) } })} 
                                            />
                                         </div>
                                     </div>
                                 )}
                                 {rule.type === 'date' && (
                                     <input 
                                        type="text" 
                                        placeholder="Date format (e.g., YYYY-MM-DD)" 
                                        style={inputStyle}
                                        value={rule.params.format || ''}
                                        onChange={e => updateRule(rule.id, { params: { ...rule.params, format: e.target.value } })}
                                     />
                                 )}
                                 {/* Case rules don't need input */}
                                 {['lowercase', 'uppercase', 'capitalize', 'titlecase'].includes(rule.type) && (
                                     <div className="text-xs py-2 px-3 rounded-lg" style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa' }}>
                                         This rule has no parameters. It will be applied to all file names.
                                     </div>
                                 )}
                                 {/* Custom rule */}
                                 {rule.type === 'custom' && (
                                     <div className="space-y-2">
                                        <textarea 
                                            placeholder="JavaScript expression... (use 'name' variable)&#10;&#10;Examples:&#10;name.replace(/[_-]/g, ' ')&#10;name.split('').reverse().join('')&#10;name.substring(0, 10)"
                                            style={textareaStyle}
                                            value={rule.params.expression || ''}
                                            onChange={e => updateRule(rule.id, { params: { ...rule.params, expression: e.target.value } })}
                                        />
                                        <div className="text-xs py-2 px-3 rounded-lg" style={{ background: 'rgba(6,182,212,0.1)', color: '#67e8f9' }}>
                                            💡 Write a JS expression using <code className="px-1 rounded" style={{ background: 'rgba(0,0,0,0.3)' }}>name</code> variable. 
                                            The result will be the new filename.
                                        </div>
                                     </div>
                                 )}
                            </div>
                        </div>
                    );
                })}
                
                {rules.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12" style={{ color: '#71717a' }}>
                        <Layers size={32} className="mb-3 opacity-30" />
                        <p className="text-sm">No rules added</p>
                        <p className="text-xs mt-1">Click "Add Rule" to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
}
