import { CountTo } from "vue3-count-to";


export default defineNuxtPlugin((nuxtApp) =>
    nuxtApp.vueApp.component("CountTo", CountTo)
)