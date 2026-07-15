# Ask-AI PoC — agentic retrieval via Kestra MCP (`ask-v2.ts`)

Proof of concept for the "incomplete answers" problem in production Ask-AI
(api.kestra.io `/v1/search-ai`). Production is **single-shot RAG**: one vector
lookup, top-3 chunks, answer only from those — so topics spread across many pages
come back half-answered (task runners: 1–3 of 7), and enumerations that live in
plugin metadata (secret managers, storages, triggers) are missed entirely.

This endpoint uses the **same model** (`gemini-2.5-flash`) but lets the model
drive retrieval through the **public Kestra MCP** (`https://api.kestra.io/v1/mcp`)
as tools — the same tools Claude/Cursor use:

- `search_docs` / `get_doc` — find and read **whole** doc pages (fixes half-answers)
- `list_task_runners` / `list_secret_managers` / `list_storages` / `list_triggers`
  / `list_log_exporters` / `list_plugins` — **authoritative enumerations** from
  plugin metadata, so "list all X" can't undercount
- `blueprints` / `get_blueprint_flow` — real example flows
- `plugin_tasks` / `task_schema` — task properties

The loop (`ask-v2.ts`): connect to the MCP once per process → `listTools()` →
convert each to a Gemini function declaration → stream `generateContentStream`,
forwarding assistant text; when the model calls a tool, dispatch it via
`client.callTool()` and feed the result back; repeat until it answers.

**Same model as production** → any improvement is the retrieval architecture, not
a smarter model.

## What it is / isn't
- **Is:** a real agentic loop over Kestra's own MCP tools; can't miss enumerable
  lists (uses the authoritative `list_*` tools) and reads whole pages.
- **Isn't:** production. Production would port this loop into api.kestra.io next to
  the `/search-ai` endpoint. This PoC calls the public MCP over the network.

## Run it locally
> ⚠️ Requires **Node ≥ 26** (repo `engines`). Use `node@26`, e.g.
> `brew install node@26 && export PATH="/opt/homebrew/opt/node@26/bin:$PATH"`.

1. `export`/`.env`: `GEMINI_API_KEY=...` (endpoint 503s without it; `.env` is gitignored).
2. `npm install` (adds `@google/genai`, `@modelcontextprotocol/sdk`).
3. `npm run dev`.
4. Open the standalone try-it page: **http://localhost:4321/ask-poc**
   (or point AiChatDialog.vue's fetch at `/api/ask-v2` to use the real widget UI).

## Quick curl
```bash
curl -N http://localhost:4321/api/ask-v2 \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"list all secret managers Kestra supports"}]}'
```
Expected: all 11 secret managers (AWS, SSM, Delinea, 1Password, Google, Azure,
CyberArk, Bitwarden, Vault, Doppler, BeyondTrust) — vs production's "1".

## Knobs (`ask-v2.ts`)
- `MODEL` — `gemini-2.5-flash` (match production).
- `MAX_TURNS` — agentic-loop guard (default 12).
- `KESTRA_MCP_URL` — the public MCP endpoint.
- Tools are whatever the MCP advertises via `listTools()` — no hardcoded list.

## Notes / known PoC edges
- The verbose `catch` streams the raw error to the client to speed debugging —
  revert to a generic message before any non-PoC use.
- MCP session is cached per server process; on a connection error it resets and
  retries on the next request.
