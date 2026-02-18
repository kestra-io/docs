/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
export default {
    themes: ['dracula-soft', 'light-plus'],
    themeCssSelector: (theme) => {
        if (theme.type === 'dark') return '.dark'
        if (theme.type === 'light') return '.light'
        return false
    },
    defaultProps: {
        wrap: true,
        overridesByLang: {
            "bash,sh,zsh,shell,twig,powershell,yaml,python": {
                frame: "none",
            },
        },
    },
    useDarkModeMediaQuery: false,
}
