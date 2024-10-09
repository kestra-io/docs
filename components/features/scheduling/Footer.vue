<template>
    <div class="d-flex justify-content-center container my-5">
        <div class="col-12 col-md-7 py-4 footer">
                <div class=" text-center rounded">
                    <h3 data-aos="fade-right" class="mb-3">Getting Started</h3>
                    <div class="d-flex gap-2  flex-wrap justify-content-center align-items-center">
                        <NuxtLink href="/docs">
                            <button class="btn  btn-dark mx-2 mt-2">Get Started</button>
                        </NuxtLink>
                        <NuxtLink href="https://github.com/kestra-io/kestra">
                            <button class="btn btn-animated btn-purple-animated mx-2 mt-2">Get Started</button>
                        </NuxtLink>
                    </div>
                </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
 @import "../../../assets/styles/variable";
.btn-dark{
    --bs-btn-bg: $black-4 ;
    --bs-btn-hover-bg : $black-4;
    border: 1px solid $black-6;
}
.container{
    background-color: $black-2;
    border: $block-border;
    border-radius: 8px;
    position: relative;
    z-index: 10;
    &::before {
        content: "";
        position: absolute;
        width: 262px;
        height: 170px;
        background: url("/landing/features/scheduling/light-mask2.svg") ;
        right: 0px;
        top: 0px;
        z-index: 1;
  }
}
</style>