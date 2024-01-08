<template>
<div class="container text-center rounded-3 mt-5 mb-5">
    <div class="rounded-3">
        <div>
            <h3 data-aos="fade-right">New to Kestra?</h3>
            <h6 class="mt-3" data-aos="zoom-in">Use blueprints to kickstart your first workflows.</h6>
            <NuxtLink href="/docs/getting-started">
                <button class="btn btn-primary">Get started with Kestra</button>
            </NuxtLink>
        </div>
    </div>
</div>
</template>

<style scoped lang="scss">
@import "../../assets/styles/variable";

.container {
    > div {
        position: relative;
        background: $purple-8;
        padding: calc($spacer * 3);

        &:before {
            content: "";
            background: url("/landing/dot2.svg") no-repeat bottom right;
            width: 329px;
            height: 236px;
            position: absolute;
            right: 1rem;
            bottom: 7rem;
            z-index: 1;
        }

        > div {
            position: relative;
            z-index: 2;

            h6 {
                font-weight: normal;
                line-height: 1.625rem;
            }
        }
    }

    h3 {
        font-size: $h3-font-size;
        font-weight: 800;

        span {
            color: var(--bs-black);
        }
    }

    @include media-breakpoint-down(sm) {
        max-width: 80%
    }
}

</style>