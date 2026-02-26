import { onMounted, nextTick } from "vue"
import { useMutationObserver } from "@vueuse/core"
import { cssVariable } from "@kestra-io/ui-libs"

export const useHubspotTheme = (selector: string = "#hubspotForm", styleId: string = "ks-hubspot-overrides") => {
    const getStyles = () => {
        const colors = {
            label: cssVariable("--ks-content-primary"),
            inputBg: cssVariable("--ks-background-input"),
            required: cssVariable("--ks-content-alert-danger"),
            border: cssVariable("--ks-border-secondary"),
            btnPrimary: cssVariable("--ks-background-button-primary"),
            btnPrimaryHover: cssVariable("--ks-background-button-primary-hover")
        }

        return `
            .hs-form,
            .hs-form-field label:not(.hs-error-msg) span:not(.hs-form-required),
            .hs-form-field label:not(.hs-error-msg) p,
            .hs-input,
            .hs-button,
            .hs-richtext {
                font-family: 'Mona Sans', sans-serif !important;
            }
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
            .hs-button {
                background: linear-gradient(${colors.btnPrimary}, ${colors.btnPrimary}) padding-box, linear-gradient(262.72deg, #FFFFFF 15.19%, #E8C8C8 37.92%, #838383 76.01%) border-box !important;
                color: #fff !important;
                position: relative;
                border: 1px solid transparent !important;
                border-radius: 0.5rem !important;
                box-shadow: 0px 0px 14px 0px #BE62FF inset, 2px 2px 11px 0px #0000001A !important;
                padding: 0.5rem 1.5rem !important;
                font-weight: 700 !important;
                font-size: 1rem !important;
                cursor: pointer !important;
                text-align: center !important;
                vertical-align: middle !important;
                line-height: 1.5 !important;
                transition: background 0.15s ease-in-out !important;
                min-width: 160px !important;
            }
            .hs-button:hover {
                background: linear-gradient(${colors.btnPrimaryHover}, ${colors.btnPrimaryHover}) padding-box, linear-gradient(90deg, #EFF4FF 0%, #8F9299 100%) border-box !important;
                border: 1px solid transparent !important;
                color: #fff !important;
            }
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
