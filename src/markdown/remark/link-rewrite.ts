import { visit,  } from 'unist-util-visit';
import { type Plugin } from 'unified';

/**
 * @type {Plugin}
 */
const RemarkLinkRewrite: Plugin<{replacer:(url: string, file: {
    basename?: string
    dirname?: string
}) => string }[]> = (options) => {
  const { replacer } = options;
  return async (tree, file) => {
    const nodes:any[] = [];

    visit(tree, node => {
      if (node.type === 'link') {
        nodes.push(node);
      }
    });

    nodes.map(async node => {
      if (node.type === 'link') {
        node.url = replacer(node.url, file);
      }
    });
    return tree;
  };
}

export default RemarkLinkRewrite;