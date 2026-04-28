import { useState, useRef, useEffect } from 'react'

const PLACEHOLDER = {
  hi: 'माइक दबाएं और हिंदी में बोलें...',
  mr: 'माइक्रोफोन दाबा आणि मराठीत बोला...',
  en: 'Press the mic and speak in English...',
}

const SAMPLE_QA = {
  hi: [
    { q: 'राशन कार्ड के लिए क्या चाहिए?', a: 'राशन कार्ड के लिए ये दस्तावेज चाहिए:\n1. आधार कार्ड (सभी सदस्यों का)\n2. पते का प्रमाण — बिजली बिल या पासबुक\n3. पासपोर्ट साइज फोटो\n4. आय प्रमाण पत्र\n\nआवेदन जमा करने के बाद 30 दिन में कार्ड मिलेगा।' },
    { q: 'पेंशन कैसे मिलेगी?', a: 'वृद्धावस्था पेंशन के लिए:\n1. उम्र 60 साल से अधिक होनी चाहिए\n2. BPL कार्ड धारक होना जरूरी है\n3. ग्राम पंचायत में आवेदन करें\n4. हर महीने ₹600 मिलते हैं' },
    { q: 'आधार कार्ड में पता कैसे बदलें?', a: 'आधार में पता बदलने के लिए:\n1. UIDAI की वेबसाइट या AccessSeva पर जाएं\n2. नया पते का प्रमाण अपलोड करें\n3. OTP से वेरिफाई करें\n4. 90 दिन में अपडेट होगा' },
  ],
  mr: [
    { q: 'रेशनकार्डसाठी काय हवे?', a: 'रेशनकार्डसाठी हे कागदपत्रे हवेत:\n1. आधार कार्ड (सर्व सदस्यांचे)\n2. पत्त्याचा पुरावा — वीज बिल\n3. पासपोर्ट आकाराचा फोटो\n4. उत्पन्नाचा दाखला' },
    { q: 'पेन्शन कशी मिळेल?', a: 'वृद्धापकाळ पेन्शनसाठी:\n1. वय 60 वर्षांपेक्षा जास्त असावे\n2. BPL कार्डधारक असणे आवश्यक\n3. ग्रामपंचायतीत अर्ज करा\n4. दरमहा ₹600 मिळतात' },
  ],
  en: [
    { q: 'What documents for ration card?', a: 'Documents needed for ration card:\n1. Aadhar card (all family members)\n2. Address proof — electricity bill or passbook\n3. Passport size photo\n4. Income certificate\n\nCard will be issued within 30 days of application.' },
    { q: 'How to update Aadhar address?', a: 'To update address in Aadhar:\n1. Go to UIDAI website or AccessSeva\n2. Upload new address proof\n3. Verify with OTP\n4. Update takes 90 days' },
  ],
}

const TITLE = {
  hi: { t: 'बोलकर पूछें', sub: 'कोई भी सरकारी सवाल — हिंदी में', suggested: 'सामान्य सवाल' },
  mr: { t: 'बोलून विचारा', sub: 'कोणताही सरकारी प्रश्न — मराठीत', suggested: 'सामान्य प्रश्न' },
  en: { t: 'Voice assistant', sub: 'Any government question — in English', suggested: 'Common questions' },
}

export default function VoiceAssistant({ lang }) {
  const [messages, setMessages] = useState([])
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const recognitionRef = useRef(null)
  const chatRef = useRef(null)
  const c = TITLE[lang]
  const qa = SAMPLE_QA[lang] || SAMPLE_QA.en

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  const sendQuestion = async (question) => {
    setMessages(m => [...m, { role: 'user', text: question }])
    setLoading(true)

    // Call backend API
    try {
      const res = await fetch(`http://localhost:4000/api/voice/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, lang }),
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'bot', text: data.answer }])
    } catch {
      // Fallback to local demo answers
      const match = qa.find(q => question.toLowerCase().includes(q.q.split(' ')[0].toLowerCase()))
      const answer = match ? match.a : qa[0].a
      await new Promise(r => setTimeout(r, 800))
      setMessages(m => [...m, { role: 'bot', text: answer }])
    }
    setLoading(false)
  }

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      const demo = qa[Math.floor(Math.random() * qa.length)].q
      sendQuestion(demo)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN'
    recognition.interimResults = false
    recognition.onresult = e => { sendQuestion(e.results[0][0].transcript); setListening(false) }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  return (
    <div className="page-section">
      <div className="page-header">
        <h1 className="page-title">{c.t}</h1>
        <p className="page-subtitle">{c.sub}</p>
      </div>

      <div ref={chatRef} className="chat-wrap" style={{marginBottom:16}}>
        {messages.length === 0 && (
          <div style={{textAlign:'center',padding:'20px 0',color:'var(--ink-light)',fontSize:13}}>
            {PLACEHOLDER[lang]}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role}`}>
            <div className="chat-sender">{m.role === 'bot' ? 'AccessSeva' : lang === 'hi' ? 'आप' : lang === 'mr' ? 'तुम्ही' : 'You'}</div>
            <div style={{whiteSpace:'pre-line'}}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble bot">
            <div className="chat-sender">AccessSeva</div>
            <div style={{display:'flex',gap:5,alignItems:'center'}}>
              {[0,1,2].map(i => (
                <span key={i} style={{width:7,height:7,borderRadius:'50%',background:'var(--ink-light)',animation:`bounce 1s ${i*0.2}s infinite`}}/>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20,padding:'14px 16px',background:'var(--white)',border:'1px solid var(--stone)',borderRadius:'var(--radius-lg)'}}>
        <button className={`voice-btn${listening ? ' listening' : ''}`} onClick={toggleListening}
          style={{width:50,height:50,borderRadius:'50%',border:`2px solid ${listening ? '#e24b4a' : 'var(--saffron)'}`,background: listening ? '#FDECEA' : 'var(--saffron-light)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="7" y="2" width="6" height="9" rx="3" fill={listening ? '#e24b4a' : 'var(--saffron)'}/>
            <path d="M4 9a6 6 0 0012 0" stroke={listening ? '#e24b4a' : 'var(--saffron)'} strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M10 15v3" stroke={listening ? '#e24b4a' : 'var(--saffron)'} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <div style={{flex:1,fontSize:13,color:'var(--ink-mid)'}}>
          {listening
            ? (lang === 'hi' ? 'सुन रहा हूँ...' : lang === 'mr' ? 'ऐकत आहे...' : 'Listening...')
            : PLACEHOLDER[lang]}
        </div>
      </div>

      <div>
        <div style={{fontSize:12,fontWeight:600,letterSpacing:'0.06em',color:'var(--ink-light)',textTransform:'uppercase',marginBottom:10}}>{c.suggested}</div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {qa.map((item, i) => (
            <button key={i} className="btn btn-outline" style={{fontSize:12,fontFamily:'var(--font-hindi)'}}
              onClick={() => sendQuestion(item.q)}>
              {item.q}
            </button>
          ))}
        </div>
      </div>

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }`}</style>
    </div>
  )
}