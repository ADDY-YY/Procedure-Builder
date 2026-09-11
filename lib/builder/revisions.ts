export type Revision = {date:string;notes:string};

export function parseRevision(value:string):Revision{
  try{const parsed=JSON.parse(value) as Partial<Revision>;if(parsed&&typeof parsed==='object'&&('date'in parsed||'notes'in parsed))return {date:typeof parsed.date==='string'?parsed.date:'',notes:typeof parsed.notes==='string'?parsed.notes:''};}catch{}
  return {date:'',notes:value};
}

export function formatRevision(value:string){const revision=parseRevision(value);const date=/^\d{4}-\d{2}-\d{2}$/.test(revision.date)?new Date(`${revision.date}T12:00:00`).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}):revision.date;return [date,revision.notes].filter(Boolean).join(' — ');}
