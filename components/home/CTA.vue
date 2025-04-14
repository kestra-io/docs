<template>
    <section class="container">
        <HomeCard class="side-box">
            <p class="pre-title">Ready to see it in action?</p>
            <h2>Jump in</h2>

            <p class="description">Install Kestra Open-Source and get your first workflow ready in less than 5 minutes.</p>
            <NuxtLink href="/docs/getting-started/quickstart#start-kestra" class="btn btn-md btn-secondary">Get Started</NuxtLink>
        </HomeCard>
        <HomeCard class="side-box side-box-purple">
            <NuxtImg src="/landing/home/logo-cta.svg" alt="CTA" class="logo-cta"/>
            <p class="pre-title">Schedule a meeting</p>
            <h2>Let's meet</h2>
            <p class="description">Connect with our product specialists and discuss your project requirements.</p>
            <NuxtLink href="/demo" class="btn btn-md btn-primary">Talk to us</NuxtLink>
        </HomeCard>
    </section>
</template>

<style lang="scss" scoped>
@import "../../assets/styles/variable";
.container{
    @include media-breakpoint-up(lg){
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }
    margin: 2rem auto;
    color: white;
    .pre-title{
        font-size: .9rem;
        text-transform: uppercase;
        font-weight: 300;
    }
    .side-box{
        position: relative;
        z-index: 1;
        padding: 4rem 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        margin: 1.5rem 0;
        h2{
            font-size: 1.5rem;
            font-weight: 500;
            margin: .5rem 0;
        }
        .description{
            font-size: 1rem;
            margin-bottom: 2rem;
        }
        .pre-title{
            font-family: "Source Code Pro", monospace;
            margin-bottom: .5rem;
        }
    }
    .side-box-purple{
        border-color: #A950FF;
        .pre-title{
            color: #CD88FF;
        }
    }
    .logo-cta{
        position: absolute;
        top: -20px;
        right: -70px;
        width: 250px;
        @include media-breakpoint-up(lg){
            top: -40px;
            right: -80px;
            width: 220px;
        }
    }
}
</style>