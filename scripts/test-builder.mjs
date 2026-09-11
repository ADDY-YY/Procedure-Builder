import {build} from 'esbuild';
import {mkdir} from 'node:fs/promises';
await mkdir('work',{recursive:true});
await build({entryPoints:['tests/workflow.test.ts'],bundle:true,platform:'node',format:'esm',outfile:'work/workflow-test.mjs'});
await import('../work/workflow-test.mjs');
