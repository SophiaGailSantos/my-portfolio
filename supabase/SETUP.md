# Contact form setup (Supabase + Resend)

Messages are stored in a Supabase table and emailed to
gailsantos38@gmail.com. Order matters: 1, 2, 3, 4.

## 1. Create the Supabase project

1. Sign up at <https://supabase.com> with gailsantos38@gmail.com
2. Create a project. Pick the region closest to your visitors
   (Singapore for the Philippines), and save the database password somewhere safe
3. Wait for the project to finish provisioning (about a minute)

## 2. Create the table

In the dashboard: **SQL Editor > New query**. Paste the whole of
[`schema.sql`](./schema.sql) and click **Run**.

You should see `Success. No rows returned`.

Two things worth doing afterwards, as a safety check:

- **Table Editor** > `contact_messages` should appear and be empty
- **SQL Editor** > run the two sanity-check queries at the bottom of
  `schema.sql` to confirm no policies exist

## 3. Deploy the Edge Function

1. Dashboard > **Edge Functions** > **New Function**
2. Name it `rapid-responder`. The name matters: the frontend calls this exact
   name via `CONTACT_FUNCTION` in [`../src/lib/supabase.js`](../src/lib/supabase.js),
   so a mismatch means a 404 and a form that never sends
3. Pick the **Deno** runtime when asked
4. Replace the generated code with the contents of
   [`functions/contact/index.ts`](./functions/contact/index.ts)
5. Click **Deploy**

The first deploy takes about 30 seconds.

## 4. Add the Resend key (this is what emails you)

1. Sign up at <https://resend.com> using gailsantos38@gmail.com
2. **API Keys** > **Create API Key** > copy it (starts with `re_`)
3. Back in Supabase: **Edge Functions** > `rapid-responder` > **Secrets** > **Add
   new secret**
   - Name: `RESEND_API_KEY`
   - Value: the key you just copied
4. Redeploy the function so it picks up the secret

You do not need to verify a domain. The sender address is
`onboarding@resend.dev`, which Resend only allows to send to the account
owner's own email address. That is fine here, because the only recipient is
your own Gmail. The free tier allows 3,000 emails/month.

To change the destination or sender, add optional secrets on the function:

- `CONTACT_TO_EMAIL` (defaults to gailsantos38@gmail.com)
- `CONTACT_FROM_EMAIL` (defaults to `Portfolio <onboarding@resend.dev>`)

## 5. Point the frontend at the project

1. Copy `.env.example` to `.env.local`
2. Supabase dashboard > **Settings** > **API**
3. Fill in the **Project URL** and the **anon public** key:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

4. Restart the dev server, since Vite only reads env vars at startup:
   `npm run dev`

## 6. Test it

Submit a message from the contact form, then check:

- The thank-you card appears
- **Supabase > Table Editor > contact_messages** has a new row
- Your Gmail has the email, and replying goes to the sender's address

If the thank-you appears but no email arrives, open the function's **Logs** in
the dashboard (Edge Functions > `rapid-responder` > Logs). A
`RESEND_API_KEY is not set` warning means step 4 is missing.

## Reading and exporting messages

Table Editor shows the newest first. For a spreadsheet, **Table Editor >
contact_messages** then export as CSV.

## Free plan limits

- 2 projects, 500 MB database, 500,000 Edge Function invocations/month
- **Free projects pause after 7 days with no database activity.** If messages
  stop arriving and the dashboard says the project is paused, click restore.
  A portfolio with an active contact form is usually fine, but a quiet site
  could get paused.
