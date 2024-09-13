import {useDataCache} from '#nuxt-multi-cache/composables'

export default defineEventHandler(async (event) => {
    const {value, addToCache} = await useDataCache('api-github-metrics', event);

    if (value) {
        return value
    }

    const headers = {'User-Agent': 'request'};
    const result = await $fetch(
        "https://api.github.com/repos/kestra-io/kestra",
        {headers}
    ).then(value => {
        return {
            'stargazers': value.stargazers_count,
            'watchers': value.watchers_count,
            'issues': value.open_issues_count,
            'forks': value.forks,
            'network': value.network_count,
            'subscribers': value.subscribers_count,
            'size': value.size,
        };
    });

    await addToCache(result, [], 3600);

    return result;
})
