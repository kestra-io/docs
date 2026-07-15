/**
 * PoC: agentic "Ask Kestra AI" endpoint (Gemini + Kestra MCP).
 *
 * WHY THIS EXISTS
 * ---------------
 * Production Ask-AI (api.kestra.io `/v1/search-ai`) is single-shot RAG: ONE
 * embedding lookup, top-3 chunks, answer only from those. Topics spread across
 * many pages come back half-answered ("how many task runners?" → 1-3 of 7), and
 * enumerations that live in plugin metadata (secret managers, storages, triggers)
 * are missed entirely because they aren't in the retrieved chunks.
 *
 * This endpoint proves the alternative: same model as production
 * (gemini-2.5-flash), but the model drives retrieval through the PUBLIC KESTRA
 * MCP (https://api.kestra.io/v1/mcp) as tools — the exact tools Claude/Cursor/etc.
 * use. That gives it:
 *   - search_docs / get_doc            → read whole doc pages (fixes half-answers)
 *   - list_task_runners / list_secret_managers / list_storages / list_triggers /
 *     list_log_exporters / list_plugins → AUTHORITATIVE enumerations from plugin
 *     metadata (so "list all X" can never undercount)
 *   - blueprints / get_blueprint_flow  → real example flows
 *   - plugin_tasks / task_schema       → task properties
 *
 * The model searches, judges, searches again, reads whole pages / calls the right
 * list_* tool, then answers. Same model as production, so any improvement is the
 * retrieval architecture, not a stronger model.
 *
 * SCOPE: PoC only. WIRING: point AiChatDialog.vue's fetch at `/api/ask-v2`, or
 * open /ask-poc. SSE contract matches the widget (`id: "response"` {response},
 * then `id: "completed"`).
 */
import type { APIRoute } from "astro"
import { GEMINI_API_KEY } from "astro:env/server"
import {
    GoogleGenAI,
    Type,
    type Content,
    type Part,
    type FunctionDeclaration,
    type Schema,
} from "@google/genai"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js"

export const prerender = false

const MODEL = "gemini-2.5-flash" // match production Ask-AI
const KESTRA_MCP_URL = "https://api.kestra.io/v1/mcp"
const MAX_TURNS = 12 // agentic-loop guard

// ── Kestra MCP client (one session per server process) ───────────────────────

let mcpClientPromise: Promise<Client> | null = null

function getMcpClient(): Promise<Client> {
    if (!mcpClientPromise) {
        mcpClientPromise = (async () => {
            const client = new Client(
                { name: "ask-kestra-ai-poc", version: "0.1.0" },
                { capabilities: {} },
            )
            await client.connect(new StreamableHTTPClientTransport(new URL(KESTRA_MCP_URL)))
            return client
        })().catch((err) => {
            mcpClientPromise = null // allow retry on next request
            throw err
        })
    }
    return mcpClientPromise
}

// ── MCP tool schema → Gemini function declarations ───────────────────────────

const JSON_TYPE_TO_GEMINI: Record<string, Type> = {
    string: Type.STRING,
    number: Type.NUMBER,
    integer: Type.INTEGER,
    boolean: Type.BOOLEAN,
    array: Type.ARRAY,
    object: Type.OBJECT,
}

// Convert a (simple) JSON Schema — as returned by MCP tools — into the Gemini
// Schema shape. Covers the shapes the Kestra MCP actually uses (objects of
// scalars/arrays); good enough for the PoC.
function toGeminiSchema(js: any): Schema {
    const rawType = Array.isArray(js?.type)
        ? js.type.find((t: string) => t !== "null")
        : js?.type
    const type = JSON_TYPE_TO_GEMINI[rawType] ?? Type.OBJECT
    const out: Schema = { type }
    if (js?.description) out.description = js.description
    if (Array.isArray(js?.enum)) out.enum = js.enum
    if (type === Type.OBJECT) {
        out.properties = {}
        for (const [key, value] of Object.entries(js?.properties ?? {})) {
            out.properties[key] = toGeminiSchema(value)
        }
        if (Array.isArray(js?.required)) out.required = js.required
    }
    if (type === Type.ARRAY) {
        out.items = toGeminiSchema(js?.items ?? { type: "string" })
    }
    return out
}

let declarationsCache: FunctionDeclaration[] | null = null

async function getFunctionDeclarations(client: Client): Promise<FunctionDeclaration[]> {
    if (declarationsCache) return declarationsCache
    const { tools } = await client.listTools()
    declarationsCache = tools.map((tool) => {
        const schema = tool.inputSchema as any
        const hasParams =
            schema?.type === "object" && Object.keys(schema.properties ?? {}).length > 0
        const decl: FunctionDeclaration = {
            name: tool.name,
            description: tool.description ?? "",
        }
        // Gemini rejects an empty parameters object — omit params for no-arg tools.
        if (hasParams) decl.parameters = toGeminiSchema(schema)
        return decl
    })
    return declarationsCache
}

async function callMcpTool(
    client: Client,
    name: string,
    args: Record<string, unknown>,
): Promise<Record<string, unknown>> {
    try {
        const result = await client.callTool({ name, arguments: args })
        const content = (result.content ?? []) as Array<{ type: string; text?: string }>
        const text = content
            .filter((c) => c.type === "text" && c.text)
            .map((c) => c.text)
            .join("\n")
        if (result.isError) return { error: text || "tool error" }
        return { output: text || JSON.stringify(content) }
    } catch (err) {
        return { error: err instanceof Error ? err.message : String(err) }
    }
}

const SYSTEM_PROMPT = `You are the Kestra documentation assistant, embedded on kestra.io/docs.

You answer questions about Kestra using the provided Kestra tools. You are an agent: call tools, judge whether the results are complete, call more tools if not, and only then answer.

Which tool to use:
- **"How many / list all X"** (task runners, secret managers, storages, triggers, log exporters, plugins): ALWAYS call the matching list tool (list_task_runners, list_secret_managers, list_storages, list_triggers, list_log_exporters, list_plugins). These return the authoritative, complete set from Kestra's plugin metadata — never answer these from memory or from a single doc page, and never guess.
- **Concepts, configuration, how-things-work**: use search_docs to find pages, then get_doc to read the FULL page before answering. If one search seems incomplete, search again with different terms.
- **"How do I configure / use / set up <specific plugin, secret manager, task runner, or task>"**: first identify it with the matching list tool to get its fully-qualified class name (FQCN), then call task_schema on that FQCN to get its exact configuration properties. Also read the relevant overview/config page (e.g. the secret-backends / external secrets manager page) with get_doc — these category pages document MANY items even when their title names only a few (e.g. an "External Secrets Manager (AWS, Azure, GCP)" page also covers Doppler, Vault, etc.).
- **"How do I build / example of X"**: search blueprints, and use get_blueprint_flow to show a real flow.

Rules:
- Be diligent before giving up. NEVER say "I couldn't find a page for X" or "there's no specific documentation" until you have actually opened the most relevant candidate pages with get_doc — including any overview/index/category page that appeared in search results. If a search result looks even plausibly relevant, read it before concluding. When a topic is one item in a category (a specific secret manager, task runner, etc.), the answer is almost always on the category's shared page or in its plugin schema — go read those rather than hedging.
- Ground every claim in tool output. Never assert a feature does NOT exist because one search missed it; call a list tool, read the category page, or search again.
- When you cite a documentation page, link it in markdown using the page URL the tools return, with the page title as the link text.
- Format answers as clean markdown: headings, lists, tables for property lists, fenced code blocks for YAML. Be direct, no filler preamble.`

// ── SSE helpers (contract matches AiChatDialog.vue) ──────────────────────────

function sseFrame(id: string, data: unknown): string {
    return `id: ${id}\ndata: ${JSON.stringify(data)}\n\n`
}

interface IncomingMessage {
    role: "user" | "assistant" | "system"
    content: string
}

export const POST: APIRoute = async ({ request }) => {
    if (!GEMINI_API_KEY) {
        return new Response(
            JSON.stringify({ error: "GEMINI_API_KEY not set; PoC endpoint disabled." }),
            { status: 503, headers: { "Content-Type": "application/json" } },
        )
    }

    let incoming: IncomingMessage[]
    try {
        const body = await request.json()
        incoming = Array.isArray(body?.messages) ? body.messages : []
    } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        })
    }

    const contents: Content[] = incoming
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
        }))

    if (!contents.length || contents[contents.length - 1].role !== "user") {
        return new Response(JSON.stringify({ error: "Last message must be from the user." }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        })
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })
    const encoder = new TextEncoder()

    const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
            const send = (id: string, data: unknown) =>
                controller.enqueue(encoder.encode(sseFrame(id, data)))

            try {
                const mcp = await getMcpClient()
                const functionDeclarations = await getFunctionDeclarations(mcp)
                const config = {
                    systemInstruction: SYSTEM_PROMPT,
                    tools: [{ functionDeclarations }],
                }

                for (let turn = 0; turn < MAX_TURNS; turn++) {
                    const result = await ai.models.generateContentStream({
                        model: MODEL,
                        contents,
                        config,
                    })

                    let textThisTurn = ""
                    const calls: { name?: string; args?: Record<string, unknown>; id?: string }[] = []

                    for await (const chunk of result) {
                        const text = chunk.text
                        if (text) {
                            textThisTurn += text
                            send("response", { response: text })
                        }
                        if (chunk.functionCalls?.length) calls.push(...chunk.functionCalls)
                    }

                    if (calls.length === 0) break // final answer streamed

                    const modelParts: Part[] = []
                    if (textThisTurn) modelParts.push({ text: textThisTurn })
                    for (const c of calls) modelParts.push({ functionCall: c })
                    contents.push({ role: "model", parts: modelParts })

                    const responseParts: Part[] = []
                    for (const c of calls) {
                        const output = await callMcpTool(mcp, c.name ?? "", c.args ?? {})
                        responseParts.push({
                            functionResponse: { id: c.id, name: c.name, response: output },
                        })
                    }
                    contents.push({ role: "user", parts: responseParts })
                }

                send("completed", {})
                controller.close()
            } catch (err) {
                console.error("ask-v2 error:", err)
                // PoC: surface the real error to the client to speed debugging.
                // (Revert to a generic message before any non-PoC use.)
                const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
                send("response", {
                    response: `\n\n_Sorry — something went wrong._\n\n\`\`\`\n${detail}\n\`\`\`\n`,
                })
                send("completed", {})
                controller.close()
            }
        },
    })

    return new Response(stream, {
        status: 200,
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    })
}
