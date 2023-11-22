<template>
    <div class="container justify-content-center">
        <div class="text-center rounded content">
            <div>
                <h3 data-aos="fade-right">{{ title }}</h3>
                <div
                    class="d-flex gap-2 flex-wrap justify-content-center align-items-center"
                >
                    <template v-for="action in cta">
                        <NuxtLink :href="action.link">
                            <button
                                class="btn btn-primary"
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
</template>

<script>
export default {
    name: "UseCaseFooter",

    props: {
        title: {
            type: String,
            required: true,
        },
        cta: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";

.content {
    background: $purple-31; // TODO: add correct background gradient
    padding: calc($spacer * 2.375) calc($spacer * 3);
    border: double 1px transparent;
    background-origin: border-box;
    background-clip: padding-box, border-box;
}
</style>