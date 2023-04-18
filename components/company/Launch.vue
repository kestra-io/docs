<template>
    <div class="container-fluid">
        <div class="hero container text-center">
            <h2>The Public Launch and Beyond</h2>
            <p>
                Our commitment to excellence remains unwavering, and we are excited to see how Kestra will transform the way organizations approach data orchestration and automation.
            </p>
            <p>
                We believe that Kestra's potential is limitless, and we are eager to explore new opportunities and partnerships as we move forward.
            </p>
        </div>
        <div class="container-fluid pb-5">
            <Companies :inverted="true" />
    </div>
    <div class="container-fluid">
        <div class="companies">
            <template v-for="img in companies">
                <img
                    :src="'/landing/enterprise/companies/' + img  + '.svg'"
                    :alt="'Logo ' + img"
                />
            </template>
        </div>
    </div>
</template>

<script>
    import Companies from "../layout/Companies.vue";

    export default {
        components: {Companies}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: #F1F5FF;

        .companies-title {
            position: relative;

            &:after {
                content: '';
                position: absolute;
                left: 50%;
                top: 2.5rem;
                display: inline-block;
                height: 2px;
                width: 51px;
                background: var(--bs-pink);
            }
        }
    }

    .hero {
        h2 {
            font-size: 2.5rem;
        }
    }

    .container {
        padding-top: 80px;
        margin-top: -70px;
    }
</style>