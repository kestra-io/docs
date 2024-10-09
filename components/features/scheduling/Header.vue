<template>
        <div class="hero container mt-5">
            <div class="row header-content">
                <div class="col-md-6 align-items-center d-flex">
                    <div>
                        <h1 data-aos="fade-right" class="title-1 title">Scheduling </h1>
                        <h1 data-aos="fade-right" class="title-2 title">and Automation</h1>
                        <p class="baseline mb-0 pb-3" data-aos="fade-left">Automate scheduled and event-driven workflows with Kestra</p>
                        <div class="cta">
                            <NuxtLink href="/demo" class="btn btn-dark mt-2 me-3" data-aos="zoom-in">
                                get a demo
                            </NuxtLink>
                            <NuxtLink href="https://github.com/kestra-io/kestra"  class="btn btn-animated btn-purple-animated mt-2" data-aos="zoom-in">
                                Get started
                            </NuxtLink>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-5" data-aos="zoom-in">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="806px"
                        height="601px"
                        class="zoom img-fluid"
                        src="/landing/features/scheduling/header/header.svg"
                        alt="A screenshot of the Scheduling page"
                    />
                </div>
            </div>
        </div>
</template>
<style lang="scss" scoped>
    @import "../../../assets/styles/variable";

    .container {
        background-image: url('/landing/features/scheduling/masking.svg');
        color: var(--bs-white);
        margin-top: -5rem;
        border-bottom: $block-border;

        .header-content {
            @include media-breakpoint-down(md) {
                flex-direction: column-reverse;
            }
        }
    }
    .baseline{
        font-weight: 300;
        font-size: $font-size-xl;
    }
    .title{
        font-weight: 400;
        font-size: 3.75rem;
        margin:0;
        &-1{
            background: linear-gradient(90deg, #E151F7 0.45%, #5C47F5 43.61%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            padding: 0 !important;
        }
    }
    .btn-dark{
    --bs-btn-bg: $black-4 ;
    --bs-btn-hover-bg : $black-4;
    border: 1px solid $black-6;
}
.line{
    height: 1px;
    background: $black-6;
}

.hero{
    padding-bottom: 0rem;
    padding-top: 0;
    @include media-breakpoint-down(md) {
        padding-top: 0;
    }
}
</style>
