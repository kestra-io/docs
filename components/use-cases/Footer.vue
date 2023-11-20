<template>
    <div class="row justify-content-center">
        <div class="col-12 col-md-7">
            <div class="container text-center mb-5 rounded">
                <div>
                    <h3 data-aos="fade-right">Getting Started</h3>
                    <div
                        class="d-flex gap-2 flex-wrap justify-content-center align-items-center"
                    >
                        <NuxtLink href="/docs/terraform">
                            <button class="btn btn-primary">
                                Read the docs
                            </button>
                        </NuxtLink>
                        <NuxtLink href="/docs/terraform">
                            <button class="btn btn-primary">
                                Get Started
                            </button>
                        </NuxtLink>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "../../assets/styles/variable";

.container {
    position: relative;
    background: $purple-31;
    padding: calc($spacer * 2.375) calc($spacer * 2);

    > div {
        h6 {
            font-weight: normal;
            line-height: 1.625rem;
        }
    }

    border: double 1px transparent;
    background-origin: border-box;
    background-clip: padding-box, border-box;
}
</style>
<script>
export default {
    name: "UseCaseFooter",
};
</script>
