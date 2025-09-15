<template>
    <div class="container-fluid bd-gutter bd-layout type-docs">
        <div v-if="loading" class="loading-wrapper">
            <div class="spinner"></div>
            <span class=" bg-dark-2">Loading releases...</span>
        </div>
        <template v-else>
            <NavSideBar type="docs" :navigation="navMenu"/>
            <article class="bd-main order-1 docs full">
                <div>
                    <h1>Release Notes</h1>
                    <select v-model="selectedId" class="form-select bg-dark-2">
                        <option v-for="release in releases" :key="release.id" :value="release.id">
                            {{ release.name || release.tag_name }}
                        </option>
                    </select>
                </div>
                <div class="bd-content" v-if="selectedRelease">
                    <ContentRenderer class="bd-markdown" :value="releasePage"/>
                </div>
            </article>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {parseMarkdown} from '@nuxtjs/mdc/runtime'
import NavSideBar from "~/components/docs/NavSideBar.vue";

const releases = ref([])
const selectedId = ref(null)
const releasePage = ref({})
const navMenu = ref([])
const loading = ref(true)

onMounted(async () => {
    loading.value = true
    const res = await fetch('https://api.github.com/repos/kestra-io/kestra/releases')
    if (res.ok) {
        let data = await res.json()
        data = data.sort((a, b) => b.tag_name.localeCompare(a.tag_name)).filter(r => !r.draft && !r.prerelease)
        releases.value = data
        if (releases.value.length) {
            selectedId.value = releases.value[0].id
        }
    }
    loading.value = false
})

const selectedRelease = computed(() =>
    releases.value.find(r => r.id === selectedId.value)
)

function modifyCommitLink(body, repo = 'kestra-io/kestra') {
    const marker = 'Kestra Enterprise Edition Changes';
    const splitIndex = body.indexOf(marker);

    if (splitIndex === -1) {
        return body.replace(/^-\s([a-f0-9]{7})/gm, (match, commitId) => {
            const url = `https://github.com/${repo}/commit/${commitId}`;
            return `- [\`${commitId}\`](${url})`;
        });
    }
    const before = body.slice(0, splitIndex);
    const after = body.slice(splitIndex);

    const transformedBefore = before.replace(/^-\s([a-f0-9]{7})/gm, (match, commitId) => {
        const url = `https://github.com/${repo}/commit/${commitId}`;
        return `- [\`${commitId}\`](${url})`;
    });
    const transformedAfter = after.replace(/^-\s([a-f0-9]{7})/gm, '- ');

    return transformedBefore + transformedAfter;
}

watch(selectedRelease, async (release) => {
    if (release) {
        const parsed = await parseMarkdown(modifyCommitLink(release.body), {});
        releasePage.value = parsed;
        navMenu.value = [{
            children: (parsed.toc?.links || []).map(h => ({
                title: h.text,
                path: `#${h.id}`,
                children: h.children?.map(child => ({
                    title: child.text,
                    path: `#${child.id}`
                })) || []
            }))
        }];
    }
}, { immediate: true });
</script>

<style scoped lang="scss">
.bg-dark-2 {
    color: #ABABB2;
}
.loading-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    gap: 1em;
}
.spinner {
    width: 48px;
    height: 48px;
    border: 6px solid transparent;
    border-top: 6px solid #B010FB;
    border-right: 6px solid #DE97FF;
    border-bottom: 6px solid #A227DB;
    border-left: 6px solid #A610EC;
    border-radius: 50%;
    background: none;
    animation: spin 1s linear infinite;
    margin-bottom: 1em;
}
@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>