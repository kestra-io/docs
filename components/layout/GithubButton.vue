<template>
    <a class="btn" href="https://github.com/kestra-io/kestra" target="_blank" role="button">
        <span>
            <Github/>
            {{ stargazersText }} ⭐️
        </span>
    </a>
</template>

<script>
import Github from "vue-material-design-icons/Github.vue"

export default defineComponent({
    components: {Github},
    async setup() {
        const {data} = await useFetch('/api/github')
        const stargazersText = Intl.NumberFormat('en-US').format(data.value.stargazers);

        return {stargazersText};
    },
});
</script>
