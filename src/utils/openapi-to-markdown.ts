import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown"
import fs from "node:fs"
import path from "node:path"

export async function generateApiMarkdown(specFilename: string): Promise<string> {
    const specPath = path.resolve("public", specFilename)
    const specContent = fs.readFileSync(specPath, "utf-8")
    return createMarkdownFromOpenApi(specContent)
}
