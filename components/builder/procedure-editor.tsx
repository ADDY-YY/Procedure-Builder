'use client';

import { useMemo, useState } from 'react';
import { ImagePlus, Plus, Redo2, Search, Undo2, X } from 'lucide-react';
import { newSection, newStep, uid, type ProcedureSection, type Step } from '../../lib/builder/model';
import { sectionLabels } from '../../lib/builder/config';
import { TextField, RichTextField, RepeatableList, SectionCard, ItemActions, move } from './fields';

function matches(value: string, query: string) {
  return !query.trim() || value.toLowerCase().includes(query.trim().toLowerCase());
}

export function ProcedureStepEditor({step,onChange,allowImage=true}:{step:Step;onChange:(s:Step)=>void;allowImage?:boolean}) {
  const substeps = step.substeps || [];
  return <>
    <RichTextField label={step.callout==='important'?'Important information':step.callout==='warning'?'Warning':"Instruction"} required value={step.instruction} onChange={instruction=>onChange({...step,instruction})} placeholder={step.callout?'Write the callout…':"Describe what the reader needs to do…"}/>
    {!step.callout&&<details className="minor-details" open={substeps.length>0}>
      <summary>Substeps <span className="muted">Automatically lettered</span></summary>
      {substeps.map((substep,index)=><div className="substep-row" key={substep.id}>
        <span className="substep-letter">{String.fromCharCode(97+index)}.</span>
        <textarea aria-label={`Substep ${index+1}`} value={substep.instruction} onChange={event=>onChange({...step,substeps:substeps.map((item,itemIndex)=>itemIndex===index?{...item,instruction:event.target.value}:item)})} placeholder="Add a supporting action…"/>
        <ItemActions index={index} length={substeps.length} onMove={to=>onChange({...step,substeps:move(substeps,index,to)})} onDelete={()=>onChange({...step,substeps:substeps.filter((_,itemIndex)=>itemIndex!==index)})}/>
      </div>)}
      <button className="text-button" onClick={()=>onChange({...step,substeps:[...substeps,{id:uid(),instruction:''}]})}><Plus size={14}/>Add substep</button>
    </details>}
    {allowImage&&<details className="minor-details"><summary><ImagePlus size={14}/> Screenshot & visual description</summary><TextField label="Image URL" value={step.image} onChange={image=>onChange({...step,image})} placeholder="https://…"/><label className="upload">Or upload an image <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={event=>{const file=event.target.files?.[0];if(!file)return;if(file.size>1500000){alert('Choose an image smaller than 1.5 MB to fit browser storage.');return;}if(!/^image\/(png|jpeg|webp|gif)$/.test(file.type)){alert('Choose PNG, JPEG, WebP, or GIF.');return;}const reader=new FileReader();reader.onload=()=>onChange({...step,image:String(reader.result)});reader.readAsDataURL(file);}}/></label><TextField label="Visual description / alt text" value={step.description} onChange={description=>onChange({...step,description})}/></details>}
  </>;
}

export function ProcedureEditor({sections,onChange,depth=0,onUndo,onRedo,canUndo=false,canRedo=false}:{sections:ProcedureSection[];onChange:(p:ProcedureSection[])=>void;depth?:number;onUndo?:()=>void;onRedo?:()=>void;canUndo?:boolean;canRedo?:boolean}) {
  const [query,setQuery]=useState('');
  const isHowTo=sections.some(section=>section.template==='how-to');
  const matchesCount=useMemo(()=>sections.reduce((total,section)=>total+[section.title,section.purpose,...section.steps.flatMap(step=>[step.instruction,...(step.substeps||[]).map(substep=>substep.instruction)])].filter(value=>matches(value,query)).length,0),[query,sections]);
  function update(index:number,section:ProcedureSection){onChange(sections.map((item,itemIndex)=>itemIndex===index?section:item));}
  return <>
    {depth===0&&<div className="procedure-toolbar"><label className="procedure-search"><Search size={16}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Find a section, step, or substep…" aria-label="Search this procedure"/>{query&&<><span>{matchesCount} matches</span><button aria-label="Clear procedure search" onClick={()=>setQuery('')}><X size={14}/></button></>}</label><div className="history-actions"><button className="secondary" title="Undo (Ctrl/Cmd+Z)" disabled={!canUndo} onClick={onUndo}><Undo2 size={14}/>Undo</button><button className="secondary" title="Redo (Ctrl/Cmd+Shift+Z)" disabled={!canRedo} onClick={onRedo}><Redo2 size={14}/>Redo</button></div></div>}
    {sections.map((section,index)=>{
      const visible=matches(section.title,query)||matches(section.purpose,query)||section.steps.some(step=>matches(step.instruction,query)||(step.substeps||[]).some(substep=>matches(substep.instruction,query)));
      if(!visible)return null;
      return <SectionCard key={section.id} title={`${String(index+1).padStart(2,'0')}  ${section.title||`Untitled ${isHowTo?'step':'procedure section'}`}`} subtitle={isHowTo?'':`${section.steps.length} steps · ${section.decisions.length} decisions`} open>
        <div className="list-heading">{isHowTo?'STEP':'SECTION'} {index+1}<ItemActions index={index} length={sections.length} onMove={to=>onChange(move(sections,index,to))} onDelete={()=>onChange(sections.filter((_,itemIndex)=>index!==itemIndex))} onDuplicate={()=>onChange([...sections,{...structuredClone(section),id:uid(),title:section.title+' (copy)'}])}/></div>
        <TextField label={isHowTo?'Action':'Section title'} value={section.title} required onChange={title=>update(index,{...section,title})}/>
        <RichTextField label={isHowTo?'Short, direct instruction':'Section purpose'} required={isHowTo} value={section.purpose} onChange={purpose=>update(index,{...section,purpose})}/>
        {!isHowTo&&<RepeatableList label="Prerequisites" items={section.prerequisites} onChange={prerequisites=>update(index,{...section,prerequisites})}/>} 
        {!isHowTo&&<><div className="list-heading">Steps <span className="muted">Automatically numbered</span></div>
        {section.steps.map((step,stepIndex)=>{const label=step.callout==='important'?'Important info':step.callout==='warning'?'Warning':`Step ${section.steps.slice(0,stepIndex+1).filter(item=>!item.callout).length}`;return <div className={`step-card ${step.callout?`callout-${step.callout}`:''}`} key={step.id}>
          <div className="step-heading"><span className="step-number">{step.callout?'!':section.steps.slice(0,stepIndex+1).filter(item=>!item.callout).length}</span><strong>{label}</strong><ItemActions index={stepIndex} length={section.steps.length} onMove={to=>update(index,{...section,steps:move(section.steps,stepIndex,to)})} onDelete={()=>update(index,{...section,steps:section.steps.filter((_,itemIndex)=>itemIndex!==stepIndex)})} onDuplicate={()=>update(index,{...section,steps:[...section.steps.slice(0,stepIndex+1),{...structuredClone(step),id:uid()},...section.steps.slice(stepIndex+1)]})}/></div>
          <ProcedureStepEditor step={step} allowImage={!isHowTo&&!step.callout} onChange={nextStep=>update(index,{...section,steps:section.steps.map((item,itemIndex)=>itemIndex===stepIndex?nextStep:item)})}/>
        </div>;})}
        {!section.steps.length&&<p className="empty-inline">Add the first step in this section.</p>}
        <div className="step-add-actions"><button className="add-wide" onClick={()=>update(index,{...section,steps:[...section.steps,newStep()]})}><Plus size={15}/>Add step</button><button className="secondary" onClick={()=>update(index,{...section,steps:[...section.steps,newStep('important')]})}><Plus size={15}/>Add important info</button><button className="secondary" onClick={()=>update(index,{...section,steps:[...section.steps,newStep('warning')]})}><Plus size={15}/>Add warning</button></div></>}
        {!isHowTo&&<><details className="minor-details" open={section.decisions.length>0}><summary>Decision logic <span className="muted">{section.decisions.length} items</span></summary>{section.decisions.map((decision,decisionIndex)=><div className="decision" key={decision.id}><ItemActions index={decisionIndex} length={section.decisions.length} onMove={to=>update(index,{...section,decisions:move(section.decisions,decisionIndex,to)})} onDelete={()=>update(index,{...section,decisions:section.decisions.filter((_,itemIndex)=>itemIndex!==decisionIndex)})}/>{decision.original&&<div className="import-note"><strong>Original decision · manual review</strong><p>{decision.original}</p><p>Fill in IF and THEN, then convert. The original import remains in your source archive.</p></div>}<TextField label="IF · condition" value={decision.condition} onChange={condition=>update(index,{...section,decisions:section.decisions.map((item,itemIndex)=>decisionIndex===itemIndex?{...item,condition}:item)})}/><TextField label="THEN · result" value={decision.result} onChange={result=>update(index,{...section,decisions:section.decisions.map((item,itemIndex)=>decisionIndex===itemIndex?{...item,result}:item)})}/>{decision.original&&<button className="secondary" disabled={!decision.condition.trim()||!decision.result.trim()} onClick={()=>update(index,{...section,decisions:section.decisions.map((item,itemIndex)=>decisionIndex===itemIndex?{...item,original:''}:item)})}>Use structured decision</button>}</div>)}<button className="text-button" onClick={()=>update(index,{...section,decisions:[...section.decisions,{id:uid(),condition:'',result:'',original:''}]})}><Plus size={14}/>Add decision</button></details>{['notes','warnings','exceptions','sources'].map(key=><details className="minor-details" key={key}><summary>{sectionLabels[key]} <span className="muted">{(section[key as keyof ProcedureSection] as string[]).length} items</span></summary><RepeatableList label={sectionLabels[key]} items={section[key as keyof ProcedureSection] as string[]} onChange={items=>update(index,{...section,[key]:items})}/></details>)}<TextField label="Expected result" value={section.expectedResult} onChange={expectedResult=>update(index,{...section,expectedResult})}/>{depth===0&&<details className="minor-details"><summary>Subsections <span className="muted">{section.subsections?.length||0} items</span></summary><p className="empty-inline">Subsections use teal headings in your procedure template.</p><ProcedureEditor depth={1} sections={section.subsections||[]} onChange={subsections=>update(index,{...section,subsections})}/></details>}</>}
      </SectionCard>;
    })}
    <button className="add-wide" onClick={()=>{const section=newSection();if(isHowTo){section.template='how-to';section.steps=[];}onChange([...sections,section]);}}><Plus size={16}/>{depth?'Add subsection':isHowTo?'Add step':'Add procedure section'}</button>
  </>;
}
