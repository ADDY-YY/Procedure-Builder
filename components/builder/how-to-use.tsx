'use client';

import { CircleHelp, X } from 'lucide-react';
import { useState } from 'react';

export function HowToUse() {
  const [open, setOpen] = useState(false);
  return <>
    <button className="sidebar-how-to" onClick={() => setOpen(true)}><CircleHelp size={17}/>How to use</button>
    {open && <div className="how-to-overlay" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section className="how-to-modal" role="dialog" aria-modal="true" aria-label="How to use Procedure Builder">
        <button className="modal-close" aria-label="Close dialog" onClick={() => setOpen(false)}><X size={20}/></button>
        <h2>How to use Procedure Builder</h2>
        <p>Create a clear document, review it as you work, then export it in the format you need.</p>
        <ol>
          <li><strong>Start a document.</strong> Choose a blank template or import structured JSON.</li>
          <li><strong>Complete the editor.</strong> Add the document information and the sections shown for that template.</li>
          <li><strong>Review the preview.</strong> It updates as you write and can be collapsed when you need more room.</li>
          <li><strong>Save or export.</strong> Drafts stay in this browser. Export HTML, Word, PDF, or copy content for Freshservice when it is ready.</li>
        </ol>
        <p className="how-to-note">This is a proof of concept. Do not enter sensitive information.</p>
      </section>
    </div>}
  </>;
}
