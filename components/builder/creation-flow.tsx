'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, FileUp, Plus, X } from 'lucide-react';
import { types } from '../../lib/builder/config';
import type { DocumentType } from '../../lib/builder/model';

export function CreationFlow() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'choice' | 'type'>('choice');

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const button = (event.target as Element | null)?.closest('button');
      if (!button || !button.textContent?.trim().includes('Create new document')) return;
      event.preventDefault();
      event.stopPropagation();
      setStep('choice');
      setOpen(true);
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  const start = (type: DocumentType) => {
    setOpen(false);
    requestAnimationFrame(() => {
      Array.from(document.querySelectorAll<HTMLButtonElement>('button.type-card'))
        .find(button => button.classList.contains(`type-${type}`))?.click();
    });
  };

  const importJson = () => {
    setOpen(false);
    requestAnimationFrame(() => {
      Array.from(document.querySelectorAll<HTMLButtonElement>('button'))
        .find(button => button.textContent?.trim() === 'Import JSON')?.click();
    });
  };

  if (!open) return null;
  return <div className="creation-choice-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false); }}>
    <section className="creation-choice-modal" role="dialog" aria-modal="true" aria-label="Create a document">
      <button className="modal-close" aria-label="Close dialog" onClick={() => setOpen(false)}><X size={20}/></button>
      {step === 'choice' ? <>
        <h2>How would you like to begin?</h2>
        <p>Start with a blank document or bring in existing JSON.</p>
        <div className="creation-choice-actions">
          <button onClick={() => setStep('type')}><Plus size={20}/><span><strong>Start new</strong><small>Choose a document type and begin with its template.</small></span><ArrowRight size={18}/></button>
          <button onClick={importJson}><FileUp size={20}/><span><strong>Import JSON</strong><small>Bring in structured content, then review its document type.</small></span><ArrowRight size={18}/></button>
        </div>
      </> : <>
        <button className="back-choice" onClick={() => setStep('choice')}><ArrowLeft size={15}/> Back</button>
        <h2>Choose a document type</h2>
        <p>Each type opens with the structure and formatting it needs.</p>
        <div className="creation-type-list">{Object.entries(types).map(([key, type]) => <button key={key} onClick={() => start(key as DocumentType)}><strong>{type.label}</strong><span>{type.description}</span><ArrowRight size={17}/></button>)}</div>
      </>}
    </section>
  </div>;
}
