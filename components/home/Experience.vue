<template>
    <section class="container">
        <h2>
            The Orchestration Experience
            <span>You Have Been Looking For</span>
        </h2>
        <NuxtLink href="docs/getting-started/quickstart#start-kestra" target="_blank" class="btn btn-md btn-primary">Get Started</NuxtLink>

        <div class="tabs">
            <div class="activeMarker" :style="{left:`${displayTab * 25}%`}"/>
            <button v-for="tab, index in tabs" :key="tab.label" class="tab" :class="{tabActive: index === displayTab}" @click="setTab(index)">
                {{ tab.label }}
            </button>
        </div>
        <div class="slide-container">
            <TransitionGroup name="slide">
                <NuxtImg width="1096" height="590" :key="displayTab" :src="tabs[displayTab].imageSrc" alt="Experience" class="experience-image" :class="{isSlidingToLeft}"/>
            </TransitionGroup>
        </div>
    </section>
</template>

<script lang="ts" setup>

const tabs = [
    {
        label: "CI/CD for all your Workflows",
        imageSrc: "/landing/home/tabs/cd.png",
    },
    {
        label: "No Code, Low Code, Full Code",
        imageSrc: "/landing/home/tabs/no-code.png",
    },
    {
        label: "Revision History & Rollback",
        imageSrc: "/landing/home/tabs/revisions.png",
    },
    {
        label: "Alerting & Infrastructure Monitoring",
        imageSrc: "/landing/home/tabs/alerting.png",
    }
]

const displayTab = ref(0)
const isSlidingToLeft = ref(false)

function setTab(index: number) {
    if (index === displayTab.value) {
        return;
    }
    isSlidingToLeft.value = index < displayTab.value;
    nextTick(() => {
        displayTab.value = index;
    })
}

</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .container {
        display: none;
        @include media-breakpoint-up(lg){
            display: block;
        }
        text-align: center;
        position: relative;
        h2 {
            color: white;
            font-size: 3rem;
            font-weight: 600;
            margin-bottom: 20px;
            text-align: center;
            span {
                display: block;
                color: #8405FF;
                background: linear-gradient(90deg, #7C2EEA 0%, #658AF9 100%) no-repeat center;
                background-size: cover;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
    }
    .experience-image {
        margin-top: 1rem;
        transform: translateX(0);
    }

    .tabs {
        position: relative;
        margin-top: 2rem;
        border-bottom: 1px solid #4C4C4C;
        .activeMarker{
            position: absolute;
            height: 1px;
            width: 25%;
            background: #8405FF;
            left: 0;
            bottom: -1px;
            z-index: 1;
            transition: all 0.3s;
        }
    }

    .tab {
        border: none;
        background: none;
        color: #B9B9BA;
        width: 25%;
        padding: 1rem 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .tabActive {
        color: white;
    }

    .slide-container{
        mask-image: linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent);
        padding: 0 1rem;
    }

    .slide-enter-active,
    .slide-leave-active {
        transition: transform .5s ease-in-out;
    }

    .slide-leave-to,
    .slide-enter-from{
        position: absolute;
    }
    .slide-leave-to{
        transform: translateX(-100%);
        &.isSlidingToLeft{
            transform: translateX(100%);
        }
    }
    .slide-enter-from{
        transform: translateX(100%);
        &.isSlidingToLeft{
            transform: translateX(-100%);
        }
    }
</style>