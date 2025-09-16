import {visit} from 'unist-util-visit'
import generateId from './generateId'
import * as fs from 'node:fs'
import * as path from 'node:path'

const extractMetadataFromMarkdown = (markdown) => {
    const charactersBetweenGroupedHyphens = /^---([\s\S]*?)---/;
    const metadataMatched = markdown.match(charactersBetweenGroupedHyphens);
    const metadata = metadataMatched[1];

    if (!metadata) {
        return {};
    }

    const metadataLines = metadata.split("\n");
    const metadataObject = metadataLines.reduce((accumulator, line) => {
        const [key, ...value] = line.split(":").map((part) => part.trim());

        if (key)
        accumulator[key] = value[1] ? value.join(":") : value.join("");
        return accumulator;
    }, {});

    return metadataObject;
};

export default function() {
    return function(tree, file) {
        visit(tree, function (node) {
            if (
                node.type == 'containerDirective' ||
                node.type == 'leafDirective' ||
                node.type === 'textDirective'
            ) {
                if (!['alert', 'collapse', 'ChildCard'].includes(node.name)) return
                const data = node.data || (node.data = {})
                const attributes = node.attributes || {}

                switch (node.name) {
                    case 'alert':
                        const type = attributes.type ?? "info"
                        data.hName = 'div'
                        data.hProperties = {
                            class: `doc-alert alert alert-${type}`,
                            role: "alert",
                        }
                        break
                    case 'collapse':
                        data.hName = 'details'
                        const summaryText = attributes.title ?? "Details"
                        data.hProperties = {class: 'doc-collapse'}
                        node.children = [
                            {
                                type: 'summary',
                                data:{
                                    hName: 'summary',
                                    hProperties: {}
                                },
                                children: [{type: 'text', value: summaryText}]
                            },
                            ...(node.children ?? [])
                        ]
                        break
                    case 'ChildCard':
                        const directory = path.dirname(file.history[0])
                        const files = fs.readdirSync(directory).filter(f => (f.endsWith('.md') || f.endsWith('.mdx')) && f !== path.basename(file.history[0]))
                        const richFiles = files.map(f => ({
                            entry: f,
                            data: extractMetadataFromMarkdown(fs.readFileSync(path.join(directory, f), 'utf-8'))
                        }))
                        const currentDir = path.basename(directory)
                        data.hName = 'div'
                        data.hProperties = {class: 'child-cards-wrapper'}
                        node.children = richFiles.map(file => ({
                            type: 'anchor',
                            data: {
                                hName: 'a',
                                hProperties: {
                                    class: 'child-card-link card',
                                    href: generateId(`./${currentDir}/${file.entry}`)
                                }
                            },
                            children: [
                                {
                                    type: 'element',
                                    data: {
                                        hName: 'h4',
                                        hProperties: {
                                            class: 'card-title',
                                        },

                                    },
                                    children: [
                                        {
                                            type: 'text',
                                            value: file.data.title ?? file.entry.replace(/\.mdx?$/, '')
                                        }
                                    ]
                                },
                                {
                                    type: 'element',
                                    data: {
                                        hName: 'p',
                                        hProperties: {
                                            class: 'card-text',
                                        },

                                    },
                                    children: [
                                        {
                                            type: 'text',
                                            value: file.data.description ?? ''
                                        }
                                    ]
                                }
                            ]
                        }))
                        break
                }
            }
        })
    }
}