# NeighborWell StackBlitz Setup

## Correct file to upload

For a working StackBlitz interface preview, upload `NeighborWell-StackBlitz-Browser-Preview.zip`. The separate `NeighborWell-Complete-Production-Source.zip` archive preserves the hosted architecture but is not expected to run inside a StackBlitz WebContainer.

## Import steps

1. Sign in to StackBlitz.
2. Choose **New Project** and then **Upload Project**.
3. Upload `NeighborWell-StackBlitz-Browser-Preview.zip`.
4. Confirm that `package.json` is visible at the project root—not inside a second nested folder.
5. Allow dependency installation to finish.
6. In the terminal, run `npm run dev` if StackBlitz does not start it automatically.
7. Open the generated preview URL.

## Runtime requirement

The browser-preview project uses standard Vite and React. The complete production source requires Node.js 22.13 or newer.

## What the StackBlitz preview includes

- Resident experience and My Story interface
- Regional resource guide
- Multilingual entry experience
- Provider, network, governance, assurance, and administrator interface workspaces
- Client-side navigation and responsive styling
- Browser-safe demonstration data and interactions

## Hosted capabilities

The following capabilities are retained only in the complete production source and should not be represented as operational in the StackBlitz browser preview:

- Sign in with ChatGPT identity headers
- Production Cloudflare D1 participant records
- Production R2 private document storage
- Production consent and audit records
- Provider document access to production data
- Sites access policies and production deployments

Do not place passwords, API keys, authentication cookies, Social Security numbers, or production database credentials in StackBlitz files or environment variables.

## Validation commands

```bash
npm run lint
npm test
```

The production build command is:

```bash
npm run build
```

## Main project locations

- `app/` — pages, workspaces, API routes, and styles
- `app/resource-guide.tsx` — regional resource directory
- `app/language-access.tsx` — multilingual accessibility layer
- `db/` — Drizzle/D1 schema and database adapter
- `drizzle/` — database migrations
- `public/` — browser assets
- `lib/` — authorization and action-artifact logic
- `worker/` — Cloudflare worker entrypoint
- `.openai/hosting.json` — production binding declaration

## Safe editing workflow

1. Make one focused change.
2. Run `npm run lint`.
3. Run `npm test`.
4. Review the preview at desktop and mobile widths.
5. Never copy production credentials into the project.
6. Deploy production changes only through NeighborWell's authorized Sites workflow.
