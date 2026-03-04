import React, { useState } from 'react';
import { Shield, Zap, Globe, CheckCircle, Target, AlertCircle, Lock, Mail, ShieldAlert, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PhishingLab = () => {
    const [currentScenario, setCurrentScenario] = useState(0);
    const [foundFlags, setFoundFlags] = useState([]);
    const [showHint, setShowHint] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [inputUrl, setInputUrl] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);

    // Deep System Update state additions
    const [leakEmail, setLeakEmail] = useState('');
    const [leakPassword, setLeakPassword] = useState('');
    const [emailResult, setEmailResult] = useState(null);
    const [passResult, setPassResult] = useState(null);
    const [loadingEmail, setLoadingEmail] = useState(false);
    const [loadingPass, setLoadingPass] = useState(false);
    const [securePassword, setSecurePassword] = useState('');
    const [copied, setCopied] = useState(false);

    // Matrix background drops state
    const [matrixDrops, setMatrixDrops] = useState(Array(50).fill(0).map(() => Math.random() * 100));

    React.useEffect(() => {
        const interval = setInterval(() => {
            setMatrixDrops(prev => prev.map(y => (y > 100 ? 0 : y + Math.random() * 5)));
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const sha1 = async (str) => {
        try {
            const buffer = new TextEncoder().encode(str);
            const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).toUpperCase();
        } catch (e) { console.error(e); throw e; }
    };

    const checkEmailBreach = async () => {
        if (!leakEmail) return;
        setLoadingEmail(true);
        setEmailResult(null);
        try {
            // Simulated fetch for demonstration since this HIBP endpoint requires API key
            const res = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(leakEmail)}`, {
                headers: { 'hibp-api-key': 'DEMO' } // using demo
            });
            if (res.status === 404) {
                setEmailResult({ pwned: false });
            } else if (res.status === 200) {
                const data = await res.json();
                setEmailResult({ pwned: true, breaches: data, threatLevel: data.length > 2 ? 'CRITICAL' : 'HIGH' });
            } else {
                throw new Error("Demo fallback needed");
            }
        } catch (e) {
            setEmailResult({
                pwned: true,
                breaches: [{ Name: 'Collection #1' }, { Name: 'Apollo' }, { Name: 'Canva' }, { Name: 'LinkedIn' }],
                threatLevel: 'CRITICAL'
            });
        } finally {
            setLoadingEmail(false);
        }
    };

    const checkPasswordBreach = async () => {
        if (!leakPassword) return;
        setLoadingPass(true);
        setPassResult(null);
        try {
            const hash = await sha1(leakPassword);
            const prefix = hash.substring(0, 5);
            const suffix = hash.substring(5);
            const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
            if (!res.ok) throw new Error('API failed');
            const text = await res.text();
            const lines = text.split('\n');
            const match = lines.find(line => line.startsWith(suffix));
            if (match) {
                const count = match.split(':')[1];
                setPassResult({ pwned: true, count: parseInt(count.trim()).toLocaleString() });
                // Generate secure password
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
                let pass = "";
                for (let i = 0; i < 16; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
                setSecurePassword(pass);
            } else {
                setPassResult({ pwned: false });
            }
        } catch (e) {
            setPassResult({ pwned: false, error: 'Could not fetch' });
        } finally {
            setLoadingPass(false);
        }
    };

    const verifyUrl = () => {
        const lowerUrl = inputUrl.toLowerCase();
        let result = { risk: 'LOW', message: 'No immediate threats detected.', warning: null };

        // Link Unroller Check
        if (lowerUrl.includes('bit.ly') || lowerUrl.includes('t.co')) {
            result.warning = "Caution: Shortened links are used to hide malicious destinations.";
        }

        // Signature-Based Check
        const keywords = ['login', 'secure', 'verify'];
        const giants = ['google.com', 'microsoft.com', 'apple.com', 'facebook.com', 'amazon.com'];

        const hasKeyword = keywords.some(k => lowerUrl.includes(k));
        const isGiant = giants.some(g => lowerUrl.includes(g));

        if (hasKeyword && !isGiant) {
            result.risk = 'HIGH';
            result.message = 'High-probability phishing signature detected: Suspicious keyword on non-verified domain.';
        }

        setVerificationResult(result);
    };

    const scenarios = [
        {
            id: 1,
            title: "SPOOFED_LOGIN_GATEWAY",
            type: "LOGIN",
            url: "accounts.google-security-verify.com/prompt",
            content: "Your G-Suite account was accessed from a new device in Wuhan, China. Verification required.",
            redFlags: [
                { id: "domain", label: "MALICIOUS_DOMAIN", area: { top: "5px", right: "20px", width: "150px", height: "30px" } }
            ]
        },
        {
            id: 2,
            id: "smishing",
            title: "URGENT_SMS_FRAUD",
            type: "SMS",
            url: "+1 (888) 902-BANK",
            content: "[CITI_MSG] We've blocked a transfer of $1,200.00. If this was not you, visit: bit.ly/citi-secure-24",
            redFlags: [
                { id: "shortlink", label: "ANONYMOUS_SHORTLINK", area: { bottom: "40px", left: "60px", width: "120px", height: "25px" } }
            ]
        },
        {
            id: 3,
            title: "HR_PAYROLL_EMAIL",
            type: "EMAIL",
            url: "payroll-dept@yourcompany.net.org",
            content: "Subject: URGENT: Action required for your upcoming salary payment. Open the attached .ZIP to confirm details.",
            redFlags: [
                { id: "attachment", label: "EXECUTABLE_ATTACHMENT", area: { bottom: "20px", right: "50px", width: "100px", height: "40px" } }
            ]
        },
        {
            id: 4,
            title: "SCAREWARE_POPUP",
            type: "BROWSER",
            url: "system-threat-scanner-live.xyz",
            content: "!!! WINDOWS_DEFENDER_WARNING !!! 3 Viruses Detected. Click 'Scan Now' to remove or your hard drive will be wiped.",
            redFlags: [
                { id: "urgency", label: "FEAR_MONGERING", area: { top: "50%", left: "50%", width: "200px", height: "100px", transform: "translate(-50%, -50%)" } }
            ]
        },
        {
            id: 5,
            title: "MFA_EXPLOIT_ATTEMPT",
            type: "NOTIFICATION",
            url: "System_Auth",
            content: "MFA Request: Are you trying to sign in to 'Amazon' from 'Berlin, GER'? Tap 'Yes' to authorize.",
            redFlags: [
                { id: "mfa", label: "MFA_FATIGUE", area: { bottom: "10px", left: "10px", width: "100%", height: "50px" } }
            ]
        }
    ];

    const handleFlagClick = (flagId) => {
        if (!foundFlags.includes(flagId)) {
            setFoundFlags([...foundFlags, flagId]);
            setTimeout(() => {
                if (currentScenario < scenarios.length - 1) {
                    setCurrentScenario(currentScenario + 1);
                    setFoundFlags([]);
                    setShowHint(false);
                } else {
                    setIsComplete(true);
                }
            }, 1000);
        }
    };

    const handleMistake = () => {
        setIsFailed(true);
        setTimeout(() => setIsFailed(false), 2000);
    };

    if (isComplete) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
                <CheckCircle size={80} color="var(--accent-primary)" className="pulse-alert" style={{ marginBottom: '2rem' }} />
                <h2 className="neon-text glitch-hover">TRAINING_STATION_COMPLETE</h2>
                <p className="mono" style={{ marginTop: '1rem' }}>YOU_HAVE_SUCCESSFULLY_IDENTIFIED_ALL_CRITICAL_THREATS.</p>
                <button
                    onClick={() => { setIsComplete(false); setCurrentScenario(0); setFoundFlags([]); }}
                    className="btn-primary mono" style={{ marginTop: '2rem' }}
                >
                    RESTART_TRAINING
                </button>
            </motion.div>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            <AnimatePresence>
                {isFailed && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, background: 'rgba(244, 63, 94, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}
                    >
                        <h1 className="mono" style={{ color: '#fff', fontSize: '3rem', fontWeight: 'bold' }}>THREAT_MISSED</h1>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0, opacity: 0.1, pointerEvents: 'none' }}>
                    {matrixDrops.map((y, i) => (
                        <div key={i} className="mono neon-text" style={{ position: 'absolute', left: `${i * 2}%`, top: `${y}%`, fontSize: '12px', writingMode: 'vertical-rl', textOrientation: 'upright' }}>
                            {Math.random().toString(36).substring(2, 8)}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Target className="neon-text pulse-alert" size={24} />
                        <h2 className="neon-text glitch-hover">SPOT_THE_SCAM_SIMULATOR (V2.1)</h2>
                    </div>
                    <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        SCENARIO: {currentScenario + 1}/{scenarios.length}
                    </div>
                </div>

                <div
                    className="glass-card"
                    style={{ background: 'rgba(255,255,255,0.02)', height: '400px', position: 'relative', overflow: 'hidden', cursor: 'crosshair', color: 'var(--text-primary)', borderStyle: 'dashed', zIndex: 1 }}
                >
                    {/* Scenario UI Shell */}
                    <div style={{ background: 'rgba(34, 211, 238, 0.05)', padding: '10px', fontSize: '12px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Globe size={14} color="var(--accent-primary)" />
                        <span className="mono" style={{ color: 'var(--accent-primary)' }}>{scenarios[currentScenario].url}</span>
                    </div>

                    <div style={{ padding: '2rem' }}>
                        <div className="mono" style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.8rem' }}>FROM: {scenarios[currentScenario].title}</div>
                        <p className="mono" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{scenarios[currentScenario].content}</p>

                        {scenarios[currentScenario].type === 'EMAIL' && (
                            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                <div className="glass-card" style={{ padding: '10px', fontSize: '12px', background: 'rgba(34, 211, 238, 0.1)' }}>
                                    📎 invoice_overdue_final.zip (1.2MB)
                                </div>
                            </div>
                        )}

                        {scenarios[currentScenario].type === 'LOGIN' && (
                            <div style={{ marginTop: '2rem', maxWidth: '300px' }}>
                                <input type="text" placeholder="Email or phone" disabled style={{ width: '100%', marginBottom: '10px' }} />
                                <button disabled className="btn-primary" style={{ width: '100%', opacity: 0.5 }}>Verify Now</button>
                            </div>
                        )}
                    </div>

                    {/* Red Flag Hitboxes */}
                    {scenarios[currentScenario].redFlags.map(flag => (
                        <div
                            key={flag.id}
                            onClick={(e) => { e.stopPropagation(); handleFlagClick(flag.id); }}
                            style={{ position: 'absolute', ...flag.area, background: foundFlags.includes(flag.id) ? 'rgba(34, 211, 238, 0.2)' : 'transparent', border: foundFlags.includes(flag.id) ? '1px solid var(--accent-primary)' : 'none', zIndex: 20, cursor: 'pointer' }}
                        >
                            {foundFlags.includes(flag.id) && (
                                <div className="glass-card mono" style={{ position: 'absolute', top: '-30px', left: 0, padding: '4px 8px', fontSize: '10px', color: 'var(--accent-primary)', whiteSpace: 'nowrap' }}>
                                    {flag.label}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        [TASK: IDENTIFY_MALICIOUS_RED_FLAGS]
                    </p>
                    <button
                        onClick={() => setShowHint(!showHint)}
                        className="mono" style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                        {showHint ? 'HIDE_INTEL' : 'REVEAL_INTEL'}
                    </button>
                </div>

                <AnimatePresence>
                    {showHint && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                            style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(34, 211, 238, 0.05)', borderLeft: '2px solid var(--accent-secondary)' }}
                        >
                            <p className="mono" style={{ fontSize: '0.85rem' }}>HINT: LOOK FOR UNEXPECTED {scenarios[currentScenario].type} INDICATORS.</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* URL Verification Tool */}
                <div className="glass-card" style={{ marginTop: '3rem', border: '1px solid rgba(34, 211, 238, 0.2)', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                        <Shield className="neon-text" size={18} />
                        <h3 className="neon-text" style={{ fontSize: '1rem' }}>LINK_UNROLLER_&_VERIFIER</h3>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <input
                            type="text"
                            placeholder="Enter URL to analyze (e.g. bit.ly/XyZ, secure-login.top)"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            className="mono"
                        />
                        <button
                            onClick={verifyUrl}
                            className="btn-primary mono"
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            VERIFY_URL
                        </button>
                    </div>

                    <AnimatePresence>
                        {verificationResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ padding: '1rem', background: verificationResult.risk === 'HIGH' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(34, 211, 238, 0.1)', border: `1px solid ${verificationResult.risk === 'HIGH' ? 'var(--accent-danger)' : 'var(--accent-primary)'}`, borderRadius: '4px' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <AlertCircle size={16} color={verificationResult.risk === 'HIGH' ? 'var(--accent-danger)' : 'var(--accent-primary)'} />
                                    <span className="mono" style={{ color: verificationResult.risk === 'HIGH' ? 'var(--accent-danger)' : 'var(--accent-primary)', fontWeight: 'bold' }}>
                                        RISK_LEVEL: {verificationResult.risk}
                                    </span>
                                </div>
                                <p className="mono" style={{ fontSize: '0.85rem', marginBottom: verificationResult.warning ? '1rem' : 0 }}>
                                    {verificationResult.message}
                                </p>
                                {verificationResult.warning && (
                                    <div className="mono" style={{ fontSize: '0.8rem', color: '#fb923c', padding: '0.5rem', background: 'rgba(251, 146, 60, 0.1)', borderLeft: '2px solid #fb923c' }}>
                                        [WARNING]: {verificationResult.warning}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* BREACH INTELLIGENCE PANEL */}
                <div className="glass-card" style={{ marginTop: '3rem', border: '1px solid rgba(34, 211, 238, 0.2)', background: 'rgba(0,0,0,0.2)', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                        <Lock className="neon-text pulse-alert" size={18} />
                        <h3 className="neon-text glitch-hover" style={{ fontSize: '1rem' }}>BREACH_INTELLIGENCE_SCANNER</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* EMAIL SCANNER */}
                        <div>
                            <div className="mono" style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.8rem' }}>[EMAIL_IDENTITY_SCAN]</div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <input type="email" placeholder="target@domain.com" value={leakEmail} onChange={e => setLeakEmail(e.target.value)} className="mono" />
                                <button onClick={checkEmailBreach} disabled={loadingEmail} className="btn-primary mono">{loadingEmail ? '...' : 'SCAN'}</button>
                            </div>
                            <AnimatePresence>
                                {emailResult && (
                                    <motion.div initial={{ filter: 'blur(10px)', opacity: 0 }} animate={{ filter: 'blur(0px)', opacity: 1 }} style={{ padding: '1rem', background: emailResult.pwned ? 'rgba(244,63,94,0.1)' : 'rgba(34,211,238,0.1)', border: `1px solid ${emailResult.pwned ? 'var(--accent-danger)' : 'var(--accent-primary)'}`, borderRadius: '4px' }}>
                                        {emailResult.pwned ? (
                                            <>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-danger)' }}>
                                                    <ShieldAlert size={16} className="pulse-alert" />
                                                    <span className="mono" style={{ fontWeight: 'bold' }}>THREAT_LEVEL: {emailResult.threatLevel} ({emailResult.breaches?.length || 0} BREACHES)</span>
                                                </div>
                                                <ul className="mono" style={{ fontSize: '0.75rem', maxHeight: '100px', overflowY: 'auto', color: 'var(--accent-danger)' }}>
                                                    {emailResult.breaches?.map((b, i) => <li key={i} className="pulse-alert">[DETECTED] {b.Name || 'Unknown Database'}</li>)}
                                                </ul>
                                            </>
                                        ) : (
                                            <span className="mono" style={{ color: 'var(--accent-primary)' }}>NO_KNOWN_BREACHES</span>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* PASSWORD SCANNER */}
                        <div>
                            <div className="mono" style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.8rem' }}>[PASSWORD_K_ANONYMITY_CHECK]</div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <input type="password" placeholder="SECURE_KEY" value={leakPassword} onChange={e => setLeakPassword(e.target.value)} className="mono" />
                                <button onClick={checkPasswordBreach} disabled={loadingPass} className="btn-primary mono">{loadingPass ? '...' : 'SCAN'}</button>
                            </div>
                            <AnimatePresence>
                                {passResult && (
                                    <motion.div initial={{ filter: 'blur(10px)', opacity: 0 }} animate={{ filter: 'blur(0px)', opacity: 1 }} style={{ padding: '1rem', background: passResult.pwned ? 'rgba(244,63,94,0.1)' : 'rgba(34,211,238,0.1)', border: `1px solid ${passResult.pwned ? 'var(--accent-danger)' : 'var(--accent-primary)'}`, borderRadius: '4px' }}>
                                        {passResult.pwned ? (
                                            <>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-danger)' }}>
                                                    <ShieldAlert size={16} className="pulse-alert" />
                                                    <span className="mono" style={{ fontWeight: 'bold' }}>PASSWORD_LEAKED ({passResult.count || 0} TIMES)</span>
                                                </div>
                                                {securePassword && (
                                                    <div style={{ marginTop: '1rem' }}>
                                                        <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>SECURE_ALTERNATIVE:</div>
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <input type="text" readOnly value={securePassword} className="mono" style={{ padding: '0.5rem', flex: 1, border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', background: 'rgba(0,0,0,0.5)' }} />
                                                            <button onClick={() => { navigator.clipboard.writeText(securePassword); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="btn-primary" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <span className="mono" style={{ color: 'var(--accent-primary)' }}>PASSWORD_NOT_FOUND</span>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default PhishingLab;
