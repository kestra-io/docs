import {createMarkdownParser, createShikiHighlighter, rehypeHighlight,} from '@nuxtjs/mdc-edge/runtime'

import githubDark from 'shiki/themes/github-dark.mjs'
import MdcLang from 'shiki/langs/mdc.mjs'
import YamlLang from 'shiki/langs/yaml.mjs'
import Python from 'shiki/langs/python.mjs'
import Sql from 'shiki/langs/sql.mjs'
import Bash from 'shiki/langs/bash.mjs'

export default function useMarkdownParser() {
    let parser;

    return async (markdown) => {
        if (!parser) {
            parser = await createMarkdownParser({
                rehype: {
                    plugins: {
                        highlight: {
                            instance: rehypeHighlight,
                            options: {
                                theme: 'github-dark',
                                highlighter: createShikiHighlighter({
                                    bundledThemes: {
                                        'github-dark': githubDark,
                                    },
                                    bundledLangs: {
                                        mdc: MdcLang,
                                        yaml: YamlLang,
                                        python: Python,
                                        bash: Bash,
                                        sql: Sql,
                                    },
                                }),
                            },
                        },
                    },
                },
            })
        }
        return parser(markdown)
    }
}