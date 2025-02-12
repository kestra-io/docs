<template>
    <div class="container" id="positions">
        <LayoutSection
            subtitle="It's a"
            subtitle-after="Match"
            baseline="We are looking for talented open-source enthusiasts working remotely from anywhere. Browse our open positions, and find a job you love."
        >
            <ul class="list-unstyled d-flex flex-column gap-3">
                <li data-aos="fade-left" v-for="doc in pageData">
                    <NuxtLink class="d-flex align-items-center bg-dark-2" :href="doc.path">
                        <div class="d-flex align-items-center gap-3">
                            <img src="/landing/careers/emoji_people.svg" alt="emoji_people" />
                            <span>{{ doc.title }}</span>
                        </div>
                        <div class="d-flex align-items-center gap-3">
                            <span>{{ doc.type }}</span>
                            <img src="/landing/careers/arrow_right.svg" alt="arrow_right" />
                        </div>
                    </NuxtLink>
                </li>
            </ul>
        </LayoutSection>
    </div>
</template>

<script setup>
    const {data: pageData} = await useAsyncData(
        `Career-Positions`,
        () => queryCollection("careers").all()
    );
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

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