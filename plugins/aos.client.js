import AOS from "aos";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('page:finish', () => {
        // let list = document.getElementsByClassName("aos-init");
        //
        // console.log(list);
        // for (let item of list) {
        //     item.classList.remove("aos-init");
        //     item.classList.remove("aos-animate");
        //     console.log(item.classList.length)
        // }

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