import { useState } from 'react'

const CONTENT = {
  hi: {
    title: 'नमस्ते, रमेश जी 🙏',
    subtitle: 'आज क्या सेवा चाहिए?',
    stats: [
      { label: 'सक्रिय आवेदन', value: '2', sub: 'चल रहे हैं' },
      { label: 'स्वीकृत सेवाएं', value: '4', sub: 'अब तक' },
      { label: 'दस्तावेज', value: '3', sub: 'अपलोड' },
      { label: 'दिन बाकी', value: '12', sub: 'राशन कार्ड' },
    ],
    servicesTitle: 'सरकारी सेवाएं',
    seeAll: 'सभी देखें',
    voiceTitle: 'बोलकर पूछें — कोई भी सवाल',
    voiceSub: 'माइक दबाएं और हिंदी या मराठी में बोलें',
    voicePlaceholder: 'आपका सवाल यहाँ दिखेगा...',
    appsTitle: 'मेरे आवेदन',
  },
  mr: {
    title: 'नमस्कार, रमेश 🙏',
    subtitle: 'आज कोणती सेवा हवी आहे?',
    stats: [
      { label: 'सक्रिय अर्ज', value: '2', sub: 'सुरू आहेत' },
      { label: 'मंजूर सेवा', value: '4', sub: 'आतापर्यंत' },
      { label: 'कागदपत्रे', value: '3', sub: 'अपलोड' },
      { label: 'दिवस बाकी', value: '12', sub: 'रेशनकार्ड' },
    ],
    servicesTitle: 'सरकारी सेवा',
    seeAll: 'सर्व पहा',
    voiceTitle: 'बोलून विचारा — कोणताही प्रश्न',
    voiceSub: 'मायक्रोफोन दाबा आणि मराठीत बोला',
    voicePlaceholder: 'तुमचा प्रश्न येथे दिसेल...',
    appsTitle: 'माझे अर्ज',
  },
  en: {
    title: 'Hello, Ramesh 🙏',
    subtitle: 'What service do you need today?',
    stats: [
      { label: 'Active applications', value: '2', sub: 'in progress' },
      { label: 'Approved services', value: '4', sub: 'total' },
      { label: 'Documents', value: '3', sub: 'uploaded' },
      { label: 'Days remaining', value: '12', sub: 'ration card' },
    ],
    servicesTitle: 'Government services',
    seeAll: 'See all',
    voiceTitle: 'Voice help — ask anything',
    voiceSub: 'Press the mic and speak in your language',
    voicePlaceholder: 'Your question will appear here...',
    appsTitle: 'My applications',
  },
}

const SERVICES = [
  { id: 'ration',   name: { hi: 'राशन कार्ड', mr: 'रेशनकार्ड',    en: 'Ration card' },    icon: '📄', bg: '#E6F5ED', count: { hi: '4 चरण', mr: '4 पायऱ्या', en: '4 steps' } },
  { id: 'aadhar',  name: { hi: 'आधार अपडेट', mr: 'आधार अपडेट',   en: 'Aadhar update' }, icon: '🪪', bg: '#E8F4FD', count: { hi: '3 चरण', mr: '3 पायऱ्या', en: '3 steps' } },
  { id: 'pension', name: { hi: 'पेंशन योजना', mr: 'पेन्शन योजना', en: 'Pension scheme' }, icon: '👴', bg: '#FFF3CD', count: { hi: '5 चरण', mr: '5 पायऱ्या', en: '5 steps' } },
  { id: 'awas',    name: { hi: 'PM आवास',    mr: 'PM आवास',       en: 'PM Awas Yojana' }, icon: '🏠', bg: '#EEEDFE', count: { hi: '6 चरण', mr: '6 पायऱ्या', en: '6 steps' } },
  { id: 'caste',   name: { hi: 'जाति प्रमाण', mr: 'जातीचा दाखला', en: 'Caste certificate' }, icon: '📜', bg: '#FFF0EA', count: { hi: '3 चरण', mr: '3 पायऱ्या', en: '3 steps' } },
  { id: 'scholarship', name: { hi: 'छात्रवृत्ति', mr: 'शिष्यवृत्ती', en: 'Scholarship' }, icon: '🎓', bg: '#E6F5ED', count: { hi: '4 चरण', mr: '4 पायऱ्या', en: '4 steps' } },
]

const APPS = [
  { name: { hi: 'राशन कार्ड', mr: 'रेशनकार्ड', en: 'Ration Card' }, id: 'APP-2024-001', date: '15 Jan', status: 'processing', step: '2/4' },
  { name: { hi: 'PM आवास योजना', mr: 'PM आवास योजना', en: 'PM Awas Yojana' }, id: 'APP-2024-002', date: '8 Jan', status: 'pending', step: '1/6' },
]

export default function Dashboard({ setPage, lang }) {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const c = CONTENT[lang]

  const toggleVoice = () => {
    setListening(v => !v)
    if (!listening) {
      const phrases = {
        hi: 'राशन कार्ड के लिए क्या करना होगा?',
        mr: 'रेशनकार्डसाठी काय करावे लागेल?',
        en: 'What documents do I need for a ration card?',
      }
      setTimeout(() => { setTranscript(phrases[lang]); setListening(false) }, 2000)
    }
  }

  const statusLabel = { processing: { hi: 'प्रक्रिया में', mr: 'प्रक्रियेत', en: 'Processing' }, pending: { hi: 'लंबित', mr: 'प्रलंबित', en: 'Pending' }, approved: { hi: 'स्वीकृत', mr: 'मंजूर', en: 'Approved' } }

  return (
    <div className="page-section">
      <div className="page-header">
        <h1 className="page-title">{c.title}</h1>
        <p className="page-subtitle">{c.subtitle}</p>
        
      </div>

      <div className="stats-row">
        {c.stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="voice-panel">
        <button className={`voice-btn${listening ? ' listening' : ''}`} onClick={toggleVoice}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="8" y="2" width="6" height="11" rx="3" fill="white"/>
            <path d="M4 11a7 7 0 0014 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M11 18v3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <div>
          <div className="voice-label">{c.voiceTitle}</div>
          <div className="voice-sublabel">{c.voiceSub}</div>
        </div>
        <div className="voice-transcript">
          {transcript || c.voicePlaceholder}
        </div>
      </div>

      <div style={{marginBottom:28}}>
        <div className="section-title">
          {c.servicesTitle}
          <button className="btn btn-ghost" onClick={() => setPage('services')}>{c.seeAll} →</button>
        </div>
        <div className="services-grid">
          {SERVICES.map(s => (
            <div className="service-card" key={s.id} onClick={() => setPage('services')}>
              <div className="service-icon-wrap" style={{background: s.bg}}>
                <span style={{fontSize:22}}>{s.icon}</span>
              </div>
              <div className="service-name">{s.name[lang]}</div>
              <div className="service-count">{s.count[lang]}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="section-title">{c.appsTitle}</div>
        <div className="applications-table">
          <div className="table-header">
            <span>Service</span><span>ID</span><span>Date</span><span>Status</span><span>Step</span>
          </div>
          {APPS.map((a, i) => (
            <div className="table-row" key={i}>
              <div><div className="app-name">{a.name[lang]}</div><div className="app-id">{a.id}</div></div>
              <div style={{fontSize:12,color:'var(--ink-mid)'}}>{a.id}</div>
              <div style={{fontSize:12,color:'var(--ink-light)'}}>{a.date}</div>
              <div>
                <span className={`status-badge ${a.status}`}>
                  <span className="status-dot"/>
                  {statusLabel[a.status][lang]}
                </span>
              </div>
              <div style={{fontSize:12,fontWeight:500}}>{a.step}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}