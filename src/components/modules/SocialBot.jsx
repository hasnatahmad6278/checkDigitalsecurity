import React, { useState, useEffect, useRef } from 'react';
import { User, Bot, Send, AlertTriangle, ShieldX, Terminal, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SocialBot = () => {
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'SYSTEM_CONNECTED... WAITING for user input.' },
        { role: 'bot', text: 'Hello! This is Microsoft Security Support. We noticed an unauthorized login attempt on your account from IP: 185.23.44.11 (Moscow, RU).' },
        { role: 'bot', text: 'To secure your account, we have sent a 6-digit verification code to your registered mobile number. Could you please provide it here to block the attacker?' }
    ]);
    const [input, setInput] = useState('');
    const [isCompromised, setIsCompromised] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input || isCompromised) return;

        const newUserMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, newUserMsg]);
        setInput('');

        if (/^\d{6}$/.test(input.trim())) {
            setIsCompromised(true);
            return;
        }

        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsTyping(false);

        const attackerResponses = [
            "We understand your concern, but this is a time-sensitive matter. Without the code, your data may be exported.",
            "I am an authorized agent (ID: MS-8842). Please provide the code so we can secure your session.",
            "If you don't provide the code, we will have to lock your account for 72 hours for safety."
        ];

        const randomResp = attackerResponses[Math.floor(Math.random() * attackerResponses.length)];
        setMessages(prev => [...prev, { role: 'bot', text: randomResp }]);
    };

    return (
        <div style={{ height: '100%', position: 'relative' }}>
            <AnimatePresence>
                {isCompromised && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            zIndex: 100, background: 'rgba(244, 63, 94, 0.95)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            textAlign: 'center', padding: '2rem', backdropFilter: 'blur(12px)', borderRadius: '12px'
                        }}
                    >
                        <ShieldX size={80} color="#fff" className="pulse-alert" style={{ marginBottom: '1rem' }} />
                        <h1 className="mono" style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 'bold' }}>SECURITY_COMPROMISED</h1>
                        <p className="mono" style={{ color: '#fff', marginTop: '1rem', maxWidth: '500px' }}>
                            CRITICAL_ERROR: YOU_HANDED_OVER_THE_OTP. THE ATTACKER NOW HAS FULL CONTROL OF YOUR ACCOUNT.
                        </p>
                        <button
                            onClick={() => {
                                setIsCompromised(false);
                                setMessages([
                                    { role: 'bot', text: 'SYSTEM_REBOOT... SESSION_RESET.' },
                                    { role: 'bot', text: 'Hello! This is Microsoft Security Support. We noticed a login attempt...' }
                                ]);
                            }}
                            className="glass-card mono"
                            style={{ marginTop: '2rem', background: '#fff', color: 'var(--accent-danger)', border: 'none', padding: '1rem 2rem' }}
                        >
                            RESTART_SIMULATION
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <Bot className="neon-text pulse-alert" size={24} />
                    <div>
                        <h2 className="neon-text glitch-hover" style={{ fontSize: '1.2rem' }}>SOCIAL_ENGINEERING_BOT_LAB</h2>
                        <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--accent-danger)' }}>[WARNING: ACTIVE_ADVERSARY]</span>
                    </div>
                </div>

                <div
                    style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem', marginBottom: '1rem' }}
                >
                    {messages.map((msg, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={i}
                            style={{ display: 'flex', gap: '1rem', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                        >
                            {msg.role === 'bot' && <div className="glass-card" style={{ padding: '8px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', alignSelf: 'flex-start' }}><Bot size={16} color="var(--accent-danger)" /></div>}
                            <div
                                className="glass-card mono"
                                style={{
                                    padding: '0.8rem 1.2rem',
                                    maxWidth: '80%',
                                    fontSize: '0.9rem',
                                    background: msg.role === 'user' ? 'var(--accent-primary)' : 'rgba(15, 23, 42, 0.5)',
                                    color: msg.role === 'user' ? 'var(--bg-primary)' : 'var(--text-primary)',
                                    border: msg.role === 'user' ? 'none' : '1px solid var(--glass-border)',
                                    borderRadius: '12px'
                                }}
                            >
                                {msg.text}
                            </div>
                            {msg.role === 'user' && <div className="glass-card" style={{ padding: '8px', background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.2)', alignSelf: 'flex-start' }}><User size={16} color="var(--accent-primary)" /></div>}
                        </motion.div>
                    ))}
                    {isTyping && (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div className="glass-card" style={{ padding: '8px' }}><Loader2 className="animate-spin" size={16} color="var(--accent-danger)" /></div>
                            <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>ATTACKER_IS_TYPING...</div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Terminal size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="TYPE_MESSAGE..."
                            className="mono"
                            style={{ width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.5rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                        />
                    </div>
                    <button onClick={handleSend} className="btn-primary" style={{ padding: '0.8rem' }}><Send size={18} /></button>
                </div>
            </motion.div>
        </div>
    );
};

export default SocialBot;
