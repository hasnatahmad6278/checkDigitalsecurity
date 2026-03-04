import React, { useState } from 'react'
import { ShieldAlert, Zap, Search, AlertCircle, Activity, Shield as ShieldIcon } from 'lucide-react'
import PasswordAuditor from './components/modules/PasswordAuditor'
import FingerprintAudit from './components/modules/FingerprintAudit'
import PhishingLab from './components/modules/PhishingLab'
import LinkVerifier from './components/modules/LinkVerifier'
import SocialBot from './components/modules/SocialBot'
import { motion, AnimatePresence } from 'framer-motion'
import ErrorBoundary from './components/ErrorBoundary'
import { Analytics } from '@vercel/analytics/react'

function App() {
  const [activeTab, setActiveTab] = useState('password')

  const tabs = [
    { id: 'password', label: 'ROUTER_STRESS', icon: <Zap size={18} /> },
    { id: 'link-verifier', label: 'LINK_SANDBOX', icon: <ShieldIcon size={18} /> },
    { id: 'fingerprint', label: 'PRIVACY_AUDIT', icon: <Search size={18} /> },
    { id: 'phishing', label: 'PHISH_LAB', icon: <AlertCircle size={18} /> },
    { id: 'social-bot', label: 'SOCIAL_BOT', icon: <Activity size={18} /> },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <div className="container">
      <div className="cyber-bg"></div>
      <div className="scanlines"></div>
      <div className="crt-overlay"></div>

      <header className="terminal-header glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ShieldAlert className="neon-text pulse-alert" size={32} />
          <div>
            <h1 className="neon-text glitch-hover" style={{ fontSize: '1.5rem' }}>ZERO_TRUST_DASHBOARD_V2.0</h1>
            <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              <span className="status-indicator"></span> SYSTEM_STATUS: OPERATIONAL // ENCRYPTION: AES_256
            </div>
          </div>
        </div>
        <div className="mono" style={{ fontSize: '0.8rem', textAlign: 'right' }}>
          <div>[LOCAL_TIME: {new Date().toLocaleTimeString()}]</div>
          <div style={{ color: 'var(--accent-primary)' }}>ACCESS_LEVEL: ADMINISTRATOR</div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        <motion.nav
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <p className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>[MODULE_SELECT]</p>
          {tabs.map(tab => (
            <motion.button
              variants={itemVariants}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`glass-card mono ${activeTab === tab.id ? 'neon-border' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                textAlign: 'left',
                fontSize: '0.85rem',
                background: activeTab === tab.id ? 'rgba(34, 211, 238, 0.1)' : 'rgba(15, 23, 42, 0.3)',
                color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </motion.button>
          ))}

          <motion.div variants={itemVariants} style={{ marginTop: 'auto', padding: '1rem' }} className="glass-card">
            <div className="mono" style={{ fontSize: '0.65rem' }}>
              <p style={{ color: 'var(--accent-primary)', marginBottom: '4px' }}>LOG_BUFFER:</p>
              <p style={{ color: 'var(--text-secondary)' }}>{">>"} Pinging secure_gateway...</p>
              <p style={{ color: 'var(--text-secondary)' }}>{">>>"} Auth_token: verified</p>
              <p style={{ color: 'var(--accent-danger)' }}>{">>>"} Warning: 12 failed login attempts detected</p>
            </div>
          </motion.div>
        </motion.nav>

        <main>
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="glitch-hover">
                  {activeTab === 'password' && <PasswordAuditor />}
                  {activeTab === 'link-verifier' && <LinkVerifier />}
                  {activeTab === 'fingerprint' && <FingerprintAudit />}
                  {activeTab === 'phishing' && <PhishingLab />}
                  {activeTab === 'social-bot' && <SocialBot />}
                </div>
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </main>
      </div>

      <footer style={{ marginTop: '4rem', padding: '1rem 0', borderTop: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
        <p className="mono">© 2026 ANTIGRAVITY_SEC_OPS // [NODE: 127.0.0.1] // PROXY: ENABLED</p>
      </footer>
      <Analytics />
    </div>
  )
}

export default App
