import contentSecurityPolicyConfig from "../../content-security-policy.config"

// Over http (wrangler dev, the Lighthouse CI harness) the page talks to
// services on loopback: the API fixture server on :9001, HMR, a local Kestra.
const INSECURE_ORIGIN_CONNECT_SRC = [
    "http://localhost:*",
    "http://127.0.0.1:*",
    "ws://localhost:*",
    "ws://127.0.0.1:*",
]

export function buildContentSecurityPolicy(url: URL): string {
    // wrangler dev serves the production build, so import.meta.env.DEV is false
    // there: key this off the request scheme, which is what actually matters.
    const isInsecureOrigin = url.protocol === "http:"

    const localhost: string[] = []
    if (isInsecureOrigin) {
        localhost.push(url.protocol + "//" + url.host)
    }

    return Object.entries(
        contentSecurityPolicyConfig as Record<string, Array<string> | boolean>,
    )
        // upgrade-insecure-requests over http rewrites every subresource to https
        // and nothing serves TLS on localhost, so the whole page stalls.
        .filter(
            ([key]) => !isInsecureOrigin || key !== "upgrade-insecure-requests",
        )
        .map(([key, value]) => {
            let line = key

            if (typeof value !== "boolean") {
                if (value.length === 1 && value[0] === "'none'") {
                    line += " " + value.join(" ")
                } else {
                    const extra =
                        isInsecureOrigin && key === "connect-src"
                            ? INSECURE_ORIGIN_CONNECT_SRC
                            : []
                    line += " " + localhost.concat(value, extra).join(" ")
                }
            }

            return line
        })
        .join("; ")
}
