import { useState } from 'react'

const DOCS_DATA = [
  { id: 1, name: { hi: 'आधार कार्ड', mr: 'आधार कार्ड', en: 'Aadhar Card' }, icon: '🪪', bg: '#E6F5ED', status: 'verified', date: '12 Jan 2024', size: '245 KB' },
  { id: 2, name: { hi: 'वोटर ID', mr: 'मतदार ID', en: 'Voter ID' }, icon: '🗳️', bg: '#E8F4FD', status: 'verified', date: '12 Jan 2024', size: '312 KB' },
  { id: 3, name: { hi: 'बिजली बिल', mr: 'वीज बिल', en: 'Electricity Bill' }, icon: '⚡', bg: '#FFF3CD', status: 'pending', date: '14 Jan 2024', size: '128 KB' },
]

const LABELS = {
  hi: { title: 'मेरे दस्तावेज', sub: 'एक बार अपलोड करें, सभी सेवाओं में काम आएगा', add: '+ दस्तावेज जोड़ें', verified: 'सत्यापित', pending: 'समीक्षाधीन', dragText: 'यहाँ खींचें या क्लिक करें', dragSub: 'JPG, PNG, PDF — 5MB तक' },
  mr: { title: 'माझी कागदपत्रे', sub: 'एकदा अपलोड करा, सर्व सेवांमध्ये वापरले जाईल', add: '+ कागदपत्र जोडा', verified: 'सत्यापित', pending: 'प्रलंबित', dragText: 'येथे ड्रॅग करा किंवा क्लिक करा', dragSub: 'JPG, PNG, PDF — 5MB पर्यंत' },
  en: { title: 'My documents', sub: 'Upload once, reused across all applications', add: '+ Add document', verified: 'Verified', pending: 'Pending', dragText: 'Drag here or click to upload', dragSub: 'JPG, PNG, PDF — up to 5MB' },
}

export default function Documents({ lang }) {
  const [docs, setDocs] = useState(DOCS_DATA)
  const [dragging, setDragging] = useState(false)
  const c = LABELS[lang]

  return (
    <div className="page-section">
      <div className="page-header" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
        <div>
          <h1 className="page-title">{c.title}</h1>
          <p className="page-subtitle">{c.sub}</p>
        </div>
        <button className="btn btn-primary">{c.add}</button>
      </div>

      <div className="doc-grid" style={{marginBottom:24}}>
        {docs.map(doc => (
          <div className="doc-card" key={doc.id}>
            <div className="doc-icon" style={{background:doc.bg}}>
              <span style={{fontSize:20}}>{doc.icon}</span>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div className="doc-name">{doc.name[lang]}</div>
              <div className="doc-meta">{doc.date} · {doc.size}</div>
            </div>
            <span className={`status-badge ${doc.status}`}>
              <span className="status-dot"/>
              {doc.status === 'verified' ? c.verified : c.pending}
            </span>
          </div>
        ))}
      </div>

      <div
        className="upload-zone"
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false) }}
        style={dragging ? {borderColor:'var(--saffron)',background:'var(--saffron-light)'} : {}}
      >
        <div style={{fontSize:28,marginBottom:8}}>📎</div>
        <div className="upload-zone-text">{c.dragText}</div>
        <div className="upload-zone-subtext">{c.dragSub}</div>
      </div>
    </div>
  )
}