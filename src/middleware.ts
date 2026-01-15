import { defineMiddleware } from "astro:middleware";
import { sequence } from "astro/middleware";
import { API_URL } from "astro:env/client";
import contentSecurityPolicyConfig from "../content-security-policy.config";

const sendRedirect = (redirectUrl: string) => {
    return new Response("", {
        status: 301,
        headers: {
            Location: redirectUrl
        }
    });
}

const logger = defineMiddleware(async (context, next) => {
    if (context.url.pathname === "/api/healthcheck" || import.meta.env.DEV || context.isPrerendered) {
        return next();
    }

    const startAt = Date.now();

    const response = await next();

    const logParts: Record<string, any> = {
        "method": context.request.method,
        "url": context.request.url,
        "status": response.status,
        "ip": !context.isPrerendered ? context.request.headers.get('x-real-ip') : null,
        "length": response.headers.get("content-length"),
        "route": context.routePattern,
        "routeParams": context.params,
        "duration": (Date.now() - startAt),
        "referer": response.headers.get("referer"),
    };

    if (!logParts["ip"]) {
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
    if (match && !context.url.pathname.startsWith("/icons/") && !context.url.pathname.startsWith("/meta/")) {
        return sendRedirect(originalUrl.replace(context.url.pathname, context.url.pathname.toLocaleLowerCase()));
    }

    return next();
});

const securityHeaders = defineMiddleware(async (context, next) => {
    const response = await next();

    const localhost: string[] = [];
    if (import.meta.env.DEV) {
        localhost.push(context.url.protocol + "//" + context.url.host);
    }

    const contentSecurityPolicy: string = Object.entries(contentSecurityPolicyConfig as Record<string, Array<string> | boolean>)
        .filter(([key]) => import.meta.env.DEV && key !== "upgrade-insecure-requests")
        .map(([key, value]) => {
            let line = key;

            if (typeof value !== "boolean") {
                if (value.length === 1 && value[0] === "'none'") {
                    line += " " + value.join(" ");
                } else {
                    line += " " + localhost.concat(value).join(" ")
                }
            }

            return line;
        })
        .join("; ");

    response.headers.set("x-frame-options", "DENY");
    response.headers.set("x-content-type-options", "nosniff");
    response.headers.set("x-download-options", "nosniff");
    response.headers.set("access-control-allow-origin", context.url.protocol + "//" + context.url.host);
    response.headers.set("cross-origin-opener-policy", "same-origin");
    response.headers.set("cross-origin-resource-policy", "same-origin");
    response.headers.set("permissions-policy", "camera=(), display-capture=(), fullscreen=(*), geolocation=(), microphone=()");
    response.headers.set("referrer-policy", "strict-origin-when-cross-origin");
    response.headers.set("x-permitted-cross-domain-policies", "none");
    response.headers.set("content-security-policy", contentSecurityPolicy);

    if (!import.meta.env.DEV) {
        response.headers.set("strict-transport-security", "max-age=15552000");
    }

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
            sendRedirect(result.to);
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