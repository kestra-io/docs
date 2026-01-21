import { visit } from 'unist-util-visit';

export default function imgPlugin() {
    return (tree) => {
        visit(tree, 'element', (node) => {
            if (node.tagName === 'img') {
                node.properties.className = ['zoom'];
            }
        });
    };
}