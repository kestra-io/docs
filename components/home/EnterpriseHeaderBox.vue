<template>
    <div class="enterprise-header-box">

        <NuxtImg class="box-right" width="558px" height="432px" src="/landing/home/EnterpriseHeader.svg" alt="enterprise"/>
        <div class="box-left">
            <h2>Scale With Kestra <span>Enterprise Edition</span></h2>
            <p>Built for Enterprises and SMBs</p>
            <ul>
                <li>Governance</li>
                <li>Security</li>
                <li>Scalability</li>
                <li>Enterprise Support with SLA</li>
            </ul>
            <div class="cta">
                <a href="/demo" class="btn btn-primary">Talk to Sales</a>
                <a href="/enterprise" class="learn-more">Learn More <ArrowRightIcon/></a>
            </div>
        </div>
        <a href="/enterprise" class="learn-more">Learn More <ArrowRightIcon/></a>
    </div>
</template>

<script lang="ts" setup>
    import ArrowRightIcon from "vue-material-design-icons/ArrowRight.vue";
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .enterprise-header-box {
        position: relative;
        z-index: 1;
        background-color: white;
        text-align: left;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: space-between;
        padding: 1rem;
        row-gap: 2rem;
        max-width: 1140px;
        margin: 0 auto;
        @include media-breakpoint-up(lg){
            padding: 4rem;
            flex-direction: row-reverse;
            align-items: center;
            gap: 1rem;
        }
        border: 1px solid #E3E3E3;
        border-radius: 1rem;

        .box-right{
            width: 100%;
            height: auto;
            max-width: 558px;
        }

        .box-left{
            @include media-breakpoint-up(lg){
                width: 350px;
                flex-shrink:0;
            }

            p{
                color: #3d3d3f;
            }

            ul{
                padding-left: 0;
            }

            li{
                list-style: none;
                background: url('/landing/home/purple-check.svg') no-repeat 0 0;
                padding-left: 32px;
                margin: .5rem 0;
            }
            .cta{
                display: flex;
                gap: 1rem;
                align-items: center;
                .learn-more{
                    display: block;
                    @include media-breakpoint-up(lg){
                        display: none;
                    }
                }
            }
        }

        h2 {
            font-size: 2.2rem!important;
            font-weight: 600;
            margin-bottom: 1rem;
            max-width: 100%;

            span {
                background: linear-gradient(90deg, #7C2EEA 0%, #658AF9 100%) no-repeat center;
                background-size: cover;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        .learn-more{
            color: #646465;
            text-decoration: none;
            font-size: 14px;
        }

        > .learn-more{
            position: absolute;
            bottom: 1.5rem;
            right: 4rem;
            display: none;
            @include media-breakpoint-up(lg){
                display: block;
            }
        }
    }
</style>