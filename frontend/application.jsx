const APPS = [
  { name: { hi: 'राशन कार्ड', mr: 'रेशनकार्ड', en: 'Ration Card' }, id: 'APP-2024-001', date: '15 Jan 2024', status: 'processing', step: 2, total: 4 },
  { name: { hi: 'PM आवास योजना', mr: 'PM आवास योजना', en: 'PM Awas Yojana' }, id: 'APP-2024-002', date: '8 Jan 2024', status: 'pending', step: 1, total: 6 },
  { name: { hi: 'वृद्धावस्था पेंशन', mr: 'वृद्धापकाळ पेन्शन', en: 'Old Age Pension' }, id: 'APP-2023-118', date: '20 Dec 2023', status: 'approved', step: 5, total: 5 },
]

const STATUS_LABEL = {
  processing: { hi: 'प्रक्रिया में', mr: 'प्रक्रियेत', en: 'Processing' },
  pending:    { hi: 'लंबित', mr: 'प्रलंबित', en: 'Pending' },
  approved:   { hi: 'स्वीकृत', mr: 'मंजूर', en: 'Approved' },
  rejected:   { hi: 'अस्वीकृत', mr: 'नाकारले', en: 'Rejected' },
}

const LABELS = {
  hi: { title: 'मेरे आवेदन', sub: 'सभी सरकारी आवेदनों की स्थिति', cols: ['सेवा', 'ID', 'तारीख', 'स्थिति', 'प्रगति'] },
  mr: { title: 'माझे अर्ज', sub: 'सर्व सरकारी अर्जांची स्थिती', cols: ['सेवा', 'ID', 'तारीख', 'स्थिती', 'प्रगती'] },
  en: { title: 'My applications', sub: 'Status of all government applications', cols: ['Service', 'ID', 'Date', 'Status', 'Progress'] },
}

export default function Applications({ lang }) {
  const c = LABELS[lang]
  return (
    <div className="page-section">
      <div className="page-header">
        <h1 className="page-title">{c.title}</h1>
        <p className="page-subtitle">{c.sub}</p>
      </div>
      <div className="applications-table">
        <div className="table-header" style={{gridTemplateColumns:'2fr 1.2fr 1fr 1fr 1fr'}}>
          {c.cols.map(col => <span key={col}>{col}</span>)}
        </div>
        {APPS.map((a, i) => (
          <div className="table-row" key={i} style={{gridTemplateColumns:'2fr 1.2fr 1fr 1fr 1fr'}}>
            <div>
              <div className="app-name">{a.name[lang]}</div>
              <div className="app-id">{a.id}</div>
            </div>
            <div style={{fontSize:12,fontFamily:'monospace',color:'var(--ink-mid)'}}>{a.id}</div>
            <div style={{fontSize:12,color:'var(--ink-light)'}}>{a.date}</div>
            <div>
              <span className={`status-badge ${a.status}`}>
                <span className="status-dot"/>
                {STATUS_LABEL[a.status][lang]}
              </span>
            </div>
            <div>
              <div style={{fontSize:12,color:'var(--ink-mid)',marginBottom:4}}>{a.step}/{a.total}</div>
              <div className="progress-bar-wrap" style={{margin:0}}>
                <div className="progress-bar-fill" style={{width:`${(a.step/a.total)*100}%`}}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}