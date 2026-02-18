<template>
    <section class="unlock-section">
        <div class="container">
            <div class="title-block mb-3">
                <img width="150" loading="lazy" data-usal="zoomin" :src="logo.src" :alt="logo.alt" />
                <h1 v-if="title" class="title">
                    Unlock the <span class="highlight">Potential</span> of Your <br />{{ title }}
                </h1>
                <p class="description">{{ description }}</p>
            </div>

            <div class="row d-none d-lg-flex justify-content-center mt-5">
                <div class="col-12 col-lg-5 z-2" data-usal="zoomin">
                    <div class="unlock-content text-end">
                        <template v-for="info in content.leftContent" :key="info.title">
                            <h2 class="content-title">{{ info.title }}</h2>
                            <h6 class="content-description">{{ info.description }}</h6>
                        </template>
                    </div>
                </div>

                <div class="col-12 d-none d-lg-block col-lg-2 z-2" data-usal="zoomin">
                    <UnlockLine :strokeColor="strokeColor" />
                </div>

                <div class="col-12 col-lg-5 z-2" data-usal="zoomin">
                    <div class="unlock-content text-start">
                        <template v-for="info in content.rightContent" :key="info.title">
                            <h6 class="content-description">{{ info.description }}</h6>
                            <h2 class="content-title">{{ info.title }}</h2>
                        </template>
                    </div>
                </div>
            </div>

            <div class="unlock-cards d-lg-none">
                <div 
                    v-for="(left, _index) in content.leftContent" 
                    :key="left.title" 
                    class="card"
                >
                    <h4 class="content-title mb-2">{{ left.title }}</h4>
                    <h6 class="content-description">{{ left.description }}</h6>
                </div>
                <div 
                    v-for="right in content.rightContent" 
                    :key="right.title" 
                    class="card"
                >
                    <h4 class="content-title mb-2">{{ right.title }}</h4>
                    <h6 class="content-description">{{ right.description }}</h6>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import UnlockLine from "~/components/use-cases/UnlockLine.vue"

    defineProps<{
        title?: string
        description: string
        logo: { src: string; alt: string }
        strokeColor: string
        content: any
    }>()
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .unlock-section {
        text-align: center;
        color: var(--ks-content-primary);
        background: var(--ks-background-body);
        font-weight: 300;
        padding-block: calc($spacer * 4) $spacer;
        .unlock-cards {
            display: grid;
            grid-template-columns: 1fr;
            gap: $spacer;
            padding: $spacer;
            .card {
                background: var(--ks-background-secondary);
                padding: $spacer;
                border-radius: $border-radius;
                text-align: left;
            }
        }
    }

    .title-block {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        z-index: 3;
    }

    .title {
        color: var(--ks-content-primary);
        text-align: center;
        font-weight: 600;
    }

    .description {
        max-width: $container-max-width;
        font-weight: normal;
        @include media-breakpoint-down(lg) {
            max-width: unset;
        }
    }

    .unlock-content {
        display: flex;
        flex-direction: column;
        gap: 8rem;
        padding-top: calc($spacer * 5);
        @include media-breakpoint-down(lg) {
            flex-direction: row;
            gap: $spacer;
            padding-top: $spacer;
        }
    }

    .content-title {
        margin: 0;
        font-weight: 600;
        color: var(--ks-content-primary);
    }

    .content-description {
        font-size: $h6-font-size;
        font-weight: 500;
        color: var(--ks-content-secondary);
        margin: 0;
        @include media-breakpoint-down(lg) {
            font-size: $font-size-xs;
            line-height: 1rem;
        }
    }

    .unlock-section.red .title span {
        background: linear-gradient(90.03deg, #e3262f 57.94%, #ab0009 87.71%) !important;
        background-clip: text !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
    }
</style>