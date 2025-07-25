export default defineNuxtRouteMiddleware((to) => {
    const match = to.path.match(/[A-Z]/);
    if (match) {
        return navigateTo(to.fullPath.replace(to.path, to.path.toLocaleLowerCase()), {redirectCode: 301})
    }

    if (to.path !== "/" && to.path.endsWith("/") && useRequestURL().hostname !== "localhost") {
        return navigateTo(to.path.substring(0, to.path.length - 1), {redirectCode: 301});
    }
})