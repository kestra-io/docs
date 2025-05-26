<template>
    <span v-if="stargazersText">{{ stargazersText }}</span>
    <span v-else class="placeholder" style="width: 39px"></span>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from "axios";

const stargazersText = ref(null);

const formatStargazers = (count) => {
    const formatter = new Intl.NumberFormat('en', {
        notation: 'compact',
        compactDisplay: 'short'
    });

    return formatter.format(count).toLowerCase();
}

onMounted(async () => {
    const response = await axios.get('/api/github');
    stargazersText.value = formatStargazers(response.data.stargazers);
});
</script>