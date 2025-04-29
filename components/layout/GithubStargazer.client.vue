<template>
    <span v-if="stargazersText">{{ stargazersText }}</span>
    <span v-else class="placeholder" style="width: 39px"></span>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from "axios";

const stargazersText = ref(null);

const formatStargazers = (count) => {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
}

onMounted(async () => {
    const response = await axios.get('/api/github');
    stargazersText.value = formatStargazers(response.data.stargazers);
});
</script>