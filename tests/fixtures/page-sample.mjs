// Pages sampled by the visual-regression suite and the Lighthouse benchmark.
// `runs` is how many times the benchmark measures a page before taking the
// median, for the ones whose score swings between runners; `ssr` marks the
// prerender = false pages, which the benchmark measures first.
export const PAGES = [
    { path: "/", label: "Home", runs: 5 },
    { path: "/get-started", label: "Get Started" },
    { path: "/pricing", label: "Pricing" },
    { path: "/enterprise", label: "Enterprise" },
    { path: "/cloud", label: "Cloud" },
    { path: "/about-us", label: "About Us", runs: 3 },
    { path: "/docs", label: "Docs Landing", runs: 5 },
    {
        path: "/docs/contribute-to-kestra",
        label: "Contribute to Kestra (simple docs)",
    },
    {
        path: "/docs/workflow-components/flow",
        label: "Flow (full featured docs)",
        runs: 3,
    },
    { path: "/blogs", label: "Blog Index" },
    { path: "/blogs/2022-04-27-etl-vs-elt", label: "Blog Post (sample)" },
    { path: "/vs/aws-step-functions", label: "VS Page (sample)" },
    { path: "/plugins", label: "Plugins Landing", ssr: true },
    { path: "/plugins/core", label: "Plugin Page (sample)", ssr: true },
    {
        path: "/plugins/core/debug",
        label: "Plugin Debug Page (sample)",
        ssr: true,
    },
    {
        path: "/plugins/core/debug/io.kestra.plugin.core.debug.return",
        label: "Plugin Debug Return Page (sample)",
        ssr: true,
    },
    {
        path: "/blueprints",
        label: "Blueprints Landing",
        runs: 3,
        ssr: true,
    },
    {
        path: "/blueprints/audit-logs-csv-export",
        label: "Blueprint Audit Logs CSV Export",
        ssr: true,
    },
]
