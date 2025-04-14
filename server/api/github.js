import {useDataCache} from '#nuxt-multi-cache/composables'

export default defineEventHandler(async (event) => {
    const {value, addToCache} = await useDataCache('api-github-metrics-with-contributors', event);

    if (value) {
        return value
    }

    const contribCountRes = await fetch("https://api.github.com/repos/kestra-io/kestra/contributors?anon=true&per_page=1", {headers: {'User-Agent': 'request'}})

    if (!contribCountRes.ok) {
        if (contribCountRes.status === 404) {
            return {
                'stargazers': 0,
                'watchers': 0,
                'issues': 0,
                'forks': 0,
                'network': 0,
                'subscribers': 0,
                'size': 0,
                'contributors': 0,
            };
        }
        // Handle other errors
        console.error('Error fetching contributors count:', contribCountRes.status, contribCountRes.statusText);
    }

    const contributors = parseInt(contribCountRes.headers.get('Link').match(/page=(\d+)>; rel="last"/)[1], 10);
    if (isNaN(contributors)) {
        throw Error('Failed to parse contributors count' + contribCountRes.headers.get('Link'));
    }

    const result = await $fetch(
        "https://api.github.com/repos/kestra-io/kestra",
        {headers: {'User-Agent': 'request'}}
    ).then(value => {
        return {
            'stargazers': value.stargazers_count,
            'watchers': value.watchers_count,
            'issues': value.open_issues_count,
            'forks': value.forks,
            'network': value.network_count,
            'subscribers': value.subscribers_count,
            'size': value.size,
            contributors,
        };
    });

    await addToCache(result, [], 3600);

    return result;
})
