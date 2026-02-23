import { onMounted, nextTick } from "vue"
import { useMutationObserver } from "@vueuse/core"
import { cssVariable } from "@kestra-io/ui-libs"

export const useHubspotTheme = (selector: string = "#hubspotForm", styleId: string = "ks-hubspot-overrides") => {
    const getStyles = () => {
        const colors = {
            label: cssVariable("--ks-content-primary"),
            inputBg: cssVariable("--ks-background-input"),
            required: cssVariable("--ks-content-alert-danger"),
            border: cssVariable("--ks-border-primary")
        }

        return `
            .hs-form-field label:not(.hs-error-msg) span:not(.hs-form-required), 
            .hs-form-field label:not(.hs-error-msg) p { color: ${colors.label} !important; }
            .hs-input { 
                background-color: ${colors.inputBg} !important; 
                border: 1px solid ${colors.border} !important; 
                border-radius: 6px !important;
                color: ${colors.label} !important;
            }
            .hs-form-required, .hs-form-required span { color: ${colors.required} !important; }
            .legal-consent-container .hs-richtext { color: ${colors.label} !important; }
        `
    }

    const updateStyles = () => {
        const styleText = getStyles()
        const iframes = document.querySelectorAll<HTMLIFrameElement>(`${selector} iframe`)
        
        for (const iframe of iframes) {
            const doc = iframe.contentDocument || iframe.contentWindow?.document
            const styleTag = doc?.getElementById(styleId)
            if (styleTag) {
                styleTag.textContent = styleText
            }
        }
    }

    onMounted(async () => {
        await nextTick()
        
        useMutationObserver(document.documentElement, updateStyles, { 
            attributes: true, 
            attributeFilter: ["class"] 
        })
    })

    return { getStyles, updateStyles, styleId }
}
