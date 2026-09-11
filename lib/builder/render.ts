import type {BuilderDocument} from './model';
import {escapeHtml,rich,safeUrl} from './rich-text';
import {renderProcedureHtml} from './templates/procedure';
import {renderStcuTemplate} from './templates/stcu';

export {escapeHtml,rich,safeUrl} from './rich-text';
export function renderHtml(d:BuilderDocument){const article=d.type==='procedure'?renderProcedureHtml(d):renderStcuTemplate(d);return `<style>.procedure-builder-export,.procedure-builder-export *{font-family:Arial,sans-serif!important;mso-fareast-font-family:Arial}</style><div class="procedure-builder-export" style="font-family:Arial,sans-serif;mso-fareast-font-family:Arial">${article}</div>`;}
