import type {BuilderDocument} from './model';
import {escapeHtml,rich,safeUrl} from './rich-text';
import {renderProcedureHtml} from './templates/procedure';
import {renderStcuTemplate} from './templates/stcu';

export {escapeHtml,rich,safeUrl} from './rich-text';
export function renderHtml(d:BuilderDocument){const templateDocument={...d,owner:d.effectiveDate||''};const article=d.type==='procedure'?renderProcedureHtml(templateDocument):renderStcuTemplate(templateDocument);const wordFriendly=d.type==='procedure'?article.replace(/<aside[^>]*>/g,'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#D9D9D9" style="width:100%;background-color:#D9D9D9;margin:14px 0"><tbody><tr><td style="background-color:#D9D9D9;padding:6px 8px;line-height:1.5">').replace(/<\/aside>/g,'</td></tr></tbody></table>'):article;return `<style>.procedure-builder-export,.procedure-builder-export *{font-family:Arial,sans-serif!important;mso-fareast-font-family:Arial}</style><div class="procedure-builder-export" style="font-family:Arial,sans-serif;mso-fareast-font-family:Arial">${wordFriendly}</div>`;}
