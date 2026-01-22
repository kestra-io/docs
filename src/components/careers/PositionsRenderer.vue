<template>
    <div class="container" id="positions">
        <LayoutSection
            subtitle="It's a"
            subtitle-after="Match"
            baseline="We are looking for talented open-source enthusiasts working remotely from anywhere. Browse our open positions, and find a job you love."
        >
            <ul class="list-unstyled d-flex flex-column gap-3">
                <li data-usal="fade-l" v-for="doc in positions" :key="doc.id">
                    <a class="d-flex align-items-center bg-dark-2" :href="`/careers/${doc.id}`">
                        <div class="d-flex align-items-center gap-3">
                            <img v-bind="emojiPeople" alt="emoji_people" />
                            <span>
                                {{ doc.title }}
                            </span>
                            <span class="loc">
                                (Remote /<template v-for="loc in doc.locations" :key="loc.code">
                                    <span class="ms-1" :title="loc.name">{{
                                        loc.emoji
                                    }}</span> </template
                                >)
                            </span>
                        </div>
                        <div class="d-flex align-items-center gap-3">
                            <img v-bind="arrowRight" alt="arrow_right" />
                        </div>
                    </a>
                </li>
            </ul>
        </LayoutSection>
    </div>
</template>

<script lang="ts" setup>
    import LayoutSection from "~/components/layout/Section.vue"
    import arrowRight from "./assets/arrow_right.svg"
    import emojiPeople from "./assets/emoji_people.svg"

    defineProps<{
        positions: Array<{
            id: string
            title: string
            locations: Array<{
                emoji: string
                name: string
                code: string
            }> | null
        }>
    }>()
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    :deep(section) {
        .baseline {
            font-size: $h6-font-size;
        }
    }

    li {
        a {
            padding: 1.313rem 2rem;
            border-radius: 0.5rem;
            border: $block-border;

            span.loc {
                font-weight: normal !important;
            }

            div:first-of-type {
                flex-grow: 1;

                span {
                    color: $white;
                    font-size: $h6-font-size;
                    font-weight: 700;
                }
            }

            div:last-of-type {
                span {
                    border-radius: 4px;
                    padding: 0.25rem 0.5rem;
                    background-color: $purple-35;
                    color: $white;
                    font-size: $font-size-sm;
                    font-weight: 700;
                }
            }
        }
    }
</style>