import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown"
import fs from "node:fs"
import path from "node:path"
import yaml from "js-yaml"

export async function generateApiMarkdown(specFilename: string): Promise<string> {
    const specPath = path.resolve("public", specFilename)
    const specContent = fs.readFileSync(specPath, "utf-8")
    const spec = yaml.load(specContent)
    return createMarkdownFromOpenApi(spec as Record<string, unknown>)
}
