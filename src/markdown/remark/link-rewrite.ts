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
    // Visit and transform all link nodes synchronously to avoid async mutation issues
    visit(tree, 'link', (node: any) => {
      node.url = replacer(node.url, file);
    });
    return tree;
  };
}

export default RemarkLinkRewrite;