import { defineMiddleware } from "astro:middleware";
import { sequence } from "astro/middleware";
import { API_URL } from "astro:env/client";

const sendRedirect = (redirectUrl: string) => {
    return new Response("", {
        status: 301,
        headers: {
            Location: redirectUrl
        }
    });
}

const logger = defineMiddleware(async (context, next) => {
    if (context.url.pathname === "/api/healthcheck" || import.meta.env.DEV) {
        return next();
    }

    const startAt = Date.now();

    const response = await next();

    const logParts: Record<string, any> = {
        "method": context.request.method,
        "url": context.request.url,
        "status": response.status,
        "ip": !context.isPrerendered ? context.request.headers.get('x-forwarded-for') : null,
        "length": response.headers.get("content-length"),
        "route": context.routePattern,
        "routeParams": context.params,
        "duration": (Date.now() - startAt),
        "referer": response.headers.get("referer"),
    };

    if (!context.isPrerendered && !logParts["ip"]) {
        logParts["ip"] = context.clientAddress;
    }

    const log = JSON.stringify(logParts);

    if (response.status < 500) {
        console.log(log);
    } else {
        console.error(log);
    }

    return response;
});

const noIndex = defineMiddleware(async (context, next) => {
    // Check if the request is coming from the .pages.dev domain or others
    if (context.url.host !== 'kestra.io') {
        const response = await next();

        response.headers.set('X-Robots-Tag', 'noindex, nofollow');

        return new Response(await response.text(), {
            status: response.status,
            headers: response.headers
        });
    }

    return next();
});

const incomingRedirect = defineMiddleware(async (context, next) => {
    const originalUrl = context.url.toString();

    // we don't want trailing slashes (but allow the root path '/')
    if (context.url.pathname !== "/" && originalUrl.endsWith("/")) {
        return sendRedirect(originalUrl.substring(0, originalUrl.length - 1));
    }

    // we don't want .html extensions (historical reason)
    if (originalUrl.endsWith(".html")) {
        return sendRedirect(originalUrl.substring(0, originalUrl.length - 5).toLocaleLowerCase());
    }

    // all urls should be lowercase
    const match = context.url.pathname.match(/[A-Z]/);
    if (match) {
        return sendRedirect(originalUrl.replace(context.url.pathname, context.url.pathname.toLocaleLowerCase()));
    }

    // Check if the request is coming from the kestra-io.pages.dev to redirect to main
    if (context.url.host === 'kestra-io.pages.dev') {
        const replace = new URL(context.url);
        replace.host = "kestra.io";
        replace.protocol = "https:";
        replace.port = "443";

        return sendRedirect(replace.toString());
    }

    return next();
});


const securityHeaders = defineMiddleware(async (context, next) => {
    const response = await next();

    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");

    return new Response(await response.text(), {
        status: response.status,
        headers: response.headers
    });
});

const notFoundRedirect = defineMiddleware(async (context, next) => {
    const response = await next();

    if (response.status !== 404) {
        return response;
    }

    const originalUrl = context.url.toString();

    try {
        const result = await (await fetch(`${API_URL}/redirects?${new URLSearchParams({
            from: originalUrl
        }).toString()}`)).json();

        if (result && result.to && result.to !== originalUrl) {
            return sendRedirect(result.to);
        }
    } catch (e) {
        console.error("Error fetching redirect:", e);
    }

    return response;
});

export const onRequest = sequence(
    logger,
    noIndex,
    incomingRedirect,
    securityHeaders,
    notFoundRedirect
);