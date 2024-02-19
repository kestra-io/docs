export default defineNuxtRouteMiddleware((to, from) => {
    const match = to.path.match(/[A-Z]/);
    if (match) {
        return navigateTo(to.fullPath.replace(to.path, to.path.toLocaleLowerCase()), {redirectCode: 301})
    }
})