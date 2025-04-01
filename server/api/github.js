import {useDataCache} from '#nuxt-multi-cache/composables'

export default defineEventHandler(async (event) => {
    const {value, addToCache} = await useDataCache('api-github-metrics-with-contributors', event);

    if (value) {
        return value
    }

    const contribCount = await fetch("https://api.github.com/repos/kestra-io/kestra/contributors?anon=true&per_page=1")
            .then(res => res.headers.get('link')?.match(/page=(\d+)>; rel="last"/)?.[1])

    if (!contribCount) {
        throw Error('Failed to fetch contributors count');
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
            'contributors': contribCount,
        };
    });

    await addToCache(result, [], 3600);

    return result;
})
