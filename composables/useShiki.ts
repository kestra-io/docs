/**
 * With this composable, we can use the shiki syntax highlighter
 * fully on the client side.
 * This allows for a lighter server side rendering and faster page loads.
 * Plus as a bonus, we can use the site in cloudflare pages since the BE bundle is now smaller.
 */
import {ref} from "vue";
import { createHighlighter } from 'shiki'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

const jsEngine = createJavaScriptRegexEngine()

export async function getShiki() {
    const shiki = await createHighlighter({
        themes: ['github-dark'],
        langs: ['bash',
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
                'xml',
                'yaml'],
        engine: jsEngine
    })
    return shiki
}


export default function useShiki(options = {immediate: false}) {
    const shiki = ref<ReturnType<typeof getShiki>>()
    async function highlightCodeBlocks(root: HTMLElement = document.body) {
        const blocks = root.querySelectorAll('pre > code')
        for(const block of blocks) {
            const preClassList = block.parentElement?.classList;
            // avoid rendering already highlighted code
            if(!preClassList || preClassList.contains('shiki')) continue

            // check is there is a language class and extract it
            const languageClass = Array.from(preClassList).find((c) => c.startsWith('language-'))
            if(languageClass) {
                const html = (await shiki.value)?.codeToHtml(block.innerHTML.replace(/\n$/, ''), {
                    lang: languageClass.replace('language-', ''),
                    theme: 'github-dark'
                })

                if(!html) {
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
            // add mb-3 to the block-code element
            let el: HTMLElement | null = block.parentElement
            while(el && !el.classList.contains('code-block')) {
                el = el.parentElement
            }
        }
    }


    onMounted(async () => {
        shiki.value = getShiki()
        if(options.immediate){
            await highlightCodeBlocks()
        }
    })

    return { shiki, highlightCodeBlocks }
}
