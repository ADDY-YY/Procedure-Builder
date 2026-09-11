'use client';

import { CircleHelp, Download, Eye, FileOutput, FilePlus2, HardDrive, Upload, X } from 'lucide-react';
import { useState } from 'react';

export function HowToUse() {
  const [open, setOpen] = useState(false);
  return <>
    <button className="sidebar-how-to" onClick={() => setOpen(true)}><CircleHelp size={17}/>How to use</button>
    {open && <div className="how-to-overlay" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section className="how-to-modal" role="dialog" aria-modal="true" aria-label="How to use Procedure Builder">
        <button className="modal-close" aria-label="Close dialog" onClick={() => setOpen(false)}><X size={20}/></button>
        <h2>How to use Procedure Builder</h2>
        <p>Use the templates to turn working knowledge into a clear, consistent document.</p>
        <div className="how-to-steps">
          <div><FilePlus2 size={19}/><p><strong>Start or import.</strong> Select <em>Start a document</em> for a blank template, or choose JSON import when you already have structured content.</p></div>
          <div><Upload size={19}/><p><strong>Choose the template.</strong> Pick the format that fits the job, then complete the document information and the sections shown in the editor.</p></div>
          <div><Eye size={19}/><p><strong>Check the preview.</strong> The preview updates while you write. Keep it open to review formatting, or collapse it to focus on editing.</p></div>
          <div><HardDrive size={19}/><p><strong>Save your draft.</strong> Changes save automatically in the current browser. Use <em>Save draft</em> before leaving when you want confirmation that the latest version is stored.</p></div>
          <div><Download size={19}/><p><strong>Keep a portable backup.</strong> Select <em>Save JSON</em> in the editor to download the structured source file. Save it to your approved work location or share it with another Procedure Builder user. Browser drafts can be lost if browser data is cleared, you change browsers, or use another device.</p></div>
          <div><FileOutput size={19}/><p><strong>Export the finished document.</strong> Select <em>Generate HTML</em> when every required field is complete. In the export window, choose <em>Download HTML</em> for a knowledge base, <em>Download Word document</em> for editing in Word, <em>Save as PDF</em> and choose Save as PDF in the print dialog, or <em>Copy for Freshservice</em> to paste the article into Freshservice.</p></div>
        </div>
        <p className="how-to-note">This is a proof of concept. Do not enter sensitive information.</p>
      </section>
    </div>}
  </>;
}
