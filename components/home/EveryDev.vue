<template>
    <section class="wrapper-every-dev">
        <div class="center-block container">
            <div class="line-top"/>
            <h2>For <span>Every</span> Developer</h2>
            <div class="line-left"/>
            <div class="line-right"/>
            <div class="line-bottom"/>
            <p>Kestra unify all engineers, breaking down silos.</p>
        </div>
        <div class="container">
            <HomeCard class="left-card card-block">
                <NuxtImg width="117" height="120" src="/landing/home/every-software.png" alt="developers" class="img-natural"/>
                <NuxtImg width="117" height="120" src="/landing/home/every-software-hover.png" alt="developers" class="img-hover"/>
                <h3>Software Engineers</h3>
                <p class="description">
                    Version control all your resources, from workflows to users and permissions with CI/CD and Terraform Provider.
                </p>
                <NuxtLink href="/use-cases/software-engineers" class="main-link">Ship Workflows Like Your Code <ArrowRightIcon/></NuxtLink>
            </HomeCard>

            <HomeCard class="right-card card-block">
                <NuxtImg width="117" height="120" src="/landing/home/every-platform.png" alt="developers" class="img-natural"/>
                <NuxtImg width="117" height="120" src="/landing/home/every-platform-hover.png" alt="developers" class="img-hover"/>
                <h3>Platform Engineers</h3>
                <p class="description">
                    Automate infrastructure tasks, manage dependencies, and ensure operational consistency.
                </p>
                <NuxtLink href="/use-cases/platform-engineers" class="main-link">Take Control of Your Platform Ops <ArrowRightIcon/></NuxtLink>
            </HomeCard>

            <HomeCard class="bottom-card card-block">
                <NuxtImg width="117" height="120" src="/landing/home/every-data.png" alt="developers" class="img-natural"/>
                <NuxtImg width="117" height="120" src="/landing/home/every-data-hover.png" alt="developers" class="img-hover"/>
                <h3>Data Engineers</h3>
                <p class="description">
                    Build reliable  data pipelines with on-demand infrastructure that scales on-demand whether in Cloud or on-prem.
                </p>
                <NuxtLink href="/use-cases/data-engineers" class="main-link">Pipelines You Can Count On <ArrowRightIcon/></NuxtLink>
            </HomeCard>
        </div>
    </section>
</template>

<script setup>
import ArrowRightIcon from 'vue-material-design-icons/ArrowRight.vue';
</script>


<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .wrapper-every-dev {
        padding: 1rem;
        margin-top: -4rem;
        color: white;

        background-image: linear-gradient(0deg, #0D0E13FF 0%, #0D0E1388 10%, #0D0E1300 30%, #0D0E1300 100%);
        background-repeat: no-repeat;
        background-position: center bottom;
        background-size: cover;
        @include media-breakpoint-up(md){
            padding: 2rem;
            background-image: linear-gradient(0deg, #0D0E13FF 0%, #0D0E1388 10%, #0D0E1300 30%, #0D0E1300 100%), url(/landing/home/every-bg-dots.svg), radial-gradient(ellipse at center, #000 0%, rgba(70, 69, 100, 0) 100%);
            background-blend-mode: normal, luminosity, normal;
            background-repeat: no-repeat, no-repeat, no-repeat;
            background-position: center bottom, center bottom, center bottom;
            background-size: cover, cover, cover;
        }
        .container{
            position: relative;
            @include media-breakpoint-up(lg){
                height: 400px;
            }
            z-index: 1;
        }
        .center-block {
            height: auto;
            padding-top: 4rem;
            position: relative;
            @include media-breakpoint-up(lg){
                text-align: center;
                padding-top: 230px;
                height: 540px;
                width: 500px;
                margin: 0 auto;
            }
        }
    }

    .center-block {
        h2 {
            font-size: 2rem;
            line-height: 3rem;
            color: white;
            font-weight: 600;
            @include media-breakpoint-up(lg){
                width: 300px;
                margin-left: auto;
                margin-right: auto;
            }
            span {
                background: linear-gradient(90deg, #7C2EEA 0%, #658AF9 100%) no-repeat center;
                background-size: cover;
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
            left: 14%;
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
                width: 95px;
                transform: translate(-130px, 45px);
                height: 1px;
                background: linear-gradient(to right, transparent 50%, #191e27 50%), linear-gradient(to left, #190930 0%, #658AF9 100%);
                background-size: 4px 4px, cover;
            }
            .line-right{
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100px;
                transform: translate(128px, 45px);
                height: 1px;
                background: linear-gradient(to right, transparent 50%, #191e27 50%), linear-gradient(to right, #190930 0%, #658AF9 100%);
                background-size: 4px 4px, cover;
            }
            .line-bottom{
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 1px;
                height: 130px;
                background: linear-gradient(to bottom, transparent 50%, #191e27 50%), linear-gradient(to bottom, #190930 0%, #658AF9 100%);
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
        display: grid;
        grid-template-columns: 90px 1fr;
        border-radius: 2rem;
        padding: 1rem;
        margin: 2rem 0;
        border: none;
        @include media-breakpoint-up(lg){
            display: block;
            position: absolute;
            bottom: 450px;
            width: 320px;
            text-align: center;
            padding: 1rem 2rem;
        }
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
            grid-column: 2;
        }

        .main-link{
            white-space: nowrap;
            margin-top: 1rem;
            transition: all 0.3s;
            font-size: .8rem;
            color: #9C8FFF;
            display: block;
            grid-column: 2 / 3;
            @include media-breakpoint-up(lg){
                grid-column: 1 / 3;
                text-align: center;
                transform: translateX(-100px);
                opacity: 0;
            }
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
            width: 80px;
            height: auto;
            grid-row: 1 / span 2;
            @include media-breakpoint-up(lg){
                width: 120px;
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
            left: 34%;
            bottom: 75px;
        }
    }
    @include media-breakpoint-up(xl){
        .bottom-card{
            left: 37%;
        }
    }
</style>