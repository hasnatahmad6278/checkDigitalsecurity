import React from 'react';
import { AlertCircle, RefreshCcw, ShieldX } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("DASHBOARD_CRITICAL_EXCEPTION:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="glass-card" style={{
                    border: '1px solid var(--accent-danger)',
                    background: 'rgba(255, 49, 49, 0.05)',
                    padding: '2rem',
                    textAlign: 'center',
                    margin: '1rem'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <ShieldX size={48} color="var(--accent-danger)" />
                        <h2 className="mono" style={{ color: 'var(--accent-danger)' }}>MODULE_CRASH_DETECTED</h2>
                        <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            CRITICAL_ERROR: {this.state.error?.message || "UNKNOWN_EXCEPTION"}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary mono"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'transparent',
                                border: '1px solid var(--accent-danger)',
                                color: 'var(--accent-danger)'
                            }}
                        >
                            <RefreshCcw size={16} />
                            REBOOT_SYSTEM
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
