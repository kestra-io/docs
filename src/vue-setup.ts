import type { App } from "vue";
import { defineComponent, h } from "vue";

export default (app: App) => {

    // if (import.meta.env.DEV) {
    //     app.config.warnHandler = (msg, instance, trace) => {
    //         // Check for your specific missing template error
    //
    //         console.log(msg)
    //
    //         if (msg.includes('missing template or render function') || true) {
    //             const error = new Error(`[Vue Strict Mode] ${msg}\n${trace}`);
    //             // Throwing here will stop the SSR process and trigger the Astro Overlay
    //             throw error;
    //         }
    //         // Log other warnings normally
    //         console.warn(`[Vue Warn]: ${msg}${trace}`);
    //     };
    // }


    // Register global NuxtLink as the standard <a href> tag
    app.component("NuxtLink", defineComponent({
        setup: (props, { slots }) => () => h("a", { href: props.to ?? props.href }, slots.default?.()),
        props: ["to", "href"]
    }));
    app.component("NuxtImg", defineComponent({
        setup: (props, { slots }) => () => h("img", {
            width: props.width,
            height: props.height,
            src: props.src,
            alt: props.alt
        }),
        props: ["width", "height", "src", "alt"]
    }))
    app.component("ClientOnly", defineComponent({
        setup: (_, { slots }) => () => slots.default?.(),
        inheritAttrs: false,
        props: ["fallback"]
    }));
};