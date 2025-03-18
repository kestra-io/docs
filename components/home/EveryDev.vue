<template>
    <div class="wrapper-every-dev">
        <div class="center-block container">
            <div class="line-top"/>
            <h2>For <span>Every</span> Developer</h2>
            <div class="line-left"/>
            <div class="line-right"/>
            <div class="line-bottom"/>
            <p>Kestra unify all engineers, breaking down silos.</p>
        </div>
        <div class="container">
            <div class="left-card card-block">
                <NuxtImg width="117" height="120" src="/landing/home/every-software.png" alt="developers" class="img-natural"/>
                <NuxtImg width="117" height="120" src="/landing/home/every-software-hover.png" alt="developers" class="img-hover"/>
                <h3>Software Engineers</h3>
                <p class="description">
                    Version control all your resources, from workflows to users and permissions with CI/CD and Terraform Provider.
                    <a href="#" class="main-link">Ship Workflows Like Your Code <ArrowRightIcon/></a>
                </p>
            </div>

            <div class="right-card card-block">
                <NuxtImg width="117" height="120" src="/landing/home/every-platform.png" alt="developers" class="img-natural"/>
                <NuxtImg width="117" height="120" src="/landing/home/every-platform-hover.png" alt="developers" class="img-hover"/>
                <h3>Platform Engineers</h3>
                <p class="description">
                    Automate infrastructure tasks, manage dependencies, and ensure operational consistency.
                    <a href="#" class="main-link">Take Control of Your Platform Ops <ArrowRightIcon/></a>
                </p>
            </div>

            <div class="bottom-card card-block">
                <NuxtImg width="117" height="120" src="/landing/home/every-data.png" alt="developers" class="img-natural"/>
                <NuxtImg width="117" height="120" src="/landing/home/every-data-hover.png" alt="developers" class="img-hover"/>
                <h3>Data Engineers</h3>
                <p class="description">
                    Build reliable  data pipelines with on-demand infrastructure that scales on-demand whether in Cloud or on-prem.
                    <a href="#" class="main-link">Pipelines You Can Count On <ArrowRightIcon/></a>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import ArrowRightIcon from 'vue-material-design-icons/ArrowRight.vue';
</script>


<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .wrapper-every-dev {
        background-image: url(/landing/home/every-bg-dots.svg), radial-gradient(ellipse at center, #000 0%, rgba(70, 69, 100, 0) 100%);
        background-blend-mode: luminosity, normal;
        background-repeat: no-repeat, no-repeat;
        background-position: center bottom, center bottom;
        background-size: cover, cover;
        padding: 2rem;
        margin-top: -4rem;
        color: white;
        .container{
            position: relative;
            height: 400px;
            z-index: 1;
        }
        .center-block {
            height: auto;
            padding-top: 4rem;
            position: relative;
            @include media-breakpoint-up(lg){
                text-align: center;
                padding-top: 240px;
                height: 500px;
                width: 500px;
                margin: 0 auto;
            }
        }
    }

    .center-block {


        h2 {
            font-size: 2.2rem;
            line-height: 2.5rem;
            color: white;
            font-weight: 600;
            @include media-breakpoint-up(lg){
                width: 300px;
                margin-left: auto;
                margin-right: auto;
            }
            span {
                background: linear-gradient(90deg, #7C2EEA 0%, #658AF9 100%) no-repeat center;
                background-size: 100px;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
        p{
            color: #B9B9BA;
            @include media-breakpoint-up(lg){
                margin: auto;
                max-width: 250px;
            }
        }
        .line-top{
            content: '';
            position: absolute;
            z-index: -1;
            top: 70px;
            transform: translateX(-50%);
            width: 1px;
            height: 700px;
            left: 20%;
            @include media-breakpoint-up(lg){
                left: 50%;
                height: 150px;
            }
            background: linear-gradient(to bottom, transparent 50%, #191e27 50%), linear-gradient(to bottom, #190930 0%, #658AF9 100%);
            background-size: 4px 4px, 1px 100%;
        }
        @include media-breakpoint-up(lg){
            .line-left{
                content: '';
                position: absolute;
                top: 50%;
                right: 50%;
                width: 110px;
                transform: translate(-150px, 30px);
                height: 1px;
                background: linear-gradient(to right, transparent 50%, #191e27 50%), linear-gradient(to right, #190930 0%, #658AF9 100%);
                background-size: 4px 4px, 100% 1px;
            }
            .line-right{
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 110px;
                transform: translate(150px, 30px);
                height: 1px;
                background: linear-gradient(to right, transparent 50%, #191e27 50%), linear-gradient(to left, #190930 0%, #658AF9 100%);
                background-size: 4px 4px, 100% 1px;
            }
            .line-bottom{
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 1px;
                height: 100px;
                background: linear-gradient(to bottom, transparent 50%, #191e27 50%), linear-gradient(to top, #190930 0%, #658AF9 100%);
                background-size: 4px 4px, 1px 100%;
            }
        }
    }

    @property --ks-card-border-color-start {
        syntax: '<color>';
        initial-value: #6B66D5;
        inherits: false;
    }

    @property --ks-card-border-color-end {
        syntax: '<color>';
        initial-value: #2D344E;
        inherits: false;
    }

    @property --ks-card-border-color-start-hover {
        syntax: '<color>';
        initial-value: #9C90D300;
        inherits: false;
    }

    @property --ks-card-border-color-end-hover {
        syntax: '<color>';
        initial-value: #AC82D600;
        inherits: false;
    }

    .card-block{
        position: relative;
        @include media-breakpoint-up(lg){
            position: absolute;
            bottom: 450px;
            width: 300px;
            text-align: center;
        }
        border-radius: 2rem;
        padding: 1rem;
        margin: 2rem 0;
        padding-top: 1rem;
        background-color: rgb(26, 28, 35);
        background-image: linear-gradient(to bottom, #21242E99 0%, #1A1C2499 100%),
            linear-gradient(to right,#1A1C24 0%, #373a44 80%, #1A1C24 100%);
        background-size: cover, cover;
        background-clip: padding-box;
        h3{
            font-size: 1.2rem;
            font-weight: 500;
            margin-bottom: .5rem;
        }
        .description{
            color: #B9B9BA;
            font-size: .8rem;
            margin-top: .5em;
            margin-bottom: 0;
            overflow: hidden;
        }

        .main-link{
            display: block;
            white-space: nowrap;
            margin-top: 1rem;
            @include media-breakpoint-up(lg){
                transform: translateX(-250px);
                opacity: 0;
            }
            transition: all 0.3s;
            font-size: 1rem;
            color: #9C8FFF;
        }

        &:hover{
            .main-link{
                transform: translateX(0);
                opacity: 1;
            }
        }

        &:before {
            content: '';
            position: absolute;
            border-radius: inherit;
            top: 0; right: 0; bottom: 0; left: 0;
            z-index: -1;
            margin: -1px;
            transition: --ks-card-border-color-start 0.3s, --ks-card-border-color-end 0.3s, --ks-card-border-color-end-hover 0.3s, --ks-card-border-color-start-hover 0.3s;
            background-image:
                linear-gradient(to left, var(--ks-card-border-color-start) -2.35%, var(--ks-card-border-color-end) 80.15%),
                linear-gradient(to bottom, var(--ks-card-border-color-start-hover) 0%, var(--ks-card-border-color-end-hover) 100%);
            background-size: cover;
            background-position: center;
        }
        &:hover{
            &:before{
                --ks-card-border-color-start: #6B66D500;
                --ks-card-border-color-end: #2D344E00;
                --ks-card-border-color-start-hover: #9C90D350;
                --ks-card-border-color-end-hover: #AC82D6;
            }
        }
        .img-natural, .img-hover{
            float: left;
            width: 80px;
            height: 83px;
            @include media-breakpoint-up(lg){
                width: auto;
                float: none;
                margin: auto;
                margin-bottom: .5rem;
            }
        }
        .img-hover{
            display: none;
        }
        &:hover{
            .img-natural{
                display: none;
            }
            .img-hover{
                display: block;
            }
        }
    }
    @include media-breakpoint-up(lg){
        .left-card{
            left: 1rem;
        }
        .right-card{
            right: 1rem;
        }
        .bottom-card{
            left: 39%;
            bottom: 40px;
        }
    }
</style>