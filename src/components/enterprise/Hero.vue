<template>
    <section class="hero">
        <div class="container">
            <div class="content">
                <h6 data-usal="fade">Built For Critical Use Cases</h6>
                <h1 data-usal="fade">
                    Scale With Kestra <br>
                    Enterprise Edition
                </h1>
                <div class="d-flex align-items-center gap-3 cta" data-usal="zoomin">
                    <Link
                        href="/pricing"
                        text="Compare All Plans"
                        class="btn btn-secondary"
                    />
                    <Link
                        href="/enterprise/free-trial"
                        text="Request Free Trial"
                        class="btn btn-primary"
                    />
                </div>
            </div>
            <Dashboard />
            <slot />
        </div>
    </section>
</template>

<script setup lang="ts">
    import Link from '~/components/common/Link.vue';
    import Dashboard from '~/components/enterprise/Dashboard.vue';

</script>

<style lang="scss" scoped>
    .hero {
        padding-top: 7.5rem;
        padding-bottom: 90px;
        background-color: #131316;
        margin: calc(-80px - var(--announce-height)) auto 0;
        background-image: url("./assets/bg-left.webp"), url("./assets/bg-right.webp");
        background-position: left 0 bottom -100px, top right;
        background-repeat: no-repeat;
        background-size: 400px auto, 500px auto;
        position: relative;
        z-index: 1;
        overflow: hidden;

        &::after {
            content: "";
            position: absolute;
            bottom: -200px;
            left: -80px;
            background: radial-gradient(ellipse,
                    #9F4FED 10%,
                    rgba(220, 208, 244, 0) 70%);
            width: 700px;
            height: 449px;
            z-index: -1;
            transform: rotate(155deg);
        }

        @include media-breakpoint-down(lg) {
            background-size: 200px auto, 300px auto;
        }

        .container {
            @include media-breakpoint-down(md) {
                padding: 0 1rem;
            }
        }

        .content {
            width: 100%;

            @include media-breakpoint-up(lg) {
                max-width: 839px;
            }

            display: flex;
            flex-direction: column;
            gap: 20px;
            margin: 0 auto;
            align-items: center;
            text-align: center;

            h1 {
                color: $white;
                font-weight: 500;

                @include media-breakpoint-up(xl) {
                    font-size: 3.5rem;
                }
            }

            h6 {
                color: #CDC5FF;
            }

            .cta {
                padding-bottom: 0;
                @include media-breakpoint-down(sm) {
                    flex-direction: column;
                }
            }
        }
    }
</style>

