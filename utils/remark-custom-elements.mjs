import {visit} from 'unist-util-visit'

export default function() {
    return function(tree, file) {
        visit(tree, function (node) {
            if (
                node.type == 'containerDirective' ||
                node.type == 'leafDirective' ||
                node.type === 'textDirective'
            ) {
                if (node.name !== 'alert') return
                const data = node.data || (node.data = {})
                const attributes = node.attributes || {}

                switch (node.name) {
                    case 'alert':
                        const type = attributes.type ?? "info"
                        data.hName = 'div'
                        data.hProperties = {
                            class: `doc-alert alert-${type}`,
                        }
                        break
                }
            }
        })
    }
}