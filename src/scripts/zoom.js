import zoom from "medium-zoom/dist/pure"

const initZoom = () => {
    const zoomHandler = zoom("img.zoom:not(.medium-zoom-image)", {
        background: "#0A0B0D",
    })

    const topBar = document.getElementById("top-bar")
    const fixedContainer = document.getElementById("fixed-container")
    const navTocGlobal = document.getElementById("nav-toc-global")

    zoomHandler.on("close", () => {
        topBar.classList.remove("animation-slide-up")
        fixedContainer.classList.remove("animation-slide-right")
        navTocGlobal?.classList.remove("animation-slide-right")
    })

    zoomHandler.on("open", () => {
        topBar.classList.toggle("animation-slide-up", true)
        fixedContainer.classList.toggle("animation-slide-right", true)
        navTocGlobal?.classList.toggle("animation-slide-right", true)
    })
}

document.addEventListener("astro:page-load", () => {
    initZoom()
})