import React, { useState } from 'react';
import { CheckSquare, Square, Info, AlertTriangle, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';

const SecurityChecklist = () => {
    const [items, setItems] = useState([
        { id: 1, title: 'Change Default Admin Credentials', description: 'Ensure the router login is not "admin/admin" or similar defaults.', completed: false, severity: 'CRITICAL' },
        { id: 2, title: 'Disable WPS (Wi-Fi Protected Setup)', description: 'WPS is vulnerable to brute-force attacks. Disable it in router settings.', completed: false, severity: 'HIGH' },
        { id: 3, title: 'Enable WPA3/WPA2-AES Encryption', description: 'Use the strongest available encryption standard.', completed: false, severity: 'HIGH' },
        { id: 4, title: 'Update Router Firmware', description: 'Check for latest security patches from the manufacturer.', completed: false, severity: 'MEDIUM' },
        { id: 5, title: 'Disable UPnP (Universal Plug and Play)', description: 'UPnP can allow malware to open ports automatically.', completed: false, severity: 'MEDIUM' },
        { id: 6, title: 'Change Default SSID', description: 'Don\'t use names that reveal the router model or your identity.', completed: false, severity: 'LOW' },
    ]);

    const toggleItem = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    const completedCount = items.filter(i => i.completed).length;
    const progress = (completedCount / items.length) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <ListChecks className="neon-text pulse-alert" size={24} />
                <h2 className="neon-text glitch-hover">ROUTER_SECURITY_CHECKLIST</h2>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }} className="mono">
                    <span style={{ color: 'var(--text-secondary)' }}>SHIELD_INTEGRITY:</span>
                    <span className="neon-text">{Math.round(progress)}%</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        style={{ height: '100%', background: 'var(--accent-primary)', boxShadow: '0 0 8px rgba(57, 255, 20, 0.5)' }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {items.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ x: 5 }}
                        onClick={() => toggleItem(item.id)}
                        className={`glass-card ${item.completed ? 'neon-border' : ''}`}
                        style={{
                            padding: '1rem',
                            cursor: 'pointer',
                            background: item.completed ? 'rgba(57, 255, 20, 0.03)' : 'var(--panel-bg)',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'flex-start'
                        }}
                    >
                        <div style={{ marginTop: '0.2rem' }}>
                            {item.completed ?
                                <CheckSquare size={20} className="neon-text" /> :
                                <Square size={20} style={{ color: 'var(--text-secondary)' }} />
                            }
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                                <h4 style={{ color: item.completed ? 'var(--accent-primary)' : 'var(--text-primary)', fontSize: '1rem' }}>
                                    {item.title}
                                </h4>
                                <span className="mono" style={{
                                    fontSize: '0.7rem',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    background: item.severity === 'CRITICAL' ? 'rgba(255,49,49,0.2)' : 'rgba(255,255,255,0.05)',
                                    color: item.severity === 'CRITICAL' ? 'var(--accent-alert)' : 'var(--text-secondary)',
                                    border: `1px solid ${item.severity === 'CRITICAL' ? 'var(--accent-alert)' : 'var(--glass-border)'}`
                                }}>
                                    {item.severity}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0, 243, 255, 0.05)', border: '1px solid rgba(0, 243, 255, 0.2)', borderRadius: '8px', display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <AlertTriangle size={20} style={{ color: 'var(--accent-secondary)' }} />
                <p style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)' }} className="mono">
                    SECURE_MODE: Ensure all CRITICAL items are addressed for basic network safety.
                </p>
            </div>
        </motion.div>
    );
};

export default SecurityChecklist;
