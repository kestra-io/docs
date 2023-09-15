<template>
    <div :id="uuid" />
</template>

<script setup>
    const slots = useSlots()
    const uuid = ref('hs_' + Date.now());

    onMounted(() => {
        if (process.client) {
            if (window.hbspt) {
                let parse = JSON.parse(slots.default()[0].children.default()[0].children);
                parse.target = "#" + uuid.value;

                console.log(parse.target);
                if (parse.event) {
                    parse.onFormSubmit = function ($form) {
                        if (window.dataLayer) {
                            window.dataLayer.push({'event': parse.event});
                        }
                    }

                    delete parse['event']
                }

                window.hbspt.forms.create(parse)
            }
        }
    })
</script>
