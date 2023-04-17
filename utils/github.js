export async function stargazers() {
    return await fetch("https://api.kestra.io/v1/communities/github/metrics")
        .then((response) => {
            return response.json();
        })
        .then(metrics => {
            return Intl.NumberFormat('en-US').format(metrics.stars);
        })
}
