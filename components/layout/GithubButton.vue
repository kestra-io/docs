<template>
    <a class="btn" href="https://github.com/kestra-io/kestra" target="_blank" role="button">
        <span>
            <Github/>
            &nbsp;
            <ClientOnly>
                <template v-slot:fallback>
                    <span class="placeholder" style="width: 60px"></span>
                </template>
                <LayoutGithubStargazer />
            </ClientOnly>
        </span>
    </a>
</template>

<script>
    import Github from "vue-material-design-icons/Github.vue"

    export default {
        components: {Github},
    };
</script>
