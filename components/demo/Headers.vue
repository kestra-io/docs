<template>
  <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-12 col-md-5 d-flex align-items-center">
                    <div class="schedule-demo">
                        <h1>Connect with <br>our Product <span>Specialists</span></h1>
                        <p class="description"> Evaluate Kestra Enterprise, made for organizations seeking to secure production workloads with high-security standards and enterprise support</p>
                    </div>
                </div>
                <div class="col-12 col-md-6 align-items-center d-flex">
                    <div class="meetings-iframe-container" data-src="https://meetings-eu1.hubspot.com/meetings/david76?embed=true"></div>
                </div>
            </div>
        </div>
        <div class="container pt-3 pb-5 companies-block">
            <Companies />
        </div>
    </div>
</template>

<script setup>
import Companies from "../layout/Companies.vue";

onMounted(() => {
    if (process.client) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
        document.body.appendChild(script);
    }
})

</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";
.container-fluid {
    color: var(--bs-white);
    overflow: hidden;

    .hero {
        padding-top: 4rem !important;
        padding-bottom: 0;
        .schedule-demo {
            color: $white;

            h1 {
                margin-bottom: 16px;
                font-size: $font-size-4xl;
                font-weight: 300;

                span {
                    background: var(--Text_gradient, linear-gradient(90deg, #E151F7 2.16%, #5C47F5 65.09%));
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }
            p.description {
                font-size: $font-size-xl;
                font-weight: 300;
            }
        }

        .meetings-iframe-container {
            width: 100%;
        }
    }

    .companies-block {
        border-top: $block-border;
        border-bottom: $block-border;
    }
}
</style>