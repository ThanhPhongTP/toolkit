# Dev Toolkit

A personal, client-side collection of developer utilities (JSON formatting, Base64/URL/JWT tools,
CSV/YAML/Markdown converters, cron explainer, HTTP status reference, a curl generator/parser, a
browser-based API tester, and a webhook payload inspector). No backend, no login — everything runs
in the browser and any saved state (favorites, recent tools, API history, theme) lives in
`localStorage`.

## Running

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run test      # run unit tests (Vitest) for the logic in src/lib
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build locally
npm run lint      # oxlint
```

## Project structure

- `src/lib/**` — pure, framework-free logic for each tool (parsing, formatting, hashing, etc.),
  each with a colocated `*.test.ts`. This is where almost all the actual logic lives.
- `src/tools/<tool-id>/` — the React UI for each tool, built from the shared components in
  `src/components/`.
- `src/tools/registry.ts` — the single source of truth for every tool: its route, sidebar entry,
  search keywords, and icon.
- `src/layout/`, `src/pages/` — the app shell (sidebar, top bar, theme toggle) and the Home/ToolPage/
  NotFound routes.
- `src/hooks/` — shared hooks (`useLocalStorage`, `useTheme`, `useFavorites`, `useRecentTools`, ...).

## Adding a new tool

1. Add the pure logic under `src/lib/<name>/<name>.ts` (+ `<name>.test.ts`).
2. Create `src/tools/<tool-id>/<ToolName>.tsx` using the shared `TwoColumnLayout`/`Panel`/
   `TextAreaField`/`ErrorBanner`/`CopyButton` components as needed.
3. Add one entry to the `TOOLS` array in `src/tools/registry.ts` (id, title, description, category,
   keywords, icon, and a `lazy()` import of the component). The sidebar, search, home page, and
   router all pick it up automatically — nothing else to wire up.
