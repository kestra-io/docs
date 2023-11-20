<template>
    <div class="d-flex justify-content-center container footer py-4 my-5">
        <div class="col-12 col-md-7">
            <div class="container text-center  rounded">
                <div>
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
    </div>
</template>
<style scoped lang="scss">
 @import "../../assets/styles/variable";
.footer{
    background-color: $black-2;
    
    border: 1px solid $black-3;
}
.btn-dark{
    --bs-btn-bg: $black-4 ;
    --bs-btn-hover-bg : $black-4; 
    border: 1px solid $black-6;
}
</style>