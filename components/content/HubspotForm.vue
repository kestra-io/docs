<template>
    <ClientOnly>
        <div :id="uuid" />
    </ClientOnly>
</template>

<script setup>
    import {hubspotFormCreate} from "~/utils/hubspot.js";

    const uuid = ref();

    onMounted(() => {
        if (process.client) {
            const slots = useSlots()

            uuid.value = 'hs_' + Date.now();

            let parse = JSON.parse(slots.default()[0].children.default()[0].children);
            parse.target = "#" + uuid.value;

            let eventName = null;
            if (parse.event) {
                eventName = parse.event;

                delete parse['event']
            }

            let interval = window.setInterval(() => {
                if (document.getElementById(uuid.value)) {
                    if (process.client) {
                        hubspotFormCreate(eventName, parse);
                    }

                    window.clearInterval(interval);
                }
            }, 1000);
        }
    })
</script>
