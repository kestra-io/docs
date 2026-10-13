import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import path from "node:path"

const cwd = process.cwd()

// Astro resolves a bare .svg import to an image object; plain Vite gives a URL
// string, which `v-bind` would then spread character by character.
// Astro's virtual modules have no plain-Vite equivalent; the harness only
// needs them to resolve, not to work.
const astroVirtualStub = {
    name: "astro-virtual-stub",
    enforce: "pre",
    resolveId(id) {
        if (id.startsWith("astro:")) return "\0astro-virtual:" + id
        return null
    },
    load(id) {
        if (!id.startsWith("\0astro-virtual:")) return null
        return `export const API_URL = "https://api.kestra.io"
export const KESTRA_API_URL = API_URL
export const getSecret = () => undefined
export default {}`
    },
}

const astroImageStub = {
    name: "astro-image-stub",
    enforce: "pre",
    resolveId(id) {
        if (id.endsWith(".svg") && !id.includes("?")) return "\0astro-image-stub"
        return null
    },
    load(id) {
        if (id === "\0astro-image-stub") {
            return `export default { src: "/stub.svg", width: 30, height: 30, format: "svg" }`
        }
        return null
    },
}

export default defineConfig({
    plugins: [astroVirtualStub, astroImageStub, vue()],
    resolve: { alias: { "~": path.resolve(cwd, "src") } },
    build: {
        // Under node_modules so `astro check` does not walk the bundle.
        outDir: "node_modules/.harness",
        emptyOutDir: true,
        rollupOptions: { input: path.resolve(cwd, "harness/index.html") },
    },
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ["color-functions", "global-builtin", "import", "mixed-decls"],
                quietDeps: true,
                additionalData: `@use "/src/assets/styles/variable" as *;`,
                loadPaths: [cwd, path.resolve(cwd, "node_modules")],
            },
        },
    },
})
