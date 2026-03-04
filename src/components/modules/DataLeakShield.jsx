import React, { useState } from 'react';
import { ShieldAlert, Mail, Lock, Search, AlertCircle, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DataLeakShield = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailResult, setEmailResult] = useState(null);
    const [passResult, setPassResult] = useState(null);
    const [loadingEmail, setLoadingEmail] = useState(false);
    const [loadingPass, setLoadingPass] = useState(false);

    // Helper: SHA-1 hashing (browser-native)
    const sha1 = async (str) => {
        const buffer = new TextEncoder().encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    };

    const checkEmailBreach = async () => {
        if (!email) return;
        setLoadingEmail(true);
        setEmailResult(null);

        try {
            // NOTE: HIBP API v3 requires an API Key for account breaches. 
            // This is a simulation/information handler if no key is present.
            // In a real app, this would call a backend proxy with the key.

            const response = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`, {
                headers: {
                    'hibp-api-key': 'YOUR_API_KEY_HERE' // Placeholder
                }
            });

            if (response.status === 404) {
                setEmailResult({ pwned: false });
            } else if (response.status === 200) {
                const data = await response.json();
                setEmailResult({ pwned: true, breaches: data });
            } else if (response.status === 401) {
                // Handle missing/invalid key - simulate a response for demo aesthetics
                // In a real environment, you'd show a "Sign up for API key" message
                setEmailResult({ error: 'API_KEY_REQUIRED', message: 'HIBP API requires an authorized key for email lookups.' });
            }
        } catch (err) {
            setEmailResult({ error: 'FETCH_ERROR', message: 'Could not connect to HIBP security servers.' });
        } finally {
            setLoadingEmail(false);
        }
    };

    const checkPasswordBreach = async () => {
        if (!password) return;
        setLoadingPass(true);
        setPassResult(null);

        try {
            const fullHash = await sha1(password);
            const prefix = fullHash.substring(0, 5);
            const suffix = fullHash.substring(5);

            const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
            const text = await response.text();

            const lines = text.split('\n');
            const match = lines.find(line => line.startsWith(suffix));

            if (match) {
                const count = match.split(':')[1];
                setPassResult({ pwned: true, count: parseInt(count).toLocaleString() });
            } else {
                setPassResult({ pwned: false });
            }
        } catch (err) {
            setPassResult({ error: 'FETCH_ERROR', message: 'Could not reach Pwned Passwords API.' });
        } finally {
            setLoadingPass(false);
        }
    };

    const ActionRequired = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="neon-border"
            style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'rgba(255, 49, 49, 0.1)',
                borderLeft: '4px solid var(--accent-alert)',
                borderRadius: '8px'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                <AlertCircle style={{ color: 'var(--accent-alert)' }} size={24} />
                <h3 className="mono" style={{ color: 'var(--accent-alert)', fontSize: '1.2rem' }}>ACTION REQUIRED</h3>
            </div>
            <ul style={{ color: 'var(--text-primary)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <li>• <strong className="neon-text">Change Passwords:</strong> Evacuate the compromised account and update credentials immediately.</li>
                <li>• <strong className="neon-text">Enable MFA:</strong> Activate Multi-Factor Authentication (TOTP/Security Key) on all critical services.</li>
                <li>• <strong className="neon-text">Credential Uniqueness:</strong> Use a Password Manager to ensure every single account has a unique, complex secret.</li>
            </ul>
        </motion.div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <ShieldAlert className="neon-text" size={24} />
                <h2 className="neon-text glitch-hover">PERSONAL_DATA_LEAK_SHIELD</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                {/* Email Breach Checker */}
                <div className="glass-card" style={{ background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                        <Mail className="neon-text" size={20} />
                        <h3 className="mono" style={{ fontSize: '1rem' }}>EMAIL_BREACH_CHECKER</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="email"
                            placeholder="operator@nexus.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mono"
                            style={{ fontSize: '0.9rem' }}
                        />
                        <button
                            onClick={checkEmailBreach}
                            disabled={loadingEmail}
                            className="glass-card neon-border"
                            style={{ padding: '0 1rem', background: 'transparent', color: 'var(--accent-primary)' }}
                        >
                            {loadingEmail ? '...' : <Search size={18} />}
                        </button>
                    </div>

                    <div style={{ marginTop: '1.5rem', minHeight: '100px' }}>
                        <AnimatePresence mode="wait">
                            {emailResult && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    {emailResult.pwned ? (
                                        <div style={{ padding: '1rem', background: 'rgba(255, 49, 49, 0.05)', border: '1px solid var(--accent-alert)', borderRadius: '6px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-alert)' }}>
                                                <AlertCircle size={16} />
                                                <span className="mono">BREACH_DETECTED</span>
                                            </div>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Found in {emailResult.breaches.length} security events.</p>
                                        </div>
                                    ) : emailResult.error === 'API_KEY_REQUIRED' ? (
                                        <div style={{ padding: '1rem', background: 'rgba(0, 243, 255, 0.05)', border: '1px solid var(--accent-secondary)', borderRadius: '6px' }}>
                                            <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>[SIGNAL_BLOCKED]</p>
                                            <p style={{ fontSize: '0.8rem', marginTop: '0.4rem' }}>HIBP API requires an identity key for email lookup. Password check (k-Anonymity) is operational below.</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}>
                                            <CheckCircle size={16} />
                                            <span className="mono">CLEAN_SIGNAL</span>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Pwned Password Checker */}
                <div className="glass-card" style={{ background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                        <Lock className="neon-text" size={20} />
                        <h3 className="mono" style={{ fontSize: '1rem' }}>PWNED_PASSWORD_VAULT</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="password"
                            placeholder="SECURE_PHRASE_HERE"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mono"
                            style={{ fontSize: '0.9rem' }}
                        />
                        <button
                            onClick={checkPasswordBreach}
                            disabled={loadingPass}
                            className="glass-card neon-border"
                            style={{ padding: '0 1rem', background: 'transparent', color: 'var(--accent-primary)' }}
                        >
                            {loadingPass ? '...' : <Search size={18} />}
                        </button>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.8rem' }} className="mono">
                        [METHOD: K-ANONYMITY // SHA-1 PREFIX ONLY]
                    </p>

                    <div style={{ marginTop: '1.5rem', minHeight: '100px' }}>
                        <AnimatePresence mode="wait">
                            {passResult && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    {passResult.pwned ? (
                                        <div style={{ padding: '1rem', background: 'rgba(255, 49, 49, 0.1)', border: '1px solid var(--accent-alert)', borderRadius: '6px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-alert)' }}>
                                                <ShieldAlert size={16} />
                                                <span className="mono">PASSWORD_LEAKED</span>
                                            </div>
                                            <p style={{ fontSize: '0.8rem' }}>This pattern has appeared in <span className="neon-text">{passResult.count}</span> public databases.</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}>
                                            <CheckCircle size={16} />
                                            <span className="mono">SECRET_IS_UNDETECTED</span>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {(emailResult?.pwned || passResult?.pwned) && <ActionRequired />}

            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <Info size={16} className="neon-text" />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }} className="mono">
                    VULNERABILITY_INDEX: Checks against billions of leaked credentials. Never reuse secrets.
                </p>
            </div>
        </motion.div>
    );
};

export default DataLeakShield;
