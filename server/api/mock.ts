import url from "node:url";

export default defineEventHandler(async (event) => {
    const method = event.node.req.method;
    const code = event.node.res.statusCode;
    const createdAt = new Date().toISOString();
    const requestUrl = new url.URL("http://localhost" + event.node.req.url);
    
    let responseData = {
        title: "Success",
        method: method,
        params: requestUrl.searchParams,
        code: code,
        createdAt: createdAt,
        body: "Request processed successfully",
    };

    switch (method) {
        case "GET":
            return responseData;
        case "POST":
            const body = await readBody(event);
            event.node.res.statusCode = 201;
            return {
                ...responseData,
                code: 201,
                body
            };
        default:
            event.node.res.statusCode = 405;
            return {
                ...responseData,
                title: "Method Not Allowed",
                body: "The requested method is not allowed for this endpoint."
            };
    }
})