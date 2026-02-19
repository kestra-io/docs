import { optimize } from "svgo"

export function optimizeSvgIcon(svgInput: string, prefix: string) {


    return optimize(svgInput, {
            plugins: [
                "preset-default",
                {
                    name: "removeUnknownsAndDefaults",
                    params: {
                        keepDataAttrs: false,
                    },
                },
                {
                    name: "removeDimensions",
                },
                {
                    name: "prefixIds",
                    params: {
                        prefix: () => prefix,
                    }
                }
            ]
        // replace self closing tags with explicit closing tags to ensure compatibility with all browsers
        }).data.replace(/<(\w+)([^>]*)\/>/g, "<$1$2></$1>")
    }