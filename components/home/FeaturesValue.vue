<template>
    <div class="value-wrapper">
        <div class="card-block">
            <h3><span>Accelerate</span><br/> Time to Value</h3>
            <p>Deliver in days what took once weeks</p>
            <div class="kpi-wrapper">
                <div class="kpi" v-for="value in valueSet" :key="value.subject">
                    <span class="subject">{{ value.subject }}</span>
                    <span class="kpi-number">{{ value.kpi }}</span>
                    <p class="kpi-description">{{ value.description }}</p>
                </div>
            </div>
        </div>
        <div class="card-block">
            <img src="@/assets/images/homepage/any-spider.svg" alt="Any orchestration" class="spider" />
            <h3><span>Any Orchestration</span><br/> use Case</h3>
        </div>
    </div>
</template>

<script setup lang="ts">

const valueSet = [
    {
        subject: "Productivity",
        description: "Faster Workflow Completion",
        kpi: "10x"
    },
    {
        subject: "Efficiency",
        description: "Boost in Team Efficiency",
        kpi: "80%"
    },
    {
        subject: "Profitability",
        description: "Reduction in Operational Cost",
        kpi: "100%"
    },
    {
        subject: "Time to Market",
        description: "Deployment Speed",
        kpi: "5x"
    }
]
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .card-block {
        position: relative;
        background:
            linear-gradient(180deg, #21242E99 0%, #1A1C2499 100%),
            linear-gradient(90deg,#1A1C24 0%, #373a44 50%, #1A1C24 100%);
        border-radius: 1rem;
        box-shadow: 0px 12px 24px 8px #00000017;
        padding: 2rem 0 4rem;
        h3 {
            margin: 2rem 0;
            font-size: 2.2rem;
            font-weight: 700;
            margin-bottom: .5rem;
            span {
                color: $primary;
                background: linear-gradient(90deg, #7C2EEA 0%, #658AF9 100%) no-repeat center;
                background-size: 350px;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
    }
    .spider {
        width: 100%;
        margin: 0 auto;
        display: block;
    }

    .kpi-wrapper{
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin: 0 2rem;
        @include media-breakpoint-up(md){
            margin: 0 4rem;
        }
        position: relative;
        z-index: 1;
        margin-top: 2rem;
        .kpi{
            padding: 1rem;
            border-radius: 1rem;
            border: 1px solid transparent;
            text-align: left;
            position: relative;
            background-color: #080808EE;
            background-clip: padding-box;
            &:before {
                content: '';
                position: absolute;
                border-radius: inherit;
                top: 0; right: 0; bottom: 0; left: 0;
                z-index: -1;
                margin: -1px;
                background-image: linear-gradient(to bottom, #9C90D350 0%, #AC82D6 100%);
            }
            .subject{
                display: block;
                font-size: .7rem;
                @include media-breakpoint-up(md){
                    font-size: .9rem;
                }
                font-weight: 400;
                text-transform: uppercase;
                color: #8B8B8D;
            }
            .kpi-number{
                color: #817CFF;
                font-size: 2.5rem;
                @include media-breakpoint-up(md){
                    font-size: 3.5rem;
                }
                font-weight: 700;
                margin: .5rem 0;
            }
            .kpi-description{
                font-size: .7rem;
                @include media-breakpoint-up(md){
                    font-size: .9rem;
                }
                font-weight: 500;
                margin:0;
            }
        }
    }

    .value-wrapper{
        margin-top: 2rem;
        gap: 2rem;
        display: grid;
        @include media-breakpoint-up(lg){
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>