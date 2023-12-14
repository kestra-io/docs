import {Collapse, Dropdown, Modal, ScrollSpy, Tooltip} from "bootstrap";

export default defineNuxtPlugin((nuxtApp) => {

    nuxtApp.hook('page:finish', () => {
        window.dispatchEvent(new Event("load"));
    })

    return ({
        provide: {
            bootstrap: {
                Collapse, Dropdown, Modal, ScrollSpy, Tooltip
            },
        },
    });
});