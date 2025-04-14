import url from "node:url";

export default defineEventHandler(async (event) => {
    try {
        const requestUrl = new url.URL("http://localhost" + event.node.req.url);
        const id = requestUrl.searchParams.get("id");

        const jobsList = await $fetch(`https://app.dover.com/api/v1/careers-page/1fbbcad7-3e1b-4b61-96d4-f45f0b51c100/jobs?limit=300&offset=0`);

        if (!id) {
            return jobsList.results.map((job) => {
                return {
                    id: job.id,
                    title: job.title,
                    location: job.location && job.location.length > 0 ? job.location[0].location_option.country : null,
                }
            })
        } else {
            const job = jobsList.results.filter(job => job.id === id);

            if (job.length == 0) {
                setResponseStatus(event, 404)
                return {message: "Not Found"};
            }

            const jobDescription = await $fetch(`https://app.dover.com/api/v1/jobs/${id}/get_job_description`);

            return {
                id: job[0].id,
                title: job[0].title,
                description: jobDescription.user_provided_description,
                link: `https://app.dover.com/apply/Kestra%20Technologies/${job[0].id}`,
            }
        }
    } catch (error) {
        console.log(error);
        return {
            message: 'Failed to fetch or parse data',
            error: error,
        };
    }
});