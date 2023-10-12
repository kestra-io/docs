<template>
    <div class="main text-center mb-5">
        <div class="rounded-3">
            <div>
                <h3 data-aos="fade-right">Getting Started with Kestra</h3>
                <div class="mt-4">
                    <button class="btn btn-dark btn-lg me-3">Read the Documentation</button>
                    <button class="btn btn-primary btn-lg">Try Kestra now</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";

    .main {
        > div {
            position: relative;
            background: $purple-8;
            padding: calc($spacer * 3);
            color: var(--bs-primary);

            &:before {
                content: "";
                background: url("/landing/dot2.svg") no-repeat bottom left;
                width: 329px;
                height: 236px;
                position: absolute;
                right: 10rem;
                bottom: 2rem;
                z-index: 1;

                @include media-breakpoint-down(lg) {
                    background-position-x: right;
                    right: 1rem;
                }
            }

            > div {
                position: relative;
                z-index: 2;
            }
        }

        h3 {
            font-size: 2.188rem;
            font-weight: 800;
            color: $purple-24;
        }

        .btn {
            @include media-breakpoint-down(md) {
                margin-bottom: 1rem;
            }
        }
    }
</style>