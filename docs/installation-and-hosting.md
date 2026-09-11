# Installation and hosting

Use Node.js 22.13 or later. Run `npm install`, then `npm run dev`. The app does not require a backend for MVP; browser-local IndexedDB holds drafts.

For internal hosting, deploy the `main` branch to Vercel. Vercel uses `vercel.json` to build the application as a Next.js site; this is the supported production deployment path. The Vinext/Cloudflare configuration supports the local Codex preview only and is not a production target. Do not add a public CDN, analytics tracker, remote font, or runtime third-party script. Validate current corporate Chrome and Microsoft Edge before release.
