# My Truyen

Open-source, Google Sheets-powered platform for publishing and reading novels or translations. No backend, no database, no infrastructure beyond a static Next.js deployment.

## 10-minute setup

1. **Fork the repo**
2. **Create a Google Sheet** with two tabs:
   - `novels` with headers: `slug | title | author | cover | summary | tags | status`
   - `chapters` with headers: `novel_slug | chapter_number | title | content | created_at`
3. **Make the sheet public** (Share → Anyone with the link can view).
4. **Create a Google OAuth client**
   - Google Cloud Console → APIs & Services → Credentials
   - Create OAuth client (Web) and add your site domain + `http://localhost:3000` as authorized origins
   - Add `http://localhost:3000/admin` as redirect URI
   - Add your production domain `/admin` as redirect URI too
5. **Add env vars** (copy `.env.example` → `.env.local`)
   - `NEXT_PUBLIC_SHEETS_ID=...`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID=...`
   - `GOOGLE_CLIENT_SECRET=...`
   - `NEXT_PUBLIC_ADMIN_EMAILS=baoletrangiabao@gmail.com`
6. **Install + run**

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` and head to `/admin/editor` to connect your Google account.

## Admin editor flow

- `/admin/editor` uses Google OAuth (PKCE) and the Sheets API.
- WYSIWYG editor is TipTap; content is saved as HTML in the Google Sheet.
- For security, only OAuth tokens from your Google account are used (no server-side secrets for writes).

## Deployment

Deploy on Vercel (or any Next.js host). Add the same env vars from `.env.example` in your hosting provider.
