export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.directive('click-outside', {
        mounted: (el, binding, vnode) => {
            el.clickOutsideEvent = function (event) {
                if (!(el == event.target || el.contains(event.target))) {
                    binding.value();
                }
            };
            document.body.addEventListener('click', el.clickOutsideEvent)
        },
        beforeUnmount: (el) => {
            document.body.removeEventListener('click', el.clickOutsideEvent)
        }
    })
})