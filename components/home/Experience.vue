<template>
    <div class="container">
        <h2>
            The Orchestration Experience
            <span>You Have Been Looking For</span>
        </h2>
        <a href="#" class="btn btn-primary">Kestra Live Demo</a>

        <div class="tabs">
            <div class="activeMarker" :style="{left:`${displayTab * 25}%`}"/>
            <button v-for="tab, index in tabs" :key="tab.label" class="tab" :class="{tabActive: index === displayTab}" @click="displayTab = index">
                {{ tab.label }}
            </button>
        </div>

        <NuxtImg width="1296" height="686" v-for="tab, index in tabs" v-show="index === displayTab" :src="tab.imageSrc" alt="Experience" class="experience-image"/>
    </div>
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
</script>

<style lang="scss" scoped>
    .container {
        text-align: center;
        h2 {
            color: white;
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 20px;
            text-align: center;
            span {
                display: block;
                color: #8405FF;
                background: linear-gradient(90deg, #7C2EEA 0%, #658AF9 100%) no-repeat center;
                background-size: 480px;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
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
    }

    .tabActive {
        color: white;
    }
</style>