import AOS from "aos";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('page:finish', () => {
        AOS.init({once: false});
    })

    return ({
        provide: {
            aos: {
                AOS
            },
        },
    });
});