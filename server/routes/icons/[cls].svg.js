export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const cls = getRouterParam(event, 'cls.svg').substring(0, getRouterParam(event, 'cls.svg').lastIndexOf("."));
    const response = await $fetch(`${config.public.apiUrl}/plugins/icons/${cls}`)

    event.node.res.setHeader('content-type', response.type)
    event.node.res.setHeader('cache-control', "max-age=86400")

    const byte = (await response.text()).replaceAll("currentColor", "#CAC5DA")

    event.node.res.end(byte)
})