export const escapeHtml = (text: string) =>
    text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

const KEYWORDS = /\b(def|return|import|from|with|as|None)\b/

export const python = (line: string, calls: readonly string[] = []) => {
    const pattern = new RegExp(
        `("[^"]*")|(@\\w+(?:\\(\\))?)|${KEYWORDS.source}${calls.length ? `|\\b(${calls.join("|")})\\b` : ""}`,
        "g",
    )
    return escapeHtml(line).replace(pattern, (match, str, deco, kw, fn) =>
        str
            ? `<span class="s">${match}</span>`
            : deco
              ? `<span class="d">${match}</span>`
              : kw
                ? `<span class="k">${match}</span>`
                : fn
                  ? `<span class="f">${match}</span>`
                  : match,
    )
}

export const pebble = (value: string) =>
    escapeHtml(value).replace(
        /(\{\{)(.*?)(\}\})/g,
        '<span class="pbd">$1</span><span class="pbv">$2</span><span class="pbd">$3</span>',
    )

export const flowLines = (
    flow: string,
    script: (line: string) => string,
    markAt: (row: number) => string | undefined = () => undefined,
) => {
    let block = -1
    return flow.split("\n").map((text, i) => {
        const indent = text.match(/^\s*/)?.[0].length ?? 0
        if (block >= 0 && text.trim() !== "" && indent <= block) block = -1
        let html: string
        if (block >= 0) html = script(text)
        else {
            const m = text.match(/^(\s*)(- )?([\w.]+)(:)(\s*)(.*)$/)
            if (!m) html = escapeHtml(text)
            else {
                const [, ind, dash = "", key, colon, space, value] = m
                if (value.trim() === "|") block = indent
                const cls = /^["']/.test(value) ? "s" : "v"
                html = `${ind}<span class="p">${dash}</span><span class="y">${key}${colon}</span>${space}<span class="${cls}">${pebble(value)}</span>`
            }
        }
        return { html, mark: markAt(i + 1) }
    })
}

export const yamlLine = (line: string) => {
    const m = line.match(/^(\s*)(- )?([\w.]+)(:)(.*)$/)
    if (!m) return escapeHtml(line)
    const [, ind, dash = "", key, colon, rest] = m
    const hash = rest.indexOf(" #")
    const value = hash >= 0 ? rest.slice(0, hash) : rest
    const comment = hash >= 0 ? rest.slice(hash) : ""
    return `${ind}${dash}<span class="k">${key}${colon}</span><span class="v">${escapeHtml(value)}</span>${comment ? `<span class="c">${escapeHtml(comment)}</span>` : ""}`
}

const SOURCE_KEYWORDS: Record<string, readonly string[]> = {
    javascript: ["export", "default", "async", "await", "const", "let", "var", "return", "for", "of", "in", "if", "else", "function", "import", "from", "new", "throw", "try", "catch"],
    python: ["def", "return", "import", "from", "with", "as", "None", "True", "False", "for", "in", "if", "elif", "else", "class", "async", "await", "try", "except", "raise"],
    go: ["package", "import", "func", "return", "for", "range", "if", "else", "var", "nil", "defer", "go", "type", "struct"],
    java: ["public", "private", "class", "static", "void", "return", "new", "if", "else", "for", "import", "package", "final", "throws"],
    ruby: ["def", "end", "do", "if", "else", "return", "require", "class", "module", "nil"],
    sh: ["if", "then", "fi", "for", "do", "done", "export", "echo"],
}

const LINE_COMMENT: Record<string, string> = {
    javascript: "//",
    go: "//",
    java: "//",
    python: "#",
    ruby: "#",
    sh: "#",
}

const commentAt = (line: string, marker?: string) => {
    if (!marker) return -1
    let quote = ""
    for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (quote) {
            if (char === quote) quote = ""
        } else if (char === '"' || char === "'" || char === "`") quote = char
        else if (line.startsWith(marker, i)) return i
    }
    return -1
}

export const source = (line: string, lang: string) => {
    const words = SOURCE_KEYWORDS[lang] ?? []
    const at = commentAt(line, LINE_COMMENT[lang])
    const body = at >= 0 ? line.slice(0, at) : line
    const comment = at >= 0 ? line.slice(at) : ""
    const pattern = new RegExp(
        `("[^"]*"|'[^']*'|\`[^\`]*\`)${words.length ? `|\\b(${words.join("|")})\\b` : ""}|(\\b[A-Za-z_]\\w*)(?=\\()`,
        "g",
    )
    const html = escapeHtml(body).replace(pattern, (match, str, kw, fn) =>
        str
            ? `<span class="s">${match}</span>`
            : kw
              ? `<span class="k">${match}</span>`
              : fn
                ? `<span class="f">${match}</span>`
                : match,
    )
    return comment ? `${html}<span class="c">${escapeHtml(comment)}</span>` : html
}
