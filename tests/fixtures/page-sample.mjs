// Pages sampled by the visual-regression suite and the Lighthouse benchmark.
// `runs` is how many times the benchmark measures a page before taking the
// median, for the ones whose score swings between runners; `ssr` marks the
// prerender = false pages, which the benchmark measures first. `styles` is a
// stylesheet under snapshot-styles/ injected before the screenshot is taken.
export const PAGES = [
    { path: "/", label: "Home", runs: 5 },
    { path: "/get-started", label: "Get Started" },
    { path: "/pricing", label: "Pricing" },
    { path: "/enterprise", label: "Enterprise" },
    { path: "/cloud", label: "Cloud" },
    { path: "/features", label: "Features" },
    { path: "/about-us", label: "About Us", runs: 3 },
    { path: "/security", label: "Security" },
    {
        path: "/docs",
        label: "Docs Landing",
        runs: 5,
        styles: "docs-landing.css",
    },
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
    { path: "/plugins", label: "Plugins Landing", runs: 3, ssr: true },
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

// Pages covered by visual regression only, not by the Lighthouse benchmark.
// PAGES is the perf sample and stays small on purpose; this list exists so the
// SVG asset rework (dot-grid backgrounds to CSS, base64 PNG wrappers to WebP,
// SVGO passes) has a screenshot baseline on every surface it touches.
export const VISUAL_ONLY_PAGES = [
    // Use-case detail pages: each renders one of the ~5.6 MB dot-grid
    // backgrounds under public/landing/usecases/, the highest-risk conversion.
    { path: "/use-cases/ci-cd", label: "Use Case CI-CD" },
    { path: "/use-cases/change-data-capture", label: "Use Case CDC" },
    { path: "/use-cases/databases-management", label: "Use Case Databases" },
    { path: "/use-cases/disaster-recovery", label: "Use Case Disaster Recovery" },
    {
        path: "/use-cases/microservices-orchestration",
        label: "Use Case Microservices",
    },
    { path: "/use-cases/modern-data-stack", label: "Use Case Modern Data Stack" },
    { path: "/use-cases/monitoring", label: "Use Case Monitoring" },
    {
        path: "/use-cases/provisioning-and-deployment",
        label: "Use Case Provisioning",
    },

    // Use-case index, personas and verticals: capability icons and hero art.
    { path: "/use-cases", label: "Use Cases Index" },
    { path: "/use-cases/automotive", label: "Use Case Automotive" },
    { path: "/use-cases/data-engineers", label: "Use Case Data Engineers" },
    { path: "/use-cases/financial-services", label: "Use Case Financial" },
    { path: "/use-cases/healthcare", label: "Use Case Healthcare" },
    { path: "/use-cases/platform-engineers", label: "Use Case Platform Eng" },
    { path: "/use-cases/public-services", label: "Use Case Public Services" },
    { path: "/use-cases/retail", label: "Use Case Retail" },
    { path: "/use-cases/software-engineers", label: "Use Case Software Eng" },
    { path: "/use-cases/software-providers", label: "Use Case Software Providers" },

    // Feature pages: the base64-PNG-in-SVG wrappers that become WebP.
    { path: "/features/code-in-any-language", label: "Feature Any Language" },
    { path: "/features/code-in-any-language/julia", label: "Feature Julia" },
    { path: "/features/code-in-any-language/python", label: "Feature Python" },
    { path: "/features/code-in-any-language/r", label: "Feature R" },
    { path: "/features/api-first", label: "Feature API First" },
    {
        path: "/features/declarative-data-orchestration",
        label: "Feature Declarative",
    },

    // Partner pages: partner logo SVGs, several of them raster wrappers.
    { path: "/partners", label: "Partners Index" },
    { path: "/partners/ashisuto", label: "Partner Ashisuto" },
    { path: "/partners/conapi", label: "Partner Conapi" },
    { path: "/partners/digitalocean", label: "Partner DigitalOcean" },
    { path: "/partners/ntico", label: "Partner Ntico" },

    // Remaining surfaces carrying line-grid backgrounds or large vector art.
    { path: "/overview", label: "Overview" },
    { path: "/two-zero", label: "Two Zero" },
    { path: "/1-0", label: "One Zero" },
    { path: "/ai-automation", label: "AI Automation" },
    { path: "/infra-automation", label: "Infra Automation" },
    { path: "/community", label: "Community" },
    { path: "/demo", label: "Demo" },
    { path: "/newsroom", label: "Newsroom" },
    { path: "/write-for-us", label: "Write For Us" },
    { path: "/lp/workflow-orchestration", label: "LP Workflow Orchestration" },
    { path: "/orchestration/ansible", label: "Orchestration Ansible" },
    {
        path: "/resources/airflow-2-eol-whitepaper",
        label: "Resource Airflow 2 EOL",
    },
    {
        path: "/blogs/2022-02-22-leroy-merlin-usage-kestra",
        label: "Blog Post (inline SVG charts)",
    },
]
