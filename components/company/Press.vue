<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row mb-5">
                <div class="col-md-6 p-5">
                    <Section
                        title="Press Kit"
                        subtitle="Brand Assets"
                    >
                        <p class="mb-5" data-aos="fade-right">
                            For Media Inquiries and Exclusive Insights, Reach Out to Our Press Team at <a href="mailto:press@kestra.io">press@kestra.io</a>
                        </p>
                        <a href="https://drive.google.com/drive/folders/1nwf1BeIZqAGC9uPiq33W-nvDwXDK5tPR?usp=sharing" target="_blank" class="btn btn-primary me-2" data-aos="zoom-in">
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
        background: url("/landing/company/presskit-logo.svg") no-repeat center center $purple-29;
        background-size: cover;
    }

    .container {
        padding-top: 0;
        padding-bottom: 0;
        margin-bottom: calc($spacer * -3);

        .col-md-6 {
            vertical-align: middle;
        }

        :deep(section) {
            .subtitle, h2 {
                text-align: left;
            }
        }
    }
</style>