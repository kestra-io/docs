export default {
    // hardening
    'base-uri': ["'self'", "https://kestra.io"],
    'object-src': ["'none'"],
    'script-src-attr': ["'unsafe-inline'"],
    'default-src': [
        "'self'",
        "https://*.cr-relay.com",
        "https://*.kestra-io.pages.dev",
        "https://kestra.io"
    ],
    // scripts
    'script-src': [
        "'self'",
        "'nonce-{{nonce}}'",
        "'strict-dynamic'",
        "'wasm-unsafe-eval'", 
        "https://cdn.cr-relay.com",
        "https://*.kestra-io.pages.dev",
        "https://*.hs-analytics.net",
        "https://*.hs-banner.com",
        "https://*.hs-scripts.com",
        "https://*.hsadspixel.net",
        "https://*.hubspot.com",
        "https://kestra.io",
        "https://*.kestra.io",
        "https://*.licdn.com",
        "https://*.googletagmanager.com",
        "https://*.redditstatic.com",
        "https://*.hs-scripts.com",
        "https://*.hsforms.net"
    ],
    // styles & fonts
    'style-src': ["'self'", 'https:', "'unsafe-inline'"],
    'font-src': ["'self'", 'https:', 'data:'],
    // images
    'img-src': [
        "'self'",
        'data:',
        'blob:',
        "https://*.google.fr",
        "https://*.google.com",
        "https://*.ads.linkedin.com",
        "https://*.reddit.com",
        "https://*.hubspot.com",
        "https://*.hsforms.com",
        "https://*.googleapis.com",
        "https://i.ytimg.com",
        "https://*.googletagmanager.com"
    ],
    // iframes
    'frame-src': [
        "'self'",
        "https://*.google.com",
        "https://*.youtube.com",
        "https://*.googletagmanager.com",
    ],
    'connect-src': [
        "'self'",
        "ws://localhost:4000",
        "https://api.kestra.io",
        "https://kestra.io",
        "https://*.google.com",
        "https://*.reddit.com",
        "https://*.redditstatic.com",
        "https://*.hubspot.com",
        "https://*.hubapi.com",
        "https://*.cr-relay.com",
        "https://*.ads.linkedin.com",
        "https://*.hsappstatic.net",
        "https://unpkg.com",
        "https://cdn.jsdelivr.net",
        "https://*.hs-scripts.com",
        "https://*.hsforms.net",
        "https://*.hsforms.com",
        "https://*.s3.amazonaws.com",
        "https://stats.g.doubleclick.net",
        "https://stats.g.doubleclick.com"
    ],
    // workers
    'worker-src': ["'self'", 'blob:'],
    // mixed content
    'upgrade-insecure-requests': true,
};
