<template>
    <div class="container-fluid">
        <div class="container">
            <div class="row g-0">
                <div class="col-md-6 p-5">
                    <h6>OHHHH... 😔</h6>
                    <h1 @click="visible = !visible">
                        {{ title }}
                    </h1>
                    <p class="text-error">
                        {{ description }}
                    </p>
                    <div v-if="visible">
                        <h3>{{ error.message }}</h3>
                        <span v-html="error.stack" />
                    </div>
                    <NuxtLink href="/" class="btn btn-lg btn-primary mb-2">
                        Back to home
                    </NuxtLink>
                </div>
                <div class="col-md-6 p-5">
                    <img class="img-fluid" src="/error/error.svg" alt="error" />
                </div>
            </div>
        </div>
    </div>

    <LayoutCommunity :animation="false" />
</template>

<script>
    export default {
        name: "error",
        props: ['error', 'title', 'description'],
        data() {
            return {
                visible: false
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {

        background-color: $light-cyan;
    }

    .text-error {
        font-size: $font-size-lg;
        font-weight: 300;
    }
</style>