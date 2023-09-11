export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('page:finish', () => {
        const route = useRoute()

        let _hsq = window._hsq = window._hsq || [];
        _hsq.push(['setPath', route.path]);
        _hsq.push(['trackPageView']);

        if (window?.HubSpotConversations?.widget) {
            window.HubSpotConversations.widget.refresh()
        }
    })
});