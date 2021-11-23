module.exports = (options, ctx) => {
    const { themeConfig, siteConfig } = ctx
    const enableSmoothScroll = themeConfig.smoothScroll === true

    return {
        plugins: [
            ['container', {
                type: 'success',
                defaultTitle: {
                    '/': 'TIP',
                }
            }],
            ['container', {
                type: 'warning',
                defaultTitle: {
                    '/': 'WARNING',
                }
            }],
            ['container', {
                type: 'danger',
                defaultTitle: {
                    '/': 'WARNING',
                }
            }],
            ['container', {
                type: 'details',
                before: info => `<details class="custom-block details">${info ? `<summary>${info}</summary>` : ''}\n`,
                after: () => '</details>\n'
            }],
            ['smooth-scroll', enableSmoothScroll]
        ]
    }
}