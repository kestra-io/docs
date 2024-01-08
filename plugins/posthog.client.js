import posthog from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('page:finish', () => {
        posthog.capture('$pageview');
    })
});