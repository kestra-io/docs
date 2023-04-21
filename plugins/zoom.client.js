import zoom from 'medium-zoom'

export default defineNuxtPlugin((nuxtApp) => {
    const initZoom = () => {
        const zoomHandler = zoom('img.zoom:not(.medium-zoom-image)');
        const topBar = document.getElementById("top-bar");
        const fixedContainer = document.getElementById("fixed-container");
        zoomHandler.on('close', event => {
            topBar.classList.remove("animation-slide-up");
            fixedContainer.classList.remove("animation-slide-right");
        })

        zoomHandler.on(
            'open',
            event => {
                topBar.classList.toggle("animation-slide-up", true);
                fixedContainer.classList.toggle("animation-slide-right", true);
            }
        )
    }

    nuxtApp.vueApp.mixin({
        mounted: function () {
            initZoom()
        },
        updated: function () {
            initZoom()
        },
    });
})