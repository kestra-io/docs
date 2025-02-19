import posthog from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
    if (useRuntimeConfig().public.posthog.enabled) {
        nuxtApp.hook('page:finish', () => {
            posthog.capture('$pageview');
        })
    }
});