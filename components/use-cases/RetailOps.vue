<template>
    <div class="container mt-5">
        <h2 data-aos="fade-right" class="text-center card-title mb-3">
            End-To-End Solution for Managing <br />
            Complex Retail Operations
        </h2>
        <!-- TODO: Add gradient to 'Complex' -->
        <p class="description">{{ description }}</p>

        <div class="row m-0 content my-4">
            <template v-for="item in items">
                <div class="col-md-6">
                    <div class="d-flex">
                        <div class="icon">
                            <img :src="item.icon" :alt="item.title" />
                        </div>
                        <div>
                            <h4 class="card-title mb-2">{{ item.title }}</h4>
                            <p>{{ item.text }}</p>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: "UseCaseRetailOps",
    props: {
        header: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        items: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";

.description {
    text-align: center;
    font-size: $font-size-lg;
    max-width: $container-max-width;
    margin: $spacer auto 0;
}
.container {
    position: relative;

    > div {
        h6 {
            font-weight: normal;
            line-height: 1.625rem;
        }
    }

    border: double 1px transparent;
    background-origin: border-box;
    background-clip: padding-box, border-box;
}
.content {
    background: $purple-31; // Add correct color gradient
    padding: calc($spacer * 2.375) calc($spacer * 3);
}
.icon {
    height: 100px;
    width: 100px;
}
</style>
