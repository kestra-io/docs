import { pluginCollapsible } from "expressive-code-collapsible"
import kestraDark from "@kestra-io/plumage/shiki/kestra-dark"
import kestraLight from "@kestra-io/plumage/shiki/kestra-light"
import { yamlKeysInjection } from "@kestra-io/plumage"
import { pluginPebble } from "@kestra-io/plumage/expressive-code"

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
export default {
    themes: [kestraDark, kestraLight],
    shiki: {
        langs: [yamlKeysInjection],
    },
    plugins: [
        pluginPebble(),
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

