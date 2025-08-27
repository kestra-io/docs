/**
 * With this composable, we can use the shiki syntax highlighter
 * fully on the client side.
 * This allows for a lighter server side rendering and faster page loads.
 * Plus as a bonus, we can use the site in cloudflare pages since the BE bundle is now smaller.
 */
import {ref} from "vue";
import { createHighlighter, type HighlighterGeneric } from 'shiki'
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
const langs = ['bash',
    'c',
    'cpp',
    'csv',
    'css',
    'dockerfile',
    'go',
    'groovy',
    'handlebars',
    'hcl',
    'ini',
    'java',
    'javascript',
    'json',
    'log',
    'markdown',
    'mermaid',
    'perl',
    'php',
    'python',
    'r',
    'ruby',
    'rust',
    'scala',
    'sql',
    'systemd',
    'twig',
    'typescript',
    'powershell',
    'xml',
    'yaml'] as const
let shiki: Promise<HighlighterGeneric<(typeof langs)[number], 'github-dark'>> | null = null

export function getShiki() {
    if(!shiki){
        shiki = createHighlighter({
            themes: ['github-dark'],
            langs: [...langs],
            engine: createOnigurumaEngine(import('shiki/wasm'))
        })
    }
    return shiki
}

export default function useShiki() {
    const shiki = ref<ReturnType<typeof getShiki>>()

    async function highlightCodeBlocks(root: HTMLElement = document.body) {
        return new Promise<void>(resolve => nextTick(() => requestAnimationFrame(async () => {
            const blocks = root.querySelectorAll('pre > code')
            for(const block of blocks) {
                const preClassList = block.parentElement?.classList;
                // avoid rendering already highlighted code
                if(!preClassList || preClassList.contains('shiki')) continue
                // check is there is a language class and extract it
                const languageClass = Array.from(preClassList).find((c) => c.startsWith('language-'))
                if(languageClass) {
                    const originalCode = block.innerHTML.replace(/\n$/, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
                    const shikiValue = await shiki.value
                    const html = shikiValue?.codeToHtml(originalCode, {
                        lang: languageClass.replace('language-', ''),
                        theme: 'github-dark'
                    })
                    if(!html) {
                        if(!shikiValue) {
                            console.error('Error highlighting code block 0', 'shiki is not initialized')
                            continue
                        }
                        console.error('Error highlighting code block 1', block.innerHTML)
                        continue
                    }
                    const newCode = document.createElement('div')
                    newCode.innerHTML = html
                    const classList = newCode.querySelector('pre')?.classList
                    const innerHTML = newCode.querySelector('code')?.innerHTML
                    if(!innerHTML) {
                        console.error('Error highlighting code block 2', innerHTML)
                        continue
                    }
                    if(classList) {
                        block.parentElement?.classList.add(...classList)
                    }
                    block.innerHTML = innerHTML.replace(/\n/g, '')
                }
            }
            resolve();
        })));
    }

    onMounted(async () => {
        shiki.value = getShiki()
    })

    return { highlightCodeBlocks }
}
