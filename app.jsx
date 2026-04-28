import { useState, createContext, useContext } from 'react'
import Dashboard from './pages/Dashboard.jsx'
import ServiceGuide from './pages/ServiceGuide.jsx'
import VoiceAssistant from './pages/VoiceAssistant.jsx'
import Documents from './pages/Documents.jsx'
import Applications from './pages/Applications.jsx'

export const LangContext = createContext('hi')
export const useLang = () => useContext(LangContext)

const STRINGS = {
  hi: {
    brand: 'AccessSeva',
    brandSub: 'सरकारी सेवाएं, आसान भाषा में',
    nav_dashboard: 'डैशबोर्ड',
    nav_services: 'सरकारी सेवाएं',
    nav_applications: 'मेरे आवेदन',
    nav_documents: 'दस्तावेज',
    nav_voice: 'बोलकर पूछें',
    user_location: 'बीड जिला, महाराष्ट्र',
    greeting: 'नमस्ते, रमेश जी',
  },
  mr: {
    brand: 'AccessSeva',
    brandSub: 'सरकारी सेवा, सोप्या भाषेत',
    nav_dashboard: 'डॅशबोर्ड',
    nav_services: 'सरकारी सेवा',
    nav_applications: 'माझे अर्ज',
    nav_documents: 'कागदपत्रे',
    nav_voice: 'बोलून विचारा',
    user_location: 'बीड जिल्हा, महाराष्ट्र',
    greeting: 'नमस्कार, रमेश',
  },
  en: {
    brand: 'AccessSeva',
    brandSub: 'Government services, simplified',
    nav_dashboard: 'Dashboard',
    nav_services: 'Services',
    nav_applications: 'My Applications',
    nav_documents: 'Documents',
    nav_voice: 'Voice Help',
    user_location: 'Beed District, Maharashtra',
    greeting: 'Hello, Ramesh',
  },
}

const PAGES = ['dashboard', 'services', 'applications', 'documents', 'voice']

export default function App() {
  const [lang, setLang] = useState('hi')
  const [page, setPage] = useState('dashboard')
  const t = STRINGS[lang]

  const navItems = [
    { id: 'dashboard', label: t.nav_dashboard, icon: '🏠' },
    { id: 'services',  label: t.nav_services,  icon: '📋' },
    { id: 'applications', label: t.nav_applications, icon: '📂', badge: 2 },
    { id: 'documents', label: t.nav_documents, icon: '🗂️' },
    { id: 'voice',     label: t.nav_voice,     icon: '🎙️' },
  ]

  return (
    <LangContext.Provider value={lang}>
      <div className="app-shell">
        {/* Topbar */}
        <header className="topbar">
          <a className="topbar-brand" href="#" onClick={() => setPage('dashboard')}>
            <div className="brand-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z" fill="white"/>
              </svg>
            </div>
            <div>
              <div className="brand-text">{t.brand}</div>
              <div className="brand-sub">{t.brandSub}</div>
            </div>
          </a>

          <div className="topbar-right">
            <div className="lang-switcher">
              {['hi','mr','en'].map(l => (
                <button key={l} className={`lang-btn${lang === l ? ' active' : ''}`} onClick={() => setLang(l)}>
                  {l === 'hi' ? 'हिंदी' : l === 'mr' ? 'मराठी' : 'Eng'}
                </button>
              ))}
            </div>
            <div className="user-chip">
              <div className="user-avatar">R</div>
              <div>
                <div style={{fontSize:13,fontWeight:500}}>{t.greeting}</div>
                <div style={{fontSize:10,opacity:.65}}>{t.user_location}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <aside className="sidebar">
          <nav>
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-item${page === item.id ? ' active' : ''}`}
                onClick={() => setPage(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="main-content">
          {page === 'dashboard'    && <Dashboard setPage={setPage} lang={lang} />}
          {page === 'services'     && <ServiceGuide lang={lang} />}
          {page === 'applications' && <Applications lang={lang} />}
          {page === 'documents'    && <Documents lang={lang} />}
          {page === 'voice'        && <VoiceAssistant lang={lang} />}
        </main>
      </div>
    </LangContext.Provider>
  )
}