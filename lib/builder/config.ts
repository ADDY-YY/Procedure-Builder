import type {DocumentType} from './model';
export const configurationVersion = 1;
export const contentOwnerOptions = ['Knowledge Management','Operations','Frontline Support','Card Services'];
export const contactDepartmentOptions = ['Branch Operations','Contact Center','Debit Card Services','Credit Card Services','Frontline Support','Knowledge Management','Operations'];
export type FieldConfig={key:string;label:string};
export type GroupConfig={key:string;label:string;fields:FieldConfig[]};
const group=(key:string,label:string,labels:string[]):GroupConfig=>({key,label,fields:labels.map(label=>({key:label.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/_$/,''),label}))});
export const types:Record<DocumentType,{label:string;description:string;groups:GroupConfig[]}>={
procedure:{label:'Procedure',description:'A consistent process, from start to finish.',groups:[group('support','Supporting resources',['Supporting Resources','Contacts']),group('revision','Revision information',['Revision Information'])]},
'how-to':{label:'How-To',description:'Help someone complete a specific task.',groups:[group('before_you_start','Before You Start',['Required access','Required apps / setup','Pre-steps']),group('troubleshooting','If Something Doesn’t Work',['Do this','If issue']),group('important_notes','Important Notes',['Important Notes']),group('need_help','Need Help',['Submit a ticket','Contact team','Link to procedure'])]},
faq:{label:'FAQ',description:'Clear answers to common questions.',groups:[group('support','Supporting information',['Need More Details'])]},
reference:{label:'Reference Guide',description:'Knowledge your team can come back to.',groups:[group('overview','Overview & definitions',['Overview','Definitions']),group('support','Supporting information',['Important Information','Supporting Resources','Contacts'])]}
,
'decision-table':{label:'Decision Table',description:'Map scenarios to clear, consistent solutions.',groups:[group('support','Supporting information',['Need More Details','Need Help'])]},
'job-aid-one-column':{label:'Job Aid 1 column',description:'Present step and action guidance in a focused table.',groups:[group('reminders','Key reminders',['Key Reminders']),group('support','Supporting information',['Need More Details','Need Help'])]},
'job-aid-two-column':{label:'Job Aid 2 column',description:'Present paired actions side by side.',groups:[group('reminders','Key reminders',['Key Reminders']),group('support','Supporting information',['Need More Details','Need Help'])]},
'quick-reference':{label:'Quick Reference Guide',description:'Create a compact guide for fast answers.',groups:[group('support','Supporting information',['Need More Details','Need Help'])]}
};
export const sectionLabels:Record<string,string>={prerequisites:'Prerequisites',notes:'Important information',exceptions:'Exceptions',warnings:'Warnings',sources:'Sources'};
