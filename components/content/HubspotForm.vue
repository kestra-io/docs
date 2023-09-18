<template>
    <div :id="uuid" />
</template>

<script setup>
    const uuid = ref();

    onMounted(() => {
        if (process.client) {
            const slots = useSlots()

            uuid.value = 'hs_' + Date.now();

            if (window.hbspt) {
                let parse = JSON.parse(slots.default()[0].children.default()[0].children);
                parse.target = "#" + uuid.value;

                if (parse.event) {
                    parse.onFormSubmit = function ($form) {
                        if (window.dataLayer) {
                            window.dataLayer.push({'event': parse.event});
                        }
                    }

                    delete parse['event']
                }

                let interval = window.setInterval(() => {
                    if (document.getElementById(uuid.value)) {
                        window.hbspt.forms.create(parse);
                        window.clearInterval(interval);
                    }
                }, 1000);
            }
        }
    })
</script>
