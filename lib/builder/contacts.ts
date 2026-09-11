export type Contact = {department:string;extension:string;email:string};

export function parseContact(value:string):Contact{
  try{const parsed=JSON.parse(value) as Partial<Contact>;if(parsed&&typeof parsed==='object'&&('department'in parsed||'extension'in parsed||'email'in parsed))return {department:typeof parsed.department==='string'?parsed.department:'',extension:typeof parsed.extension==='string'?parsed.extension:'',email:typeof parsed.email==='string'?parsed.email:''};}catch{}
  return {department:value,extension:'',email:''};
}

export function formatContact(value:string){const contact=parseContact(value);return [contact.department,contact.extension?`Ext. ${contact.extension}`:'',contact.email].filter(Boolean).join(' · ');}
