<template>
    <div class="btn-group mb-1 mn-sm-0 me-sm-2 github">
        <a class="btn btn-dark btn-sm" href="https://github.com/kestra-io/kestra" target="_blank">
            <Github /> Star
        </a>
        <a class="btn btn-outline-dark btn-sm" href="https://github.com/kestra-io/kestra" target="_blank">
            <ClientOnly>
                <template v-slot:fallback>
                    <span class="placeholder" style="width: 60px"></span>
                </template>
                <LayoutGithubStargazer />
            </ClientOnly>
        </a>
    </div>
</template>

<script>
    import Github from "vue-material-design-icons/Github.vue"

    export default {
        components: {Github},
    };
</script>

<style lang="scss" scoped>
    .btn-group {
        .btn {
            border: 1px solid #333336;
            color: var(--bs-white);
        }

        .btn-dark {
            background: #333336;
        }

        .btn-outline-dark {
            border-left: 0;
            color: #333336;
        }
    }
</style>
