# Installation and hosting

Use Node.js 22.13 or later. Run `npm install`, then `npm run dev`. The app does not require a backend for MVP; browser-local IndexedDB holds drafts.

For internal hosting, build with `npm run build` and deploy the generated application through the approved internal hosting path. Do not add a public CDN, analytics tracker, remote font, or runtime third-party script. Validate current corporate Chrome and Microsoft Edge before release.
