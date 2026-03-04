import React from 'react';
import { Shield, Eye, Lock, Globe, Zap, Cpu, Search, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

const DefenseRules = () => {
    const rules = [
        {
            id: 1,
            title: 'Zero Trust Architecture',
            icon: <Fingerprint size={32} />,
            desc: 'Never trust, always verify. Every device on your network should be authenticated and authorized individually.',
            color: '#39FF14'
        },
        {
            id: 2,
            title: 'Active Monitoring',
            icon: <Eye size={32} />,
            desc: 'Regularly check your router logs for unrecognized devices or unusual traffic patterns.',
            color: '#00F3FF'
        },
        {
            id: 3,
            title: 'Network Segmentation',
            icon: <Cpu size={32} />,
            desc: 'Use a Guest network for IoT devices (smart bulbs, cameras) to isolate them from your primary data.',
            color: '#ADFF2F'
        },
        {
            id: 4,
            title: 'Hardened Access Control',
            icon: <Lock size={32} />,
            desc: 'Limit administrative access to the router to physical (Ethernet) connections only, disabling Wi-Fi admin access.',
            color: '#FFD700'
        },
        {
            id: 5,
            title: 'Encryption Standards',
            icon: <Shield size={32} />,
            desc: 'Always use WPA3 or WPA2-AES. Avoid legacy protocols like WEP or TKIP which are easily cracked.',
            color: '#00FF9C'
        },
        {
            id: 6,
            title: 'Information Obfuscation',
            icon: <Search size={32} />,
            desc: 'Disable SSID broadcasting if possible, or use a non-descriptive name that doesnt identify you.',
            color: '#FF3131'
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Shield className="neon-text pulse-alert" size={24} />
                <h2 className="neon-text glitch-hover">HACKER_DEFENSE_RULES</h2>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem'
                }}
            >
                {rules.map((rule) => (
                    <motion.div
                        key={rule.id}
                        variants={item}
                        whileHover={{ y: -5, borderColor: rule.color, boxShadow: `0 5px 15px ${rule.color}20` }}
                        className="glass-card"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            borderLeft: `3px solid ${rule.color}`,
                            background: 'rgba(255,255,255,0.02)'
                        }}
                    >
                        <div style={{ color: rule.color, marginBottom: '0.5rem' }}>
                            {rule.icon}
                        </div>
                        <h3 className="mono" style={{ fontSize: '1.1rem', color: rule.color }}>
                            {rule.title}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            {rule.desc}
                        </p>
                        <div style={{ marginTop: 'auto', display: 'flex', gap: '4px' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ width: '12px', height: '2px', background: rule.color, opacity: 0.3 }} />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <button className="glass-card neon-border neon-text mono" style={{ padding: '0.8rem 2rem', background: 'transparent' }}>
                    GENERATE_FULL_SECURITY_REPORT.PDF
                </button>
            </div>
        </div>
    );
};

export default DefenseRules;
