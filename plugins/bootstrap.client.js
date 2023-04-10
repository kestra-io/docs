import {Collapse, Dropdown, Modal} from "bootstrap";

export default defineNuxtPlugin(() => ({
    provide: {
        bootstrap: {
            Collapse, Dropdown, Modal
        },
    },
}));