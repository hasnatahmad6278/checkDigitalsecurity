import React, { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Shield, Search, Globe, AlertTriangle, AlertCircle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FingerprintAudit = () => {
    const [visitorId, setVisitorId] = useState('ANONYMOUS');
    const [ipData, setIpData] = useState(null);
    const [webrtcLeaked, setWebrtcLeaked] = useState(false);
    const [canvasFingerprint, setCanvasFingerprint] = useState('CALCULATING...');
    const [privacyScore, setPrivacyScore] = useState(100);
    const [networkStatus, setNetworkStatus] = useState('CONNECTED');

    useEffect(() => {
        const analyzePrivacy = async () => {
            let score = 100;

            try {
                const fp = await (await FingerprintJS.load()).get();
                setVisitorId(fp.visitorId);
                score -= 20;
            } catch (e) {
                console.error("Fingerprint error", e);
            }

            try {
                const res = await fetch('https://api.ipify.org?format=json');
                if (!res.ok) throw new Error('CORS_OR_THROTTLE');
                const data = await res.json();
                setIpData({ ip: data.ip, connection: { isp: 'DETECTING...' } });
                setNetworkStatus('CONNECTED');
                score -= 30;
            } catch (e) {
                setIpData({
                    ip: window.location.hostname || "127.0.0.1",
                    connection: { isp: "LOCAL_FALLBACK" }
                });
                setNetworkStatus('FALLBACK');
            }

            try {
                const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
                pc.createDataChannel('');
                pc.createOffer().then(offer => pc.setLocalDescription(offer));
                pc.onicecandidate = (ice) => {
                    if (ice && ice.candidate && ice.candidate.candidate.includes('192.168.')) {
                        setWebrtcLeaked(true);
                    }
                };
                setTimeout(() => {
                    if (webrtcLeaked) score -= 25;
                }, 1000);
            } catch (e) { }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = "#069";
            ctx.fillText("ZeroTrust_Shield", 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText("ZeroTrust_Shield", 4, 17);
            const result = canvas.toDataURL();
            setCanvasFingerprint(result.substring(20, 40) + '...');
            score -= 15;

            setPrivacyScore(Math.max(0, score));
        };

        analyzePrivacy();
    }, []);

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Search className="neon-text pulse-alert" size={24} />
                    <h2 className="neon-text glitch-hover">PRIVACY_EXPOSURE_AUDIT (V1.0)</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: networkStatus === 'CONNECTED' ? 'var(--accent-primary)' : '#fb923c', boxShadow: `0 0 8px ${networkStatus === 'CONNECTED' ? 'var(--accent-primary)' : '#fb923c'}` }}></div>
                        <span className="mono" style={{ fontSize: '0.7rem', color: networkStatus === 'CONNECTED' ? 'var(--accent-primary)' : '#fb923c' }}>
                            [NET_STATUS: {networkStatus}]
                        </span>
                    </div>
                    <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>PRIVACY_SCORE</div>
                    <div className="mono" style={{ fontSize: '2rem', color: privacyScore > 70 ? 'var(--accent-primary)' : privacyScore > 30 ? '#fb923c' : 'var(--accent-danger)' }}>
                        {privacyScore}/100
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <section className="glass-card" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)' }}>
                    <div className="mono" style={{ color: 'var(--accent-primary)', marginBottom: '1rem', borderBottom: '1px solid rgba(34, 211, 238, 0.2)', paddingBottom: '0.5rem' }}>[NETWORK_EXPOSURE]</div>
                    <div className="mono" style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <div><span style={{ color: 'var(--text-secondary)' }}>PUBLIC_IP:</span> {ipData?.ip || 'SCANNING...'}</div>
                        <div><span style={{ color: 'var(--text-secondary)' }}>ISP:</span> {ipData?.connection?.isp || ipData?.org || 'DETECTING...'}</div>
                        <div><span style={{ color: 'var(--text-secondary)' }}>WEBRTC_LEAK:</span> <span style={{ color: webrtcLeaked ? 'var(--accent-danger)' : 'var(--accent-primary)' }}>{webrtcLeaked ? 'DETECTED' : 'SECURE'}</span></div>
                    </div>
                </section>

                <section className="glass-card" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)' }}>
                    <div className="mono" style={{ color: 'var(--accent-primary)', marginBottom: '1rem', borderBottom: '1px solid rgba(34, 211, 238, 0.2)', paddingBottom: '0.5rem' }}>[DEVICE_FINGERPRINT]</div>
                    <div className="mono" style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <div><span style={{ color: 'var(--text-secondary)' }}>VISITOR_ID:</span> {visitorId}</div>
                        <div><span style={{ color: 'var(--text-secondary)' }}>CANVAS_ID:</span> {canvasFingerprint}</div>
                        <div style={{ color: 'var(--accent-danger)', fontSize: '0.7rem', marginTop: '0.5rem' }}>*SITES_CAN_USE_THIS_TO_TRACK_YOU_ACROSS_SESSIONS</div>
                    </div>
                </section>
            </div>

            <div className="glass-card" style={{ marginTop: '2rem', background: 'rgba(244, 63, 94, 0.05)', border: '1px solid var(--accent-danger)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                    <AlertTriangle className="pulse-alert" color="var(--accent-danger)" size={18} />
                    <span className="mono" style={{ color: 'var(--accent-danger)', fontWeight: 'bold' }}>EXPOSURE_WARNING</span>
                </div>
                <p className="mono" style={{ fontSize: '0.8rem' }}>
                    YOUR_BROWSER_IS_PROVIDING_ENOUGH_DATA_TO_CREATE_A_UNIQUE_IDENTITY. CONSIDER_USING_A_VPN_OR_PRIVACY_EXTENSIONS.
                </p>
            </div>
        </motion.div>
    );
};

export default FingerprintAudit;
