import url from "node:url";

export default defineEventHandler(async (event) => {
    const requestUrl = new url.URL("http://localhost" + event.node.req.url);
    return {
        title: "Success",
        message: "Mock request processed successfully",
        params: requestUrl.searchParams,
    };
})
