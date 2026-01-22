<template>
    <div class="position-relative container-fluid d-flex justify-content-center">
        <div class="position-relative">
            <NuxtImg
                width="774px"
                height="725px"
                loading="lazy"
                format="webp"
                src="/partners/background.svg"
                alt="Frame 922"
            />
            <div class="logo position-absolute start-50 translate-middle">
                <NuxtImg
                    width="268px"
                    height="267px"
                    loading="lazy"
                    format="webp"
                    src="/partners/badge-partner.svg"
                    alt="Become Kestra partner"
                />
            </div>
        </div>
        <div class="description position-absolute start-50 translate-middle text-center w-50">
            <h2>Kestra Partner <br /><span>Ecosystem</span></h2>
            <span class="text"
                >Whether you are building something new, upgrading a legacy stack, or
                re-platforming, you can trust Kestra and our partner ecosystem to make that journey
                a success.</span
            ><br />
            <a href="#form" class="btn btn-animated btn-purple-animated mt-4">Become a partner</a>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .container-fluid {
        padding-bottom: 8rem;

        @include media-breakpoint-down(md) {
            padding-bottom: 6rem;
        }

        .logo {
            top: 21.438rem;
        }

        .description {
            top: 74%;

            h2 {
                color: $white;
                font-size: $font-size-4xl;
                font-weight: 400;
                margin-bottom: 1rem;

                span {
                    background: linear-gradient(90deg, #e151f7 35.49%, #5c47f5 65.98%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }

            .text {
                color: $white;
                font-size: $font-size-xl;
                font-weight: 300;
            }

            @include media-breakpoint-down(xl) {
                h2 {
                    font-size: $font-size-3xl;
                }

                .text {
                    font-size: $font-size-lg;
                }
            }

            @include media-breakpoint-down(md) {
                width: 80% !important;
                h2 {
                    font-size: $font-size-2xl;
                }

                .text {
                    font-size: $font-size-sm;
                }
            }
        }
    }
</style>