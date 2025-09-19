<template>
    <div class="container-fluid bd-gutter bd-layout type-docs">
        <div v-if="loading" class="loading-wrapper">
            <div class="spinner"></div>
            <span class=" bg-dark-2">Loading changelogs...</span>
        </div>
        <template v-else>
            <NavSideBar type="docs" :navigation="navMenu"/>
            <article class="bd-main order-1 docs full">
                <div>
                    <h1>Release Notes</h1>
                    <select v-model="selectedGroupKey" class="form-select bg-dark-2">
                        <option v-for="group in releaseGroups" :key="group.version" :value="group.version">
                            {{ group.version }}
                        </option>
                    </select>
                    <div class="bd-content" v-if="selectedGroup">
                        <div v-for="release in selectedGroup.releases" :key="release.id">
                            <h2 :id="release.tag_name">{{ release.name || release.tag_name }}</h2>
                            <ContentRenderer class="bd-markdown" :value="release.parsedBody"/>
                        </div>
                    </div>
                </div>
            </article>
        </template>
    </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {parseMarkdown} from '@nuxtjs/mdc/runtime'
import NavSideBar from "~/components/docs/NavSideBar.vue";

const navMenu = ref([])
const loading = ref(true)
const releaseGroups = ref([])
const selectedGroupKey = ref(null)

onMounted(async () => {
    loading.value = true
    releaseGroups.value = await fetchLast3ReleaseGroups()
    if (releaseGroups.value.length) {
        selectedGroupKey.value = releaseGroups.value[0].version
    }
    loading.value = false
})

const selectedGroup = computed(() =>
    releaseGroups.value.find(g => g.version === selectedGroupKey.value)
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

async function fetchLast3ReleaseGroups() {
    const res = await fetch('https://api.github.com/repos/kestra-io/kestra/releases?per_page=150');
    if (!res.ok) return [];

    let data = await res.json();
    data = data.filter(r => !r.draft && !r.prerelease);

    const groups = {};
    for (const release of data) {
        const match = release.tag_name.match(/(\d+\.\d+)/);
        if (match) {
            const key = match[1];
            if (!groups[key]) groups[key] = [];
            release.parsedBody = await parseMarkdown(modifyCommitLink(release.body));
            groups[key].push(release);
        }
    }

    const sortedKeys = Object.keys(groups)
        .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

    return sortedKeys.slice(0, 4).map(key => ({
        version: key,
        releases: groups[key]
    }));
}

watch(selectedGroup, (group) => {
    if (group) {
        navMenu.value = [{
            children: group.releases.map(r => ({
                title: r.tag_name,
                path: `#${r.tag_name}`
            }))
        }]
    }
}, { immediate: true })
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