import {visit} from 'unist-util-visit'

export default function() {
    return function(tree, file) {
        visit(tree, function (node) {
            if (
                node.type == 'containerDirective' ||
                node.type == 'leafDirective' ||
                node.type === 'textDirective'
            ) {
                if (!['alert', 'collapse'].includes(node.name)) return
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
                }
            }
        })
    }
}