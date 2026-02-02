<template>
    <div class="container">
        <Section :title="title" :subtitle="subtitle" :subtitle-after="subtitleAfter">
            <div class="row no-shadow mb-2">
                <template v-for="item in items">
                    <div class="col-12 col-md-6 col-lg-3 mb-4">
                        <Card :icon="item.icon" :title="item.title" :description="item.text" />
                    </div>
                </template>
            </div>
        </Section>
    </div>
</template>

<script setup lang="ts">
    import Section from "~/components/layout/Section.vue"
    import Card from "~/components/card/Card.vue"

    type FeatureItem = {
        icon?: string
        title?: string
        text?: string
    }

    const props = withDefaults(
        defineProps<{
            title?: string
            subtitle?: string
            subtitleAfter?: string
            items?: FeatureItem[]
        }>(),
        {
            items: () => [],
        },
    )
</script>