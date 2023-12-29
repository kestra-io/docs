export default defineEventHandler(async (event) => {
    const cls = getRouterParam(event, 'cls.svg').substring(0, getRouterParam(event, 'cls.svg').lastIndexOf("."));
    const response = await $fetch(`https://api.kestra.io/v1/plugins/icons/${cls}`)

    event.node.res.setHeader('content-type', response.type)
    event.node.res.setHeader('cache-control', "max-age=86400;")

    event.node.res.end(await response.text())
})