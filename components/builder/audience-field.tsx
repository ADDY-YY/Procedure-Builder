'use client';
import {useState} from 'react';
import {TextField} from './fields';

export const audienceOptions = [
  'Frontlines',
  'Contact Center',
  'Debit Card Services',
  'Credit Card Services',
];

export function AudienceField({value,onChange}:{value:string;onChange:(value:string)=>void}) {
  const [customSelected,setCustomSelected] = useState(false);
  const isCustom = customSelected || (!!value && !audienceOptions.includes(value));
  return <div>
    <label className="field">
      <span>Audience</span>
      <select value={isCustom?'__custom__':value} onChange={event=>{
        const selected=event.target.value;
        setCustomSelected(selected==='__custom__');
        if(selected!=='__custom__')onChange(selected);
      }}>
        <option value="">Select an audience…</option>
        {audienceOptions.map(option=><option key={option} value={option}>{option}</option>)}
        <option value="__custom__">Other / custom audience</option>
      </select>
    </label>
    {isCustom&&<TextField label="Custom audience" value={value} onChange={onChange} placeholder="Enter a team or audience"/>}
  </div>;
}
