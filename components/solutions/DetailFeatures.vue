<template>
    <div class="container">
        <Section
            :title="title"
            :subtitle="subtitle"
            :subtitle-after="subtitleAfter"
        >
            <div class="row no-shadow mb-2">
                <template v-for="item in items">
                    <div class="col-12 col-md-6 col-lg-3 mb-4">
                        <Card
                            :icon="item.icon"
                            :title="item.title"
                            :description="item.text"
                        />
                    </div>
                </template>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';
    import Card from '../../components/card/Card.vue';

    export default {
        components: {Section, Card},
        props: {
            title: {
                type: String,
                required: false,
            },
            subtitle: {
                type: String,
                required: false,
            },
            subtitleAfter: {
                type: String,
                required: false,
            },
            items: {
                type: Array,
                required: false,
            },
        }
    }
</script>
