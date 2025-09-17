import {visit} from 'unist-util-visit'
import { alert } from './alert.mjs';
import { collapse } from './collapse.mjs';
import { ChildCard } from './ChildCard.mjs';



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
                        alert(data, attributes)
                        break
                    case 'collapse':
                        collapse(data, attributes, node)
                        break
                    case 'ChildCard':
                        ChildCard(data, attributes, node, file)
                        break
                }
            }
        })
    }
}