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
                    // avoid height and width attributes because scaling is handled via CSS
                    name: "removeDimensions",
                },
                {
                    // when using <svg> elements as icons, we want to ensure that IDs are unique
                    // to prevent conflicts when multiple icons are used on the same page
                    // ids are used for gradients and clip paths, so we can't remove them entirely
                    name: "prefixIds",
                    params: {
                        prefix: () => prefix,
                    }
                }
            ]
        // replace self closing tags with explicit closing tags to ensure
        // compatibility with svg coming out of Figma
        // contents of <foreignObject> in particular cannot be self closing
        }).data.replace(/<(\w+)([^>]*)\/>/g, "<$1$2></$1>")
    }