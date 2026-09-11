import type {BuilderDocument} from './model';
import {escapeHtml,rich,safeUrl} from './rich-text';
import {renderProcedureHtml} from './templates/procedure';
import {renderStcuTemplate} from './templates/stcu';

export {escapeHtml,rich,safeUrl} from './rich-text';
export function renderHtml(d:BuilderDocument){return d.type==='procedure'?renderProcedureHtml(d):renderStcuTemplate(d);}
