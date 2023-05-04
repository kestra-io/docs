export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('page:finish', () => {
        if (window?.HubSpotConversations?.widget) {
            window.HubSpotConversations.widget.refresh()
        }
    })
});