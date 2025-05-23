<template>
    <HomeCard class="card-block">
        <div v-for="feat, index of features" class="block-content">
            <div class="clipper">
                <div class="img-block">
                    <NuxtImg :src="feat.icon" :width="feat.width" alt="Feature Icon"/>
                </div>
            </div>
            <div class="arrow-box">
                <svg class="arrow" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" :style="{transform: `rotate(${(index-1) * 90}deg)`}">
                    <defs>
                        <linearGradient :id="`paint0_linear_16542_24769-${index}`" x1="15.4718" y1="108.948" x2="16.5015"
                            y2="85.3637" gradientUnits="userSpaceOnUse">
                            <stop :stop-color="feat.color" />
                            <stop offset="1" :stop-color="feat.color" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                    <g>
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M103.188 5.98243C103.642 6.2968 103.755 6.91975 103.441 7.37383L98.3178 14.7736C98.0034 15.2276 97.3804 15.3409 96.9264 15.0265C96.4723 14.7122 96.359 14.0892 96.6734 13.6351L100.399 8.25395C80.4858 12.3632 62.2087 22.2643 47.8782 36.7393C34.1996 50.5557 24.724 67.9259 20.4905 86.8298C22.447 87.6201 23.8274 89.5373 23.8274 91.7769C23.8274 94.7225 21.4396 97.1103 18.4941 97.1103C15.5486 97.1103 13.1608 94.7225 13.1608 91.7769C13.1608 88.8314 15.5486 86.4436 18.4941 86.4436C18.5052 86.4436 18.5164 86.4436 18.5275 86.4437C22.8373 67.154 32.5012 49.4286 46.4569 35.3321C61.0892 20.5524 79.7579 10.4505 100.096 6.2744L94.6495 2.50392C94.1954 2.18956 94.0822 1.56661 94.3965 1.11252C94.7109 0.658437 95.3339 0.545173 95.7879 0.859539L103.188 5.98243Z"
                            :fill="feat.color" />
                    </g>
                    <g>
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M11.0312 82.6158C5.86929 86.7375 5.02598 94.2633 9.14763 99.4253C13.2693 104.587 20.7951 105.431 25.9571 101.309C31.119 97.1872 31.9623 89.6614 27.8406 84.4994C23.719 79.3375 16.1932 78.4942 11.0312 82.6158ZM10.4073 81.8344C4.81374 86.3006 3.89992 94.4557 8.36618 100.049C12.8324 105.643 20.9875 106.557 26.581 102.09C32.1745 97.624 33.0884 89.469 28.6221 83.8755C24.1558 78.2819 16.0008 77.3681 10.4073 81.8344Z"
                            :fill="`url(#paint0_linear_16542_24769-${index})`" />
                    </g>
                </svg>
            </div>
            <h3 :style="{textDecorationColor: feat.color}">{{ feat.name }}</h3>
            <p>{{ feat.description }}</p>
        </div>
        <div class="block-center-image">
            <img src="/landing/home/features-cube.svg" alt="Feature Container"/>
            <img src="/landing/home/features-kestra.svg" alt="Kestra Monogram" class="kestra-logo" />
        </div>
    </HomeCard>
</template>

<script setup lang="ts">
const features = [
    {
        name: "Deploy Anywhere",
        description: "Run Kestra anywhere—on-prem, hybrid, or any cloud, no dependencies, no installation headaches.",
        icon: "/landing/home/features-cloud.svg",
        color: "#3991FF",
        width: 69,
    },
    {
        name: "Connect to Any API or Service",
        description: "Automating everything from data pipelines, microservices, business processes to infrastructure provisioning.",
        icon: "/landing/home/features-api.svg",
        color: "#E58238",
        width: 50,
    },
    {
        name: "Build Everything As Code & From the UI",
        description: "Empower every team members to collaborate from a single tool—code for developers, UI for everyone else, all in sync.",
        icon: "/landing/home/features-cog.svg",
        width: 60,
        color: "#21CE9C",
    },
    {
        name: "Write Business Logic in Any Language",
        description: "Orchestrate custom business logic in Python, R, Java, Julia, Ruby, and any kind of language.",
        icon: "/landing/home/features-logos.svg",
        color: "#FCE07C",
        width: 123,
    },
]
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .card-block {
        position: relative;
        z-index: 1;
        margin-top: 2rem;
        display: grid;
        grid-template-columns: 1fr;
        padding: 2rem;
        gap: 1rem;
        @include media-breakpoint-up(lg){
            padding: 6rem 3rem;
            grid-template-columns: 1fr 270px 1fr;
            gap: 3rem;
            row-gap: 0;
        }
    }

    .block-center-image{
        background: url(/landing/home/features-bg.svg) no-repeat center;
        grid-row: 1 / 2;
        @include media-breakpoint-up(lg){
            grid-column: 2 / 3;
            grid-row: 1 / 3;
            margin: 0;
        }
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        margin: 5rem 0;

        .kestra-logo{
            position: absolute;
            width: 60px;
            @include media-breakpoint-up(lg){
                top: calc(50% - 30px);
            }
            left: 50%;
            transform: translate(-50%, -50%);
            transition: all 0.2s;
        }
    }

    .block-content{
        text-align: left;
        h3{
            font-size: 1.1rem;
            line-height: 1.5em;
            text-underline-offset: 20%;
            text-decoration: underline;
            text-decoration-thickness: 4px;
            text-wrap: pretty;
            font-weight: 400;
        }
        p{
            color: #B9B9BA;
            margin-top: .5em;
            font-size: .9rem;
        }
        .clipper img {
            height: 3rem;
            @include media-breakpoint-down(lg){
                width: auto;
            }
            margin-left: -.5rem;
        }

        .arrow-box {
            position: absolute;
            width: 250px;
            height: 250px;
            top: 190px;
            left: 49.5%;
            transform: translate(-54%, -55%);
            @include media-breakpoint-up(lg){
                top:52%;
            }
            @include media-breakpoint-up(xxl){
                top:50%;
            }
        }
        .arrow {
            position: relative;
            transform-origin: 55% 50%;
            width: 100%;
            height: 100%;
            filter: grayscale(1);
        }

        &:hover{
            .arrow{
                filter: none;
            }
        }

        @include media-breakpoint-up(lg){
            h3{
                filter: grayscale(1);
                font-size: 1.1rem;
                line-height: 2em;
            }
            &:nth-child(1){
                text-align: right;
                grid-area: 2 / 1;
            }
            &:nth-child(2){
                text-align: right;
                grid-area: 1 / 1;
            }
            // move the third block to make a circle
            &:nth-child(4){
                grid-area: 2 / 3;
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
                top: 52%;
                // this polygon makes the image appear like they are
                // coming out of the box
                clip-path: polygon(-212% -128%, 201% -135%, 1.00% -8.00%);
                height: 100px;
                width: 100px;
                .img-block{
                    display: flex;
                    justify-content: center;
                    align-items: end;
                    position: absolute;
                    left: -45px;
                    width: 100%;
                    height: 100%;
                    img{
                        height: auto;
                    }
                }
            }

            &:hover{
                .img-block{
                    animation-duration: .3s;
                    animation-name: bounce-up;
                    animation-timing-function: ease;
                    animation-iteration-count: 1;
                    transform: translateY(-109px);
                }
            }

            // on hover, hide all siblings with the class block-center-image
            &:hover ~ .block-center-image .kestra-logo{
                opacity: 0;
                transform: translate(-50%, 0);
            }
        }
    }

    @keyframes bounce-up {
        0% {
            transform: translateY(0);
        }
        80% {
            transform: translateY(-120px);
        }
        100% {
            transform: translateY(-109px);
        }
    }

</style>