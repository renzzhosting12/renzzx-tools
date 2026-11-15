# LYNXIE NEXORA

All-in-one browser tools dashboard with a dark neon / anime-inspired visual style, 100+ tool entries, search, categories, Supabase-ready login/register, and VVIP role display.

## Run locally
1. Install Node.js 18+.
2. Extract this ZIP and open the project folder.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local URL shown by Vite.

## Deploy to Vercel
1. Upload this folder to a GitHub repository.
2. In Vercel choose **Add New → Project** and import the repository.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy. Vercel automatically serves the SPA using `vercel.json`.

## Enable real accounts + VVIP
Without Supabase environment variables, login/register UI is present but authentication intentionally stays disabled. Do not treat browser/localStorage demo authentication as secure.

1. Create a Supabase project.
2. In Supabase SQL Editor run `supabase-setup.sql`.
3. In Vercel → Project → Settings → Environment Variables add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Redeploy the project.
5. New users receive `member` role. To grant VVIP, find the user's UUID in Supabase Authentication → Users, then run the commented UPDATE statement in `supabase-setup.sql` with that UUID.
6. Keep service-role keys private. Never put a Supabase service-role key in frontend variables.

## Notes
- 100+ tool cards are included. Many are functional client-side utilities; browser-only operations run on the user's device.
- Some helpers are intentionally lightweight (for example, simple CSV parsing and whitespace minification), not full standards-compliant parsers.
- JWT Decoder only decodes the payload; it does NOT verify signatures.
- No downloader, account cracking, private-data lookup, or other intrusive tools are included.
- Avoid entering passwords, tokens, personal records, or other secrets into public tools.
