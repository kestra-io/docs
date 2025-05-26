<template>
    <span v-if="stargazersText">{{ stargazersText }}</span>
    <span v-else class="placeholder" style="width: 39px"></span>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const stargazersText = ref<string | null>(null);

const formatStargazers = (count: number): string => 
    new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
    .format(count);

onMounted(async () => {
    const response = await axios.get<{ stargazers: number }>('/api/github');
    stargazersText.value = formatStargazers(response.data.stargazers);
});
</script>