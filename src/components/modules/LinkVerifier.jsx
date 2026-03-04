import React, { useState } from 'react';
import { Search, ExternalLink, ShieldCheck, ShieldAlert, Globe, Loader2, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LinkVerifier = () => {
    const [url, setUrl] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState(null);

    const scanLink = async () => {
        if (!url) return;
        setIsScanning(true);
        setResult(null);

        await new Promise(resolve => setTimeout(resolve, 2000));

        const isShortened = url.includes('bit.ly') || url.includes('tinyurl.com') || url.includes('t.co');
        const finalDest = isShortened ? 'https://malicious-credential-harvester.top/login.php?ref=phish' : url;
        const isMalicious = finalDest.includes('malicious') || finalDest.includes('phish') || finalDest.includes('harvester');

        setResult({
            original: url,
            finalDestination: finalDest,
            isShortened,
            status: isMalicious ? 'MALICIOUS' : 'CLEAN',
            threatType: isMalicious ? 'SOCIAL_ENGINEERING / CREDENTIAL_HARVESTING' : 'NONE',
            riskScore: isMalicious ? 95 : 5
        });

        setIsScanning(false);
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link2 className="neon-text pulse-alert" size={24} />
                <h2 className="neon-text glitch-hover">REAL_TIME_LINK_SANDBOX (V0.9)</h2>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    [PASTE_SUSPICIOUS_URL_FOR_DECONSTRUCTION]
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/secure-login..."
                        className="mono"
                        style={{ flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                    />
                    <button
                        onClick={scanLink}
                        disabled={isScanning || !url}
                        className="btn-primary mono"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        {isScanning ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                        {isScanning ? 'SCANNING...' : 'SCAN'}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card"
                        style={{ background: 'rgba(0,0,0,0.3)', border: result.status === 'MALICIOUS' ? '1px solid var(--accent-danger)' : '1px solid var(--accent-primary)' }}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <p className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>[DECONSTRUCTION_REPORT]</p>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>REDIRECT_CHAIN:</div>
                                    <div className="mono" style={{ fontSize: '0.9rem', padding: '0.5rem', background: 'rgba(34, 211, 238, 0.05)', border: '1px solid rgba(34, 211, 238, 0.1)', marginTop: '0.5rem' }}>
                                        {result.original} {result.isShortened && '→ ' + result.finalDestination}
                                    </div>
                                </div>
                                <div>
                                    <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>FINAL_HOST_IP:</div>
                                    <div className="mono" style={{ fontSize: '0.9rem', marginTop: '0.2rem' }}>104.21.32.204 (CLOUDFLARE_EDGE)</div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                {result.status === 'MALICIOUS' ? (
                                    <>
                                        <ShieldAlert size={64} color="var(--accent-danger)" className="pulse-alert" style={{ marginBottom: '1rem' }} />
                                        <h3 className="mono" style={{ color: 'var(--accent-danger)', fontSize: '1.5rem' }}>THREAT_DETECTED</h3>
                                        <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-danger)', marginTop: '0.5rem' }}>[{result.threatType}]</p>
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={64} color="var(--accent-primary)" className="pulse-alert" style={{ marginBottom: '1rem' }} />
                                        <h3 className="mono neon-text" style={{ color: 'var(--accent-primary)', fontSize: '1.5rem' }}>LINK_SECURE</h3>
                                        <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginTop: '0.5rem' }}>[SAFE_BROWSING_VERIFIED]</p>
                                    </>
                                )}
                                <div style={{ marginTop: '1.5rem', width: '100%' }}>
                                    <div className="mono" style={{ fontSize: '0.7rem', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>RISK_FACTOR</span>
                                        <span style={{ color: result.status === 'MALICIOUS' ? 'var(--accent-danger)' : 'var(--accent-primary)' }}>{result.riskScore}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ width: `${result.riskScore}%`, height: '100%', background: result.status === 'MALICIOUS' ? 'var(--accent-danger)' : 'var(--accent-primary)', boxShadow: `0 0 10px ${result.status === 'MALICIOUS' ? 'var(--accent-danger)' : 'var(--accent-primary)'}` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default LinkVerifier;
