<template>
    <div class="d-flex justify-content-center container my-5">
        <div class="col-12 col-md-7 py-4 footer">
                <div class=" text-center rounded">
                    <h3 data-aos="fade-right" class="mb-3">Getting Started</h3>
                    <div class="d-flex gap-2  flex-wrap justify-content-center align-items-center">
                        <NuxtLink href="/docs">
                            <button class="btn  btn-dark mx-2 mt-2">Read the docs</button>
                        </NuxtLink>
                        <NuxtLink href="/">
                            <button class="btn btn-animated btn-purple-animated mx-2 mt-2">Getting Started!</button>
                        </NuxtLink>
                    </div>
                </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
 @import "../../assets/styles/variable";

.container{
    background-color: $black-2;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    z-index: 10;
    &::before {
        content: "";
        position: absolute;
        width: 262px;
        height: 170px;
        background: url("/retail/light-mask2.svg") ;
        right: 0px;
        top: 0px;
        z-index: 1;
  }
}
.btn-dark{
    --bs-btn-bg: $black-4 ;
    --bs-btn-hover-bg : $black-4; 
    border: 1px solid $black-6;
}
</style>