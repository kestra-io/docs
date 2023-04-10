export async function stargazers() {
    return "TODO"
    /*
    return await fetch("https://api.github.com/repos/kestra-io/kestra")
        .then((response) => {
            return response.json();
        })
        .then(value => {
            return Intl.NumberFormat('en-US').format(value.stargazers_count);
        })
    */
}
