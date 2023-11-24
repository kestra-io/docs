<template>
    <div class="container-fluid">
        <div class=" container">
            <div class="row ">
                <div class="col-md-6 align-items-center d-flex  order-sm-2 order-md-1">
                    <div class="hero mt-5">
                        <h1 data-aos="fade-right" class="title-2 title">Orchestrate Your</h1>
                        <h1 data-aos="fade-right" class="title-1 title">Retail Ecosystem</h1>
                        <h1 data-aos="fade-right" class="title-2 title mb-2">with Kestra</h1>
                        <p class="baseline" data-aos="fade-left" >From data pipelines to complex integrations, Kestra empowers retail businesses with an event-driven, language-agnostic orchestration platform that scales as you grow.</p>
                        <div class="cta">
                            <NuxtLink href="/demo" class="btn btn-dark mt-2" data-aos="zoom-in">
                                Book a demo
                            </NuxtLink>
                            <a href="/docs"  class="btn btn-animated btn-purple-animated mx-2  mt-2" data-aos="zoom-in">
                                Get started!
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 order-sm-1 order-md-2" data-aos="zoom-in">
                    <img class="zoom img-fluid" src="/retail/header.svg" alt="A screenshot of the Retail page"/>
                </div>
            </div>
            <div class="line"/>
        </div>
    </div>
</template>
<style lang="scss" scoped>
 @import "../../assets/styles/variable";
    .container-fluid {
        background-image: url('/retail/headerMask.svg');
        background-size: cover;
        color: var(--bs-white);
        padding-top: 5rem;
        margin-top: -5rem;
    }
    .baseline{
        font-weight: 300;
        font-size: $font-size-xl;
    }
    .title{
        font-weight: 300;
        font-size: $h1-font-size;
        margin:0;
        padding: 0 !important;
        &-1{
            background: var(--Text_gradient, linear-gradient(90deg, #E151F7 2.16%, #5C47F5 65.09%));
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;  
        }
    }
.btn-dark{
    --bs-btn-bg: $black-4 ;
    --bs-btn-hover-bg : $black-4; 
    border: 1px solid $black-6;
}
.line{
    width: 100%;
    height: 1px;
    background: $black-6;
}
</style>