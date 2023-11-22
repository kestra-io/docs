<template>
    <div class="hero header row justify-content-center" data-aos="fade-right">
        <div class="col-12 col-md-12 col-lg-10">
            <div class="row">
                <div class="col-12 col-md-6">
                    <slot name='header'></slot>
                    <p>
                        {{ description }}
                    </p>
                    <div class="d-flex flex-wrap gap-2">
                        <template v-if="cta.length" v-for="action in cta">
                            <NuxtLink :href="action.href">
                                <button
                                    class="btn btn-lg"
                                    :class="action.style"
                                >
                                    {{ action.text }}
                                </button>
                            </NuxtLink>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "UseCaseHeaderCard",

    props: {
        icon: {
            type: Object,
            required: false,
            default: () => ({}),
        },
        description: {
            type: String,
            required: true,
        },
        cta: {
            type: Array,
            required: true,
        },
        descrClass: {
            type: String,
            required: false
        }
    },
};
</script>
<style scoped lang="scss">
@import "../../assets/styles/variable";
.header {
    p {
        font-size: $font-size-xl;
    }
}
</style>
<script setup lang="ts"></script>