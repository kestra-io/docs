<template>
    <div class="container">
        <Section
            :title="title"
            :subtitle="subtitle"
            :subtitle-after="subtitleAfter"
            class="with-shadow"
        >
            <div class="row card-group card-centered no-shadow mb-2">
                <template v-for="item in items">
                    <div class="col-md-4 mb-4">
                        <div class="card" data-aos="zoom-in">
                            <div class="card-body">
                                    <span class="card-icon">
                                        <component :is="item.icon" />
                                    </span>
                                <h4 class="card-title">{{ item.title }}</h4>
                                <p class="card-text">{{ item.text }}</p>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section},
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
