export default defineEventHandler(async() => {
    return await fetch("https://api.kestra.io/v1/communities/github/metrics")
        .then((response) => {
            return response.json();
        })
        .then(value => {
            return {
                'stargazers': value.stars
            };
        })
})
