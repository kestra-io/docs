import { pluginCollapsible } from "expressive-code-collapsible"

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
export default {
    themes: ["github-dark-default", "github-light-default"],
    plugins: [
        pluginCollapsible({
            lineThreshold: 25,
            previewLines: 20,
            expandButtonText: "See all lines",
            collapseButtonText: "Collapse",
        }),
    ],
    themeCssSelector: (theme) => {
        if (theme.type === "dark") return ".dark"
        if (theme.type === "light") return ".light"
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

