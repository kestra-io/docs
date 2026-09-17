export type CellValue = "check" | "cross"

export interface Plan {
    version: string
    button?: {
        text: string
        href: string
        class: string
    }
}

export interface Row {
    feature: string
    values: CellValue[]
    description?: {
        text: string
        link: string
    }
}

export interface Section {
    title: string
    rows: Row[]
}

export interface SupportRow {
    feature: string
    values: (string | CellValue)[]
}

export const PLANS: Plan[] = [
    { version: "Open Source" },
    {
        version: "Enterprise",
        button: {
            text: "Contact Sales",
            href: "/demo",
            class: "btn btn-primary",
        },
    },
]

export const SHARED_FEATURES = [
    "Workflow design and execution",
    "Scheduling and event triggers",
    "Real-time processing",
    "Code and no-code editors",
    "MCP server for AI agents",
    "Git integration and versioning",
    "Multi-cloud and air-gapped deployment",
]

const BOTH: CellValue[] = ["check", "check"]
const ENTERPRISE: CellValue[] = ["cross", "check"]

export const getSections = (totalPlugins: string): Section[] => [
    {
        title: "Core Platform",
        rows: [
            {
                feature: `${totalPlugins}+ Plugins`,
                values: BOTH,
                description: {
                    text: `Most of the ${totalPlugins}+ plugins are available in both editions`,
                    link: "/plugins",
                },
            },
            {
                feature: "Unlimited Flows & Executions",
                values: BOTH,
                description: {
                    text: "No limit on the number of workflows or executions",
                    link: "/docs/workflow-components",
                },
            },
            {
                feature: "PostgreSQL or MySQL Queue",
                values: BOTH,
                description: {
                    text: "Run the queue and repository on PostgreSQL or MySQL, with nothing else to operate",
                    link: "/docs/architecture/main-components#queue",
                },
            },
            {
                feature: "Code & No-Code Editors",
                values: BOTH,
                description: {
                    text: "Write YAML or use the guided form editor; both stay in sync",
                    link: "/docs/ui/flows",
                },
            },
            {
                feature: "Draft Revisions",
                values: BOTH,
                description: {
                    text: "Save work in progress without affecting the flow that triggers run",
                    link: "/docs/concepts/revision",
                },
            },
            {
                feature: "AI Copilot (Gemini)",
                values: BOTH,
                description: {
                    text: "Generate and edit flows from a natural language prompt with Gemini",
                    link: "/docs/ai-tools/ai-copilot",
                },
            },
            {
                feature: "AI Agents",
                values: BOTH,
                description: {
                    text: "Run autonomous tasks with an LLM, memory, tools, and guardrails",
                    link: "/docs/ai-tools/ai-agents",
                },
            },
            {
                feature: "MCP Server & Tool Trigger",
                values: BOTH,
                description: {
                    text: "Expose any flow as a tool for AI agents, and drive Kestra from any MCP client",
                    link: "/docs/ai-tools/mcp-server",
                },
            },
        ],
    },
    {
        title: "Enterprise Platform",
        rows: [
            {
                feature: "Enterprise Plugins",
                values: ENTERPRISE,
                description: {
                    text: "Integrations for infrastructure, security, and governance at scale",
                    link: "/plugins",
                },
            },
            {
                feature: "Task Runners",
                values: ENTERPRISE,
                description: {
                    text: "Run tasks on Kubernetes, cloud batch services, or dedicated VMs on AWS, Azure, Google Cloud, and Huawei Cloud",
                    link: "/docs/task-runners",
                },
            },
            {
                feature: "Agentic AI Copilot (Any LLM)",
                values: ENTERPRISE,
                description: {
                    text: "Edit, Plan, and Ask modes with memory and a confirmation step, on any cloud or self-hosted LLM",
                    link: "/docs/ai-tools/ai-copilot",
                },
            },
            {
                feature: "Apps",
                values: ENTERPRISE,
                description: {
                    text: "Build forms, approvals, and dashboards on top of your workflows",
                    link: "/docs/enterprise/scalability/apps",
                },
            },
            {
                feature: "Human-in-the-Loop Approvals",
                values: ENTERPRISE,
                description: {
                    text: "Pause an execution until someone approves it, with custom inputs",
                    link: "/docs/use-cases/approval-processes#humantask-assign-specific-users-for-approval",
                },
            },
            {
                feature: "Quotas",
                values: ENTERPRISE,
                description: {
                    text: "Cap how many executions a flow, namespace, or tenant can start in a time window",
                    link: "/docs/workflow-components/quotas",
                },
            },
            {
                feature: "Reusable Inputs",
                values: ENTERPRISE,
                description: {
                    text: "Define an input group once per namespace and reuse it across flows",
                    link: "/docs/workflow-components/reusable-inputs",
                },
            },
        ],
    },
    {
        title: "Authentication & Access",
        rows: [
            {
                feature: "SSO (OIDC)",
                values: ENTERPRISE,
                description: {
                    text: "Sign in with your identity provider",
                    link: "/docs/enterprise/auth/sso",
                },
            },
            {
                feature: "LDAP",
                values: ENTERPRISE,
                description: {
                    text: "Authenticate with existing LDAP credentials and sync groups",
                    link: "/docs/enterprise/auth/sso/ldap",
                },
            },
            {
                feature: "SCIM",
                values: ENTERPRISE,
                description: {
                    text: "Provision users and groups from your identity provider automatically",
                    link: "/docs/enterprise/auth/scim",
                },
            },
            {
                feature: "Role-Based Access Control",
                values: ENTERPRISE,
                description: {
                    text: "Grant actions on resources per namespace, for users, groups, and service accounts",
                    link: "/docs/enterprise/auth/rbac",
                },
            },
            {
                feature: "User Management & Invitations",
                values: ENTERPRISE,
                description: {
                    text: "Create, invite, and manage users from the UI",
                    link: "/docs/enterprise/auth/rbac",
                },
            },
            {
                feature: "Service Accounts & API Tokens",
                values: ENTERPRISE,
                description: {
                    text: "Programmatic access with service accounts, API tokens, OAuth2, and JWT",
                    link: "/docs/enterprise/auth/service-accounts",
                },
            },
            {
                feature: "IAM from the CLI",
                values: ENTERPRISE,
                description: {
                    text: "Manage users, groups, roles, and service accounts with kestractl",
                    link: "/docs/kestra-cli/kestractl",
                },
            },
        ],
    },
    {
        title: "Secrets & Security",
        rows: [
            {
                feature: "Secrets Manager",
                values: ENTERPRISE,
                description: {
                    text: "Store secrets in Kestra, or read them from Vault, AWS, Azure, Google Cloud, and other backends",
                    link: "/docs/enterprise/governance/secrets-manager",
                },
            },
            {
                feature: "Namespace & Tenant Secrets",
                values: ENTERPRISE,
                description: {
                    text: "Scope secrets and variables to a namespace or tenant",
                    link: "/docs/enterprise/governance/namespace-management#namespace-level-features",
                },
            },
            {
                feature: "Storage Isolation",
                values: ENTERPRISE,
                description: {
                    text: "Give each namespace or tenant its own internal storage",
                    link: "/docs/enterprise/governance/worker-isolation",
                },
            },
        ],
    },
    {
        title: "Governance & Observability",
        rows: [
            {
                feature: "Policies",
                values: ENTERPRISE,
                description: {
                    text: "Rules per namespace that set, check, or block task configuration in every flow",
                    link: "/docs/enterprise/governance/policies",
                },
            },
            {
                feature: "Promote",
                values: ENTERPRISE,
                description: {
                    text: "Move flows from dev to prod from the UI, with a diff and a review step",
                    link: "/docs/enterprise/governance/promote",
                },
            },
            {
                feature: "Cases",
                values: ENTERPRISE,
                description: {
                    text: "Track incidents next to the executions that caused them, from creation to resolution",
                    link: "/docs/enterprise/governance/cases",
                },
            },
            {
                feature: "Namespace Management",
                values: ENTERPRISE,
                description: {
                    text: "Govern secrets, variables, and files per namespace",
                    link: "/docs/enterprise/governance/namespace-management",
                },
            },
            {
                feature: "Allowed & Restricted Plugins",
                values: ENTERPRISE,
                description: {
                    text: "Control which plugins can be used with allowlists and blocklists",
                    link: "/docs/enterprise/governance/allowed-plugins",
                },
            },
            {
                feature: "Assets & Lineage",
                values: ENTERPRISE,
                description: {
                    text: "A live inventory of the tables, files, and systems your workflows touch",
                    link: "/docs/enterprise/governance/assets",
                },
            },
            {
                feature: "Audit Logs",
                values: ENTERPRISE,
                description: {
                    text: "Record every action by every user on every resource",
                    link: "/docs/enterprise/governance/audit-logs",
                },
            },
            {
                feature: "Log Shipper",
                values: ENTERPRISE,
                description: {
                    text: "Send logs and audit logs to Datadog, Splunk, Elasticsearch, your SIEM, and more",
                    link: "/docs/enterprise/governance/logshipper",
                },
            },
            {
                feature: "External Log Data Store",
                values: ENTERPRISE,
                description: {
                    text: "Keep execution logs in a separate database or Elasticsearch to keep the main one lean",
                    link: "/docs/administrator-guide/log-data-store",
                },
            },
            {
                feature: "System Announcements",
                values: ENTERPRISE,
                description: {
                    text: "Announce maintenance or incidents with an in-app banner",
                    link: "/docs/enterprise/instance/announcements",
                },
            },
        ],
    },
    {
        title: "Development & Customization",
        rows: [
            {
                feature: "Unit Tests",
                values: ENTERPRISE,
                description: {
                    text: "Test flows in isolation with fixtures and assertions, including expected failures",
                    link: "/docs/enterprise/governance/unit-tests",
                },
            },
            {
                feature: "Plugin Versioning",
                values: ENTERPRISE,
                description: {
                    text: "Run several versions of the same plugin side by side and upgrade at your own pace",
                    link: "/docs/enterprise/instance/versioned-plugins",
                },
            },
            {
                feature: "Custom Blueprints",
                values: ENTERPRISE,
                description: {
                    text: "A private catalog of ready-to-use flows, versioned in Git",
                    link: "/docs/enterprise/governance/custom-blueprints",
                },
            },
            {
                feature: "App Catalog",
                values: ENTERPRISE,
                description: {
                    text: "Browse and manage the apps built on your workflows",
                    link: "/docs/enterprise/scalability/apps#app-catalog",
                },
            },
        ],
    },
    {
        title: "Infrastructure & Scalability",
        rows: [
            {
                feature: "Worker Groups",
                values: ENTERPRISE,
                description: {
                    text: "Route tasks to dedicated workers by tag and reserve capacity for critical work",
                    link: "/docs/enterprise/scalability/worker-group",
                },
            },
            {
                feature: "Queue on Kafka, Redis, or AMQP",
                values: ENTERPRISE,
                description: {
                    text: "Move the queue off PostgreSQL or MySQL when your scale calls for it",
                    link: "/docs/architecture/main-components#queue",
                },
            },
            {
                feature: "Multi-Tenant",
                values: ENTERPRISE,
                description: {
                    text: "Isolate teams or environments inside one Kestra instance",
                    link: "/docs/enterprise/governance/tenants",
                },
            },
            {
                feature: "Backup & Restore",
                values: ENTERPRISE,
                description: {
                    text: "Automated backups and restores for disaster recovery",
                    link: "/docs/administrator-guide/backup-and-restore",
                },
            },
            {
                feature: "Cluster Health Monitoring",
                values: ENTERPRISE,
                description: {
                    text: "See the health and load of every server component",
                    link: "/docs/administrator-guide/monitoring",
                },
            },
            {
                feature: "Maintenance Mode",
                values: ENTERPRISE,
                description: {
                    text: "Pause the platform for safe upgrades and migrations",
                    link: "/docs/enterprise/instance/maintenance-mode",
                },
            },
            {
                feature: "Kill Switch",
                values: ENTERPRISE,
                description: {
                    text: "Stop every execution in a flow, namespace, or tenant at once",
                    link: "/docs/enterprise/instance/kill-switch",
                },
            },
        ],
    },
]

export const SUPPORT_PLANS = ["Standard", "Premium", "Platinum"]

export const SUPPORT_ROWS: SupportRow[] = [
    {
        feature: "Support Channels",
        values: ["Email", "Email + dedicated Teams/Slack", "Email + dedicated Teams/Slack"],
    },
    {
        feature: "P0 Service Level Agreement",
        values: ["24h", "6h", "1h"],
    },
    {
        feature: "Support Coverage",
        values: ["8x5", "8x5", "24x7"],
    },
    {
        feature: "Customer Success program",
        values: ["check", "check", "check"],
    },
    {
        feature: "Expert Advisory Services",
        values: ["Available as add-on", "Available as add-on", "6 Hours per Month"],
    },
]
