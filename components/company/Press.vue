<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row mb-5">
                <div class="col-md-6 p-5">
                    <Section
                        title="Brand Assets"
                    >
                        <p class="mb-3" data-aos="fade-right">
                            For Media Inquiries and Exclusive Insights, Reach Out to Our Press Team at <a href="mailto:press@kestra.io">press@kestra.io</a>
                        </p>
                        <a href="https://drive.google.com/drive/folders/1nwf1BeIZqAGC9uPiq33W-nvDwXDK5tPR?usp=sharing" target="_blank" class="btn btn-animated btn-purple-animated me-2" data-aos="zoom-in">
                            Download assets
                        </a>
                    </Section>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Section from '../../components/layout/Section.vue';
    export default {
        components: {Section}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: url("/landing/company/presskit-logo.svg") no-repeat center center;
        background-size: cover;
        margin-bottom: 5.625rem;
    }

    .container {
        padding-top: 0;
        padding-bottom: 0;
        margin-bottom: calc($spacer * -3);
        border-bottom: $block-border;
        border-top: $block-border;

        .col-md-6 {
            vertical-align: middle;
        }

        :deep(section) {
            h2 {
                color: $white;
                font-size: $h2-font-size;
                font-weight: 300;
                text-align: left;
                margin-top: 3rem;
            }

            .main {
                padding-top: 1.354rem;

                p {
                    color: $white;
                    font-size: $h6-font-size;
                    font-weight: 400;

                    a {
                        color: $purple-35;
                    }
                }
            }
        }
    }
</style>