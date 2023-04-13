<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row mb-5">
                <div class="col-md-6 p-5">
                    <Section
                        title="Press Kit"
                        subtitle="Brand Assets"
                    >
                        <p>
                            For Media Inquiries and Exclusive Insights, Reach Out to Our Press Team at <a href="mailto:press@kestra.io">press@kestra.io</a>
                        </p>
                        <a href="https://drive.google.com/drive/folders/1nwf1BeIZqAGC9uPiq33W-nvDwXDK5tPR?usp=sharing" target="_blank" class="btn btn-lg btn-primary me-2">
                            Download assets
                        </a>

                    </Section>
                </div>
<!--                <div class="col-md-6 text-center monograme">-->
<!--                    <img src="/landing/company/presskit-logo.png" />-->
<!--                </div>-->
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
        background: url("/landing/company/presskit-logo.png") no-repeat center center, #F1F5FF;
        background-size: cover;
    }

    .container {
        padding-top: 0px;
        padding-bottom: 0px;
        margin-bottom: calc($spacer * -3);

        .col-md-6 {
            vertical-align: middle;
        }

        .monograme {
            padding-top: calc($spacer * 5);
            margin-top: calc($spacer * 5);
        }
    }
</style>