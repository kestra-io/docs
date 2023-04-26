import AOS from "aos";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('page:finish', () => {
        AOS.init({
            startEvent: "load",
            once: false,
            offset: 0
        });

        window.setTimeout(() => {
            AOS.refreshHard();
        }, 10);
    })

    return ({
        provide: {
            aos: {
                AOS
            },
        },
    });
});