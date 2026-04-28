import { useState } from 'react'

const SERVICES_LIST = [
  {
    id: 'ration', icon: '📄',
    name: { hi: 'राशन कार्ड', mr: 'रेशनकार्ड', en: 'Ration Card' },
    steps: {
      hi: [
        { title: 'पहचान दस्तावेज', sub: 'आधार कार्ड और वोटर ID', desc: 'परिवार के सभी सदस्यों का आधार कार्ड अपलोड करें। वोटर ID भी आवश्यक है।', docs: ['आधार कार्ड', 'वोटर ID'] },
        { title: 'पते का प्रमाण', sub: 'बिजली बिल या बैंक पासबुक', desc: 'हाल का बिजली बिल (3 महीने से पुराना नहीं) या बैंक पासबुक का पहला पृष्ठ।', docs: ['बिजली बिल', 'बैंक पासबुक'] },
        { title: 'परिवार की जानकारी', sub: 'सभी सदस्यों के नाम', desc: 'परिवार के हर सदस्य का नाम, जन्म तिथि और आधार नंबर भरें।', docs: [] },
        { title: 'जमा करें', sub: 'आवेदन सबमिट करें', desc: 'सभी दस्तावेज अपलोड होने के बाद "जमा करें" बटन दबाएं। आपको SMS पर रसीद नंबर मिलेगा।', docs: [] },
      ],
      mr: [
        { title: 'ओळखीची कागदपत्रे', sub: 'आधार कार्ड आणि मतदार ID', desc: 'कुटुंबातील सर्व सदस्यांचे आधार कार्ड अपलोड करा.', docs: ['आधार कार्ड', 'मतदार ID'] },
        { title: 'पत्त्याचा पुरावा', sub: 'वीज बिल किंवा बँक पासबुक', desc: 'अलीकडील वीज बिल किंवा बँक पासबुकचे पहिले पान.', docs: ['वीज बिल', 'बँक पासबुक'] },
        { title: 'कुटुंबाची माहिती', sub: 'सर्व सदस्यांची नावे', desc: 'कुटुंबातील प्रत्येक सदस्याचे नाव, जन्मतारीख आणि आधार क्रमांक भरा.', docs: [] },
        { title: 'सादर करा', sub: 'अर्ज सादर करा', desc: 'सर्व कागदपत्रे अपलोड झाल्यावर "सादर करा" बटण दाबा.', docs: [] },
      ],
      en: [
        { title: 'Identity documents', sub: 'Aadhar card and Voter ID', desc: 'Upload Aadhar card of all family members. Voter ID is also required.', docs: ['Aadhar card', 'Voter ID'] },
        { title: 'Address proof', sub: 'Electricity bill or bank passbook', desc: 'Recent electricity bill (not older than 3 months) or first page of bank passbook.', docs: ['Electricity bill', 'Bank passbook'] },
        { title: 'Family details', sub: 'Names of all members', desc: 'Fill in name, date of birth and Aadhar number of every family member.', docs: [] },
        { title: 'Submit application', sub: 'Submit your application', desc: 'After uploading all documents, press "Submit". You will receive a receipt number via SMS.', docs: [] },
      ],
    }
  },
]

const BTN = {
  hi: { next: 'अगला →', prev: '← पिछला', upload: 'दस्तावेज अपलोड करें', done: '✓ जमा करें' },
  mr: { next: 'पुढे →', prev: '← मागे', upload: 'कागदपत्र अपलोड करा', done: '✓ सादर करा' },
  en: { next: 'Next →', prev: '← Back', upload: 'Upload document', done: '✓ Submit' },
}

const TIP = {
  hi: 'बिजली बिल नहीं है? बैंक पासबुक का पहला पृष्ठ भी मान्य है।',
  mr: 'वीज बिल नाही? बँक पासबुकचे पहिले पान देखील वैध आहे.',
  en: 'No electricity bill? The first page of your bank passbook is also accepted.',
}

export default function ServiceGuide({ lang }) {
  const [activeService, setActiveService] = useState(SERVICES_LIST[0])
  const [currentStep, setCurrentStep] = useState(0)
  const steps = activeService.steps[lang]
  const b = BTN[lang]
  const progress = Math.round(((currentStep) / steps.length) * 100)

  return (
    <div className="page-section">
      <div className="page-header">
        <h1 className="page-title">{activeService.name[lang]}</h1>
      </div>

      <div className="step-guide">
        <div className="step-guide-header">
          <span style={{fontSize:13,fontWeight:500}}>
            {lang === 'hi' ? `चरण ${currentStep + 1} / ${steps.length}` :
             lang === 'mr' ? `पायरी ${currentStep + 1} / ${steps.length}` :
             `Step ${currentStep + 1} of ${steps.length}`}
          </span>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{width: `${((currentStep + 1) / steps.length) * 100}%`}} />
          </div>
          <span style={{fontSize:13,color:'var(--green)',fontWeight:500}}>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>

        {steps.map((step, i) => (
          <div className="step-item" key={i} style={i === currentStep ? {background:'var(--sand)'} : {}}>
            <div className={`step-num ${i < currentStep ? 'done' : i === currentStep ? 'active' : 'todo'}`}>
              {i < currentStep ? '✓' : i + 1}
            </div>
            <div style={{flex:1}}>
              <div className="step-content-title" style={i !== currentStep ? {color:'var(--ink-light)'} : {}}>{step.title}</div>
              <div className="step-content-sub">{step.sub}</div>
              {i === currentStep && (
                <>
                  <div className="step-content-desc">{step.desc}</div>
                  {step.docs.length > 0 && (
                    <div style={{marginTop:10,display:'flex',gap:8,flexWrap:'wrap'}}>
                      {step.docs.map(doc => (
                        <button key={doc} className="btn btn-outline" style={{fontSize:12,padding:'6px 12px'}}>
                          ↑ {b.upload}: {doc}
                        </button>
                      ))}
                    </div>
                  )}
                  {i === 1 && (
                    <div style={{marginTop:10,padding:'10px 12px',background:'#E8F4FD',borderRadius:'var(--radius-sm)',fontSize:12,color:'var(--sky-dark)'}}>
                      ℹ️ {TIP[lang]}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        <div style={{padding:'14px 20px',display:'flex',gap:10,justifyContent:'flex-end',borderTop:'1px solid var(--stone)'}}>
          {currentStep > 0 && (
            <button className="btn btn-outline" onClick={() => setCurrentStep(s => s - 1)}>{b.prev}</button>
          )}
          {currentStep < steps.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setCurrentStep(s => s + 1)}>{b.next}</button>
          ) : (
            <button className="btn btn-primary" style={{background:'var(--green)'}}>{b.done}</button>
          )}
        </div>
      </div>
    </div>
  )
}