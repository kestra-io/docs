import mermaid from "mermaid/dist/mermaid"

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('mermaid', () => mermaid)
})