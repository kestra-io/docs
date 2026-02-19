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
        }).data
    }