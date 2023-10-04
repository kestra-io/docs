<template>
    <span v-if="stargazersText">{{ stargazersText }}</span>
    <span v-else class="placeholder" style="width: 39px"></span>
</template>

<script>
    import axios from "axios";

    export default {
        data: () => ({
            stargazersText: undefined
        }),
        async mounted() {
            const response = await axios.get('/api/github')
            this.stargazersText = Intl.NumberFormat('en-US').format(response.data.stargazers);
        },
    };
</script>
