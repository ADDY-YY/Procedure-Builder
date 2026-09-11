import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {currentSchemaVersion,newDocument,newSection,newStep,validate,cloneDocument} from '../lib/builder/model';
import {renderHtml,rich} from '../lib/builder/render';
import {importAgentJson} from '../lib/builder/import';
import {exampleDocument} from '../lib/builder/example';

const d=newDocument();
assert.equal(d.schemaVersion,currentSchemaVersion);
assert(validate(d).length>0);
d.title='Test <script>alert(1)</script>';
d.purpose='A useful **purpose** with [link](https://example.com).';
d.procedures=[newSection(),newSection()];
d.procedures.forEach((p,i)=>{p.title=`Section ${i+1}`;p.steps=['First','Second','Third'].map(s=>({...newStep(),instruction:`${i+1}: ${s}`}));p.notes=['Important note'];p.decisions=[{id:'d',condition:'Check fails',result:'Stop',original:''}];});
assert.deepEqual(newStep().substeps,[]);
d.procedures[0].steps[0].substeps=[{id:'substep-a',instruction:'Verify the account details.'}];
d.procedures[0].steps.splice(1,0,{...newStep('important'),instruction:'Confirm the member is present.'},{...newStep('warning'),instruction:'Do not disclose account details.'});
const first=d.procedures[0].steps.shift()!;
d.procedures[0].steps.push(first);
assert.equal(validate(d).length,0);
const html=renderHtml(d);
assert(html.indexOf('1: Second')<html.indexOf('1: First'));
assert(html.indexOf('1: First')<html.indexOf('id="procedure-2"'));
assert(!html.includes('<script>'));
assert(html.includes('&lt;script&gt;'));
assert(html.includes('<strong>purpose</strong>'));
assert(html.includes('list-style-type:lower-alpha'));
assert(html.includes('Verify the account details.'));
assert(html.includes('Important!</strong> Confirm the member is present.'));
assert(html.includes('Warning!</strong> Do not disclose account details.'));
const dated=newDocument();dated.title='Dated';dated.purpose='Test';dated.procedures[0].title='Action';dated.procedures[0].steps[0].instruction='Complete the action.';dated.effectiveDate='2026-09-11';dated.owner='Operations';assert(renderHtml(dated).includes('September 11, 2026'));assert(!renderHtml(dated).includes('Operations'));
const howTo=newDocument('how-to');howTo.title='Reset a profile';howTo.purpose='Restore access.';howTo.procedures[0].title='Open settings';howTo.procedures[0].purpose='Open profile settings.';howTo.procedures[0].steps=[];assert.equal(validate(howTo).length,0);const howToHtml=renderHtml(howTo);assert(howToHtml.includes('How To: Reset a profile'));assert(howToHtml.includes('Open profile settings.'));howTo.fields={use_this_article_when:['The profile cannot be opened.'],error_message_situation:['Access denied'],user_need:['Restore access'],required_access:['Sign in to the support console.'],required_apps_setup:['Open the member profile tool.'],pre_steps:['Close the previous profile.'],if_issue:['access remains blocked'],do_this:['Contact Identity Support.'],important_notes:['Do not reset a shared profile.'],submit_a_ticket:['Open an Identity Support ticket.'],contact_team:['Identity Support'],link_to_procedure:['Profile access procedure']};const completeHowTo=renderHtml(howTo);['The profile cannot be opened.','Access denied','Restore access','Sign in to the support console.','Open the member profile tool.','Close the previous profile.','access remains blocked','Contact Identity Support.','Do not reset a shared profile.','Open an Identity Support ticket.','Identity Support','Profile access procedure'].forEach(value=>assert(completeHowTo.includes(value)));
assert(!rich('[bad](javascript:alert(1))').includes('href='));
assert.notEqual(cloneDocument(d).id,d.id);

const sample=readFileSync('public/examples/agent-1.json','utf8');
const imported=importAgentJson(sample).document;
assert.equal(imported.procedures.length,2);
assert.equal(imported.procedures[0].steps.length,2);
assert.equal(imported.procedures[1].steps.length,2);
assert(imported.procedures[0].decisions[0].original.includes('30 days'));
assert.equal(imported.procedures[0].decisions[0].condition,'');
assert.equal(imported.procedures[1].decisions[0].condition,'The amount does not match the order');
assert.deepEqual(imported.importOriginal,JSON.parse(sample));
assert(imported.unmapped);
assert.equal(validate(imported).length,0);
assert.equal(importAgentJson('{"document\\_type":"procedure","document":{"title":"Escaped","purpose":"Works"}}').document.title,'Escaped');
assert.throws(()=>importAgentJson('[]'));
assert(!importAgentJson('{"document":{"title":"</title><script>alert(1)</script>","purpose":"Safe"}}').document.title.includes('<'));
for(const type of ['faq','reference'] as const){const x=newDocument(type);x.title='Test';x.purpose='Test';x.entries=[{id:'e',title:'Question',content:'Answer'}];assert.equal(validate(x).length,0);assert(renderHtml(x).includes('Answer'));}
for(const type of ['decision-table','job-aid-one-column','job-aid-two-column','quick-reference'] as const){const x=newDocument(type);x.title='Test';x.purpose='Test';x.entries=[{id:'e',title:'Scenario',content:'Solution'}];assert.equal(validate(x).length,0);assert(renderHtml(x).includes('STCU'));assert(renderHtml(x).includes('Solution'));}
for(const type of ['procedure','how-to','faq','reference','decision-table','job-aid-one-column','job-aid-two-column','quick-reference'] as const){const x=newDocument(type);x.title='Shared header';x.audience='Frontlines';x.owner='Operations';x.effectiveDate='2026-09-11';x.purpose='Test';if(type==='procedure'||type==='how-to'){x.procedures[0].title='Action';x.procedures[0].purpose='Complete the action.';x.procedures[0].steps=[];}else x.entries=[{id:'e',title:'Question',content:'Answer'}];const output=renderHtml(x);assert(output.includes('Shared header'));assert(output.includes('September 11, 2026'));assert(output.includes('font-family:Arial'));}
for(const type of ['faq','decision-table','job-aid-one-column','job-aid-two-column','quick-reference'] as const){const x=newDocument(type);x.title='Test';x.purpose='Test';x.entries=[{id:'e',title:'Scenario',content:'Solution'}];x.fields.need_more_details=['Open the full procedure.'];x.fields.need_help=['Contact Operations.'];if(type.startsWith('job-aid'))x.fields.key_reminders=['Keep the member information secure.'];const output=renderHtml(x);assert(output.includes('Open the full procedure.'));if(type!=='faq')assert(output.includes('Contact Operations.'));if(type.startsWith('job-aid'))assert(output.includes('Keep the member information secure.'));}
writeFileSync('public/examples/procedure-document.json',JSON.stringify(exampleDocument(),null,2));
writeFileSync('public/examples/procedure-export.html','<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Example procedure</title></head><body>'+renderHtml(exampleDocument())+'</body></html>');
console.log('PASS: structured source, schema version, sections, steps, reordering, safe rendering, Agent 1 hierarchy, raw decisions, unknown content, escaped underscores, and document types.');

const templateDoc=exampleDocument();
templateDoc.knowledgeSubcategories={when_to_use:[{id:'subcat',title:'Special scenario',content:'Check **eligibility** first.'}]};
templateDoc.fields.contacts=['Branch Operations'];
templateDoc.fields.revision_history=['2026-09-10 — Initial draft'];
templateDoc.fields.last_reviewed=['2026-09-10'];
templateDoc.procedures[0].subsections=[{...newSection(),title:'Escalate a mismatch',steps:[{...newStep(),instruction:'Contact the branch manager.'}]}];
const templated=renderHtml(templateDoc);
['#982371','#8FD4D5','#FFA412','alt="STCU"','Sections (TOC)','href="#procedure-1"','id="procedure-1"','Important!</strong>','>If</th>','>Then</th>','>Contact(s)</h3>','Revision Information','Special scenario','id="procedure-1-1"'].forEach(value=>assert(templated.includes(value)));
assert(templated.includes('bgcolor="#D9D9D9"'));
assert.equal(validate(templateDoc).length,0);
templateDoc.procedures[0].subsections[0].steps=[];
assert(validate(templateDoc).some(e=>e.includes('subsection')));
const nested=importAgentJson(JSON.stringify({document:{title:'Nested',purpose:'Example'},procedures:[{title:'Parent',steps:['One'],subsections:[{title:'Child',steps:['Nested one','Nested two']}]}]})).document;
assert.equal(nested.procedures[0].subsections?.[0].steps.length,2);
assert.equal(nested.procedures[0].steps.length,1);
console.log('PASS: template tokens, linked contents, IF/THEN table, important content, contacts, revisions, subcategories, nested subsections, and validation.');
