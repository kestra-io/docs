<template>
    <div class="container">
        <div class="left-box">
            <p class="pre-title">Ready to see it in action?</p>
            <h2>Jump in</h2>

            <p class="description">Install Kestra Open-Source and get your first workflow ready in less than 5 minutes.</p>
            <NuxtLink href="/docs/getting-started/quickstart#start-kestra" class="btn btn-secondary">Get Started</NuxtLink>
        </div>
        <div class="right-box">
            <NuxtImg src="/landing/home/logo-cta.svg" alt="CTA" class="logo-cta"/>
            <p class="pre-title">Schedule a meeting</p>
            <h2>Let's meet</h2>
            <p class="description">Connect with our product specialists and discuss your project requirements.</p>
            <NuxtLink href="/demo" class="btn btn-primary">Talk to us</NuxtLink>
        </div>
    </div>
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
    .left-box,
    .right-box{
        position: relative;
        padding: 4rem 2rem;
        border-radius: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        margin: 2rem 0;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: #20222A;
        h2{
            font-size: 2rem;
            font-weight: 500;
            margin: 1rem 0;
        }
        .description{
            font-size: 1.2rem;
            margin-bottom: 2rem;
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