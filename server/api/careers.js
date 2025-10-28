import url from "node:url";

const countryCodeToEmoji = (countryCode) => {
    let codePoints = countryCode.toUpperCase().split('').map(char =>  127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

const baseResponse = (job) => {
    return {
        id: job.id,
        title: job.title,
        locations: job.locations ? job.locations.map(l => {
            return l.location_option.display_name === "International" ?
                {
                    code: null,
                    name: "World",
                    emoji: "🌍"
                } : {
                code: l.location_option.country,
                name: l.location_option.display_name,
                emoji: countryCodeToEmoji(l.location_option.country)
            }
        }) : null,
        remote: job.locations ? job.locations.filter(l => l.location_type === 'REMOTE').length > 0 : null,
        link: `https://app.dover.com/apply/Kestra%20Technologies/${job.id}`,
    }
}

export default defineEventHandler(async (event) => {
    try {
        const requestUrl = new url.URL("http://localhost" + event.node.req.url);
        const id = requestUrl.searchParams.get("id");

        const jobsList = await $fetch(`https://app.dover.com/api/v1/careers-page/1fbbcad7-3e1b-4b61-96d4-f45f0b51c100/jobs?limit=300&offset=0`);

        if (!id) {
            return jobsList.results.map((job) => {
                return baseResponse(job);
            })
        } else {
            const job = jobsList.results.filter(job => job.id === id);

            if (job.length == 0) {
                setResponseStatus(event, 404)
                return {message: "Not Found"};
            }

            const jobDescription = await $fetch(`https://app.dover.com/api/v1/jobs/${id}/get_job_description`);

            return { ... baseResponse(job[0]), ...{
                description: jobDescription.user_provided_description,
            }}
        }
    } catch (error) {
        console.error(error);
        return {
            message: 'Failed to fetch or parse data',
            error: error,
        };
    }
});