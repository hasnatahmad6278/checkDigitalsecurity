import React, { useState, useEffect } from 'react';
import zxcvbn from 'zxcvbn';
import { Shield, ShieldAlert, ShieldCheck, Info, Clock, Unlock, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PasswordAuditor = () => {
    const [password, setPassword] = useState('');
    const [result, setResult] = useState(null);
    const [entropy, setEntropy] = useState(0);

    const GPU_HASH_RATE = 10000000000;

    useEffect(() => {
        if (password) {
            const z = zxcvbn(password);
            setResult(z);
            const bits = z.guesses_log10 * Math.log2(10);
            setEntropy(bits);
        } else {
            setResult(null);
            setEntropy(0);
        }
    }, [password]);

    const getStrengthColor = (score) => {
        const colors = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#22d3ee'];
        return colors[score] || 'rgba(34, 211, 238, 0.2)';
    };

    const getStrengthLabel = (score) => {
        const labels = ['CRITICAL_VULNERABILITY', 'WEAK_SIGNAL', 'MODERATE_SHIELD', 'STRONG_ENCRYPTION', 'MAXIMUM_SECURITY'];
        return labels[score] || 'IDLE';
    };

    const formatTime = (seconds) => {
        if (seconds < 1) return "< 1 SECONDS";
        if (seconds < 60) return `${Math.floor(seconds)} SECONDS`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)} MINUTES`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} HOURS`;
        if (seconds < 31536000) return `${Math.floor(seconds / 86400)} DAYS`;
        if (seconds < 3153600000) return `${Math.floor(seconds / 31536000)} YEARS`;
        return "CENTURIES";
    };

    const bruteForceSeconds = result ? Math.pow(10, result.guesses_log10) / GPU_HASH_RATE : 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Unlock className="neon-text pulse-alert" size={24} />
                <h2 className="neon-text glitch-hover">ROUTER_STRESS_SIMULATOR (V1.2)</h2>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <label className="mono" style={{ display: 'block', marginBottom: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    [TARGET_PASSWORD_INPUT]
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ENTER_HASH_TO_DECRYPT..."
                    className="mono"
                    style={{ fontSize: '1.2rem', padding: '1.2rem', background: 'rgba(0,0,0,0.5)', width: '100%', border: '1px solid var(--glass-border)' }}
                />
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div>
                                    <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>DECRYPTION_STATUS:</span>
                                    <div className="mono" style={{ color: getStrengthColor(result.score), fontSize: '1.1rem', fontWeight: 'bold' }}>
                                        {getStrengthLabel(result.score)}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>SHANNON_ENTROPY:</span>
                                    <div className="mono" style={{ color: 'var(--accent-secondary)', fontSize: '1.1rem' }}>
                                        {entropy.toFixed(2)} BITS
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(result.score + 1) * 20}%` }}
                                    style={{ height: '100%', background: getStrengthColor(result.score), boxShadow: `0 0 15px ${getStrengthColor(result.score)}` }}
                                />
                            </div>
                        </div>

                        <div className="glass-card" style={{ background: 'rgba(244, 63, 94, 0.05)', border: `1px solid ${bruteForceSeconds < 3600 ? 'var(--accent-danger)' : 'var(--glass-border)'}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                                <Activity className={bruteForceSeconds < 3600 ? 'pulse-alert' : ''} color={bruteForceSeconds < 3600 ? 'var(--accent-danger)' : 'var(--accent-primary)'} size={18} />
                                <span className="mono" style={{ color: bruteForceSeconds < 3600 ? 'var(--accent-danger)' : 'var(--accent-primary)' }}>RTX_4090_BRUTEFORCE_ESTIMATE</span>
                            </div>
                            <div className="mono" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                                ETA: {formatTime(bruteForceSeconds)}
                            </div>
                            <p className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                *CALCULATED_USING_10_BILLION_HASHES/SEC (OFFLINE_ATTACK_SIMULATION)
                            </p>
                        </div>

                        {result.feedback.warning && (
                            <div className="glass-card" style={{ display: 'flex', gap: '1rem', marginTop: '1rem', background: 'rgba(244, 63, 94, 0.1)', borderLeft: '3px solid var(--accent-danger)' }}>
                                <ShieldAlert className="pulse-alert" style={{ color: 'var(--accent-danger)' }} size={20} />
                                <div>
                                    <p className="mono" style={{ color: 'var(--accent-danger)', fontSize: '0.8rem', marginBottom: '0.2rem' }}>SECURITY_ALERT</p>
                                    <p className="mono" style={{ fontSize: '0.85rem' }}>{result.feedback.warning.toUpperCase()}</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default PasswordAuditor;
