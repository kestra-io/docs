<template>
    <div class="card-block">
        <div v-for="feat of features" class="block-content">
            <div class="clipper">
                <div class="block">
                    <img :src="feat.icon" alt="Feature Icon"/>
                </div>
            </div>
            <h3 :style="{textDecorationColor: feat.color}">{{ feat.name }}</h3>
            <p>{{ feat.description }}</p>
        </div>
        <div class="block-center-image">
            <img src="@/assets/images/homepage/features-cube.svg" alt="Feature Container"/>
            <img src="@/assets/images/homepage/features-kestra.svg" alt="Kestra Monogram" class="kestra-logo" />
        </div>
    </div>
</template>

<script setup lang="ts">
import APIIcon from "@/assets/images/homepage/features-api.svg";
import CloudIcon from "@/assets/images/homepage/features-cloud.svg";
import CogIcon from "@/assets/images/homepage/features-cog.svg";
import LogosIcon from "@/assets/images/homepage/features-Logos.svg";

const features = [
    {
        name: "Connect to Any API or Service",
        description: "Automating everything from data pipelines, microservices, business processes to infrastructure provisioning.",
        icon: APIIcon,
        color: "#E58238",
    },
    {
        name: "Deploy Anywhere",
        description: "Run Kestra anywhere—on-prem, hybrid, or any cloud, no dependencies, no installation headaches.",
        icon: CloudIcon,
        color: "#3991FF",
    },
    {
        name: "Build Everything As Code & From the UI",
        description: "Empower every team members to collaborate from a single tool—code for developers, UI for everyone else, all in sync.",
        icon: CogIcon,
        color: "#21CE9C",
    },
    {
        name: "Write Business Logic in Any Language",
        description: "Orchestrate custom business logic in Python, R, Java, Julia, Ruby, and any kind of language.",
        icon: LogosIcon,
        color: "#FCE07C",
    }
]
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .card-block {
        position: relative;
        background: linear-gradient(180deg, #21242E 0%, #1A1C24 100%);
        border-radius: 1rem;
        box-shadow: 0px 12px 24px 8px #00000017;
        padding: 6rem;
        margin: 2rem 0;
        display: grid;
        grid-template-columns: 1fr 220px 1fr;
        gap: 3rem;
    }

    .block-center-image{
        background: url(@/assets/images/homepage/features-bg.svg) no-repeat center;
        grid-column: 2 / 3;
        grid-row: 1 / 3;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        .kestra-logo{
            position: absolute;
            width: 50px;
            top: 39%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: all 0.2s;
        }
    }

    .block-content{
        text-align: left;
        h3{
            font-size: 1.2rem;
            line-height: 1.4rem;
            text-underline-offset: 20%;
            text-decoration: underline;
            text-decoration-thickness: 4px;
            filter: grayscale(1);
        }
        &:nth-child(2n + 1){
            text-align:right;
        }
        &:hover{
            h3{
                filter: none;
            }
        }
        .clipper{
            position: absolute;
            z-index: 1;
            left: 50%;
            top: 50%;
            clip-path: polygon(-212% -128%, 201% -135%, -4% 6%);
            height: 100px;
            width: 100px;
            .block{
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                left: -50px;
                width: 100%;
                height: 100%;
                transition: transform 0.2s;
            }
        }

        &:hover{
            .block{
                transform: translateY(-83px);
            }
        }

        // on hover, hide all siblings with the class block-center-image
        &:hover ~ .block-center-image .kestra-logo{
            opacity: 0;
            transform: translate(-50%, 0);
        }
    }

</style>