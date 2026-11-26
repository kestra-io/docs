export const MAX_RESULTS = 50

export const PLUGIN_PACKAGE = "io.kestra.plugin."

export const searchTokens = (query: string) =>
    query
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map((token) => token.replace(PLUGIN_PACKAGE, ""))
        .filter(Boolean)

export const includesAll = (text: string | undefined, tokens: string[]) => {
    const value = text?.toLowerCase() ?? ""
    return tokens.every((token) => value.includes(token))
}
