<template>
    <section class="enterprise-header-box container">
        <NuxtImg class="box-right" v-bind="enterpriseHeader" alt="enterprise" />
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
                <a href="/demo" class="btn btn-lg btn-primary">Talk to Sales</a>
                <a href="/enterprise" class="learn-more">Learn More <ArrowRightIcon /></a>
            </div>
        </div>
        <a href="/enterprise" class="learn-more">Learn More <ArrowRightIcon /></a>
    </section>
</template>

<script lang="ts" setup>
    import ArrowRightIcon from "vue-material-design-icons/ArrowRight.vue"
    import enterpriseHeader from "./assets/EnterpriseHeader.svg"
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";
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
        margin: 0 auto;
        @include media-breakpoint-up(lg) {
            padding: 4rem;
            flex-direction: row-reverse;
            align-items: center;
            gap: 1rem;
        }
        border: 1px solid #e3e3e3;
        border-radius: 1rem;

        .box-right {
            width: 100%;
            height: auto;
            @include media-breakpoint-up(lg) {
                width: 50%;
                max-width: 432px;
            }
            @include media-breakpoint-up(xl) {
                width: 50%;
                max-width: 558px;
            }
        }

        .box-left {
            @include media-breakpoint-up(lg) {
                width: 350px;
                flex-shrink: 0;
            }

            p {
                color: #3d3d3f;
            }

            ul {
                padding-left: 0;
            }

            li {
                list-style: none;
                background: url("./assets/purple-check.svg") no-repeat 0 0;
                padding-left: 32px;
                margin: 0.5rem 0;
            }
            .cta {
                display: flex;
                gap: 1rem;
                align-items: center;
                .learn-more {
                    display: block;
                    @include media-breakpoint-up(lg) {
                        display: none;
                    }
                }
            }
        }

        h2 {
            font-size: 2rem;
            @include media-breakpoint-up(lg) {
                font-size: 2.5rem !important;
            }
            font-weight: 600;
            margin-bottom: 1rem;
            max-width: 100%;

            span {
                display: block;
                @include media-breakpoint-up(lg) {
                    display: inline;
                }
                background: linear-gradient(90deg, #7c2eea 0%, #658af9 100%) no-repeat center;
                background-size: cover;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        .learn-more {
            color: #646465;
            text-decoration: none;
            font-size: 14px;
            position: relative;
            transition: color 0.3s ease;

            .arrow-right-icon {
                transition: transform 0.3s ease;
                position: absolute;
                bottom: 4px;
                @include media-breakpoint-up(md) {
                    bottom: 5px;
                }
                margin-left: 4px;
            }

            &:hover {
                color: #7c2eea;
                .arrow-right-icon {
                    transform: translateX(4px);
                }
            }
        }

        > .learn-more {
            position: absolute;
            bottom: 1.5rem;
            right: 4rem;
            display: none;
            @include media-breakpoint-up(lg) {
                display: block;
            }
        }
    }
</style>