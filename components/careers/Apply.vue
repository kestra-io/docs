<template>
    <div class="container">
        <Section
            title="Join our team"
        >
            <div class="text-center cta">
                <template v-if="route.fullPath === '/careers'">
                    <p data-aos="fade-left">
                        Interested in joining us but not able to find what you are looking for? <br/>
                        Let's talk anyway. <br />
                        Write to us at:
                    </p>
                    <a href="mailto:jobs@kestra.io?subject=Spontaneous applications" target="_blank" class="btn btn-primary mt-5" data-aos="zoom-in">
                        Spontaneous applications
                    </a>

                </template>
                <template v-else>
                    <p data-aos="fade-left" >
                        Interested in joining us but not able to find what you are looking for? <br/>
                        Let's talk anyway. Write to us at:
                    </p>
                    <a :href="'mailto:jobs@kestra.io?subject=' + title " target="_blank" class="btn btn-primary mt-5" data-aos="zoom-in">
                        Apply for this job
                    </a>
                </template>
            </div>
        </Section>
    </div>
</template>

<script setup lang="ts">
    import Section from '../../components/layout/Section.vue';

    const route = useRoute();

    const props = defineProps({
        title: {
            type: String,
            default: undefined
        },
    })
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        padding-left: calc($spacer * 1);
        padding-right: calc($spacer * 1);
        margin-top: calc($spacer * 5.625);
        border-radius: 8px;
        border: $block-border;
        background: $black-2 url("/landing/careers/footer-bg.svg") no-repeat right;
        background-size: 20% 100%;

        :deep(p.baseline) {
            color: var(--bs-black);
        }
        :deep(p) {
            color: $white;
        }
        :deep(h2) {
            color: $white;
            font-size: $h3-font-size;
            font-weight: 100;
            margin-bottom: 0;
        }
    }
</style>