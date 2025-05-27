<template>
    <span v-if="stargazersText">{{ stargazersText }}</span>
    <span v-else class="placeholder" style="width: 39px"></span>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from 'vue';

const stargazersText = ref<string | undefined>(undefined)

onMounted(async () => {
    const response = await axios.get('/api/github')
    stargazersText.value = Intl.NumberFormat('en-US').format(response.data.stargazers);
})
</script>