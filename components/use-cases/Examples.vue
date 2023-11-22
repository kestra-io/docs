<template>
    <div class="container example">
        <h2 data-aos="fade-left" class="text-center mb-5">
            Use Cases in Retail
        </h2>
        <!-- TODO: Add gradient to 'Retail' -->
        <div class="row card-group card-centered no-shadow mb-2">
            <template v-for="item in items">
                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon">
                                <component :is="item.icon" />
                            </span>
                            <h4 class="card-title">{{ item.title }}</h4>
                            <p class="card-text">{{ item.text }}</p>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: "UseCasesExamples",

    props: {
        items: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";

.card {
    background-color: $purple-33;
    color: white;
    box-shadow: none !important;

    .card-body {
        padding: 2rem 1rem;

        p {
            font-size: $font-size-sm;
            line-height: 1.375rem;
            color: $purple-32;
        }
    }
}
.example {
    background: url("/terraform/overview/background.svg") no-repeat 0 -4%;
}
</style>
