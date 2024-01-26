<template>
    <div class="header-container">
        <div class="header container d-flex flex-column align-items-center gap-3">
            <h1 data-aos="fade-left">Join our <span>Team</span></h1>
            <h4 data-aos="fade-right">Join our team and drive innovation in a collaborative environment</h4>
            <NuxtLink :href="(route.fullPath === '/careers' ? '' : '/careers') + '#positions'" class="btn btn-animated btn-purple-animated" data-aos="zoom-in">
                Open positions
            </NuxtLink>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .header-container {
        margin-top: $rem-6;
        background: url("/landing/careers/bg.svg") no-repeat top;
        .header {
            padding-bottom: calc($spacer * 4.125);
            border-bottom: 1px solid rgba(255, 255, 255, 0.10);

            h1, h4 {
                color: $white;
                text-align: center;
                font-weight: 300;
                margin-bottom: 0;
            }

            h1 {
                font-size: $font-size-4xl;

                span {
                    background: linear-gradient(90deg, #E151F7 58.97%, #5C47F5 85.36%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }

            h4 {
                font-size: $font-size-xl;
            }
        }

    }
</style>
<script setup lang="ts">
    const route = useRoute()
</script>