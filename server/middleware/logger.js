export default fromNodeMiddleware((req, res, next) => {
    if (req.url !== "/api/healthcheck") {
        const startAt = Date.now()

        res.on('finish', () => {
            const logParts = [
                "url: " + req.method + " " + req.url,
                "status: " + res.statusCode,
                "length: " + (res._contentLength || "-"),
                "ip: " + ((req.headers['x-forwarded-for'] || '').split(',').shift().trim() || '-'),
                "duration: " + (Date.now() - startAt) + "ms",
            ];

            const log = "[" + logParts.join("] [") + "]";

            if (res.statusCode < 500) {
                console.log(log);
            } else {
                console.error(log);
            }
        });
    }

    next();
})
