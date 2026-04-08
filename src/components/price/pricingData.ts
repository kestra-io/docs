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
    "Workflow design & execution",
    "Scheduling & event triggers",
    "Real-time processing",
    "Embedded code editor",
    "Git integration & versioning",
    "Multi-cloud & air-gapped deployment",
]

export const getSections = (totalPlugins: number): Section[] => [
    {
        title: "Core Platform",
        rows: [
            {
                feature: `${totalPlugins}+ Plugins`,
                values: ["check", "check"],
                description: {
                    text: `Connect Kestra to ${totalPlugins}+ plugins`,
                    link: "/plugins",
                },
            },
            {
                feature: "Unlimited Flows & Executions",
                values: ["check", "check"],
                description: {
                    text: "No artificial limits on the number of workflows or executions",
                    link: "/docs/workflow-components",
                },
            },
            {
                feature: "AI Agents",
                values: ["check", "check"],
                description: {
                    text: "Launch autonomous processes with an LLM, memory, and tools",
                    link: "/docs/ai-tools/ai-agents",
                },
            },
            {
                feature: "AI Copilot (Gemini)",
                values: ["check", "check"],
                description: {
                    text: "AI-Copilot generating workflow code based on a natural language prompt using Gemini models",
                    link: "/docs/ai-tools/ai-copilot",
                },
            },
        ],
    },
    {
        title: "Enterprise Platform",
        rows: [
            {
                feature: "Enterprise Plugins",
                values: ["cross", "check"],
                description: {
                    text: "Access enterprise-grade integrations and features designed for secure, compliant, and large-scale orchestration across your stack.",
                    link: "/plugins",
                },
            },
            {
                feature: "Task Runners",
                values: ["cross", "check"],
                description: {
                    text: "Offload compute-intensive tasks to remote environments",
                    link: "/docs/task-runners",
                },
            },
            {
                feature: "AI Copilot (Any LLM Cloud or Self-Hosted)",
                values: ["cross", "check"],
                description: {
                    text: "AI-Copilot with support for any LLM provider",
                    link: "/docs/ai-tools/ai-copilot",
                },
            },
            {
                feature: "Apps",
                values: ["cross", "check"],
                description: {
                    text: "Build custom UIs for your workflows with forms, approvals, and dashboards",
                    link: "/docs/enterprise/scalability/apps",
                },
            },
            {
                feature: "Human-in-the-Loop Approvals",
                values: ["cross", "check"],
                description: {
                    text: "Pause and resume workflow executions with custom inputs",
                    link: "/docs/use-cases/approval-processes#humantask-assign-specific-users-for-approval",
                },
            },
        ],
    },
    {
        title: "Authentication & Access",
        rows: [
            {
                feature: "User Management & Invitations",
                values: ["cross", "check"],
                description: {
                    text: "Create, manage, and invite users directly from the Kestra UI",
                    link: "/docs/enterprise/auth/rbac",
                },
            },
            {
                feature: "Role-Based Access Control (RBAC)",
                values: ["cross", "check"],
                description: {
                    text: "Manage access with roles, fine-grained permissions, and namespace-level controls for users, groups, and service accounts",
                    link: "/docs/enterprise/auth/rbac",
                },
            },
            {
                feature: "SSO (OIDC)",
                values: ["cross", "check"],
                description: {
                    text: "Access multiple applications with one set of login credentials",
                    link: "/docs/enterprise/auth/sso",
                },
            },
            {
                feature: "LDAP",
                values: ["cross", "check"],
                description: {
                    text: "Enable LDAP authentication in Kestra to streamline access using existing LDAP credentials",
                    link: "/docs/enterprise/auth/sso/ldap",
                },
            },
            {
                feature: "SCIM",
                values: ["cross", "check"],
                description: {
                    text: "Sync users and groups from your Identity Provider to Kestra",
                    link: "/docs/enterprise/auth/scim",
                },
            },
            {
                feature: "Service Accounts & API Access",
                values: ["cross", "check"],
                description: {
                    text: "Programmatic access with service accounts, API tokens, and server-to-server credentials (OAuth2, JWT)",
                    link: "/docs/enterprise/auth/service-accounts",
                },
            },
        ],
    },
    {
        title: "Secrets & Security",
        rows: [
            {
                feature: "Secrets Manager (Internal, External & Read-Only)",
                values: ["cross", "check"],
                description: {
                    text: "Manage secrets with built-in storage, external providers like Vault and AWS Secrets Manager, or read-only immutable backends for enhanced security compliance",
                    link: "/docs/enterprise/governance/secrets-manager",
                },
            },
            {
                feature: "Namespace & Tenant-Level Secrets",
                values: ["cross", "check"],
                description: {
                    text: "Scope secrets, plugin defaults, and variables to specific namespaces or tenants",
                    link: "/docs/enterprise/governance/namespace-management#namespace-level-features",
                },
            },
            {
                feature: "Storage Isolation",
                values: ["cross", "check"],
                description: {
                    text: "Add extra security measures to your Kestra instance to isolate access",
                    link: "/docs/enterprise/governance/worker-isolation",
                },
            },
        ],
    },
    {
        title: "Governance & Observability",
        rows: [
            {
                feature: "Namespaces, Variables",
                values: ["cross", "check"],
                description: {
                    text: "Govern secrets, variables, and plugin defaults on a namespace level.",
                    link: "/docs/enterprise/governance/namespace-management",
                },
            },
            {
                feature: "Allowed & Restricted Plugins",
                values: ["cross", "check"],
                description: {
                    text: "Control which plugins can be used with allowlists and blocklists",
                    link: "/docs/enterprise/governance/allowed-plugins",
                },
            },
            {
                feature: "Assets & Lineage",
                values: ["cross", "check"],
                description: {
                    text: "Assets keeps a live inventory of resources that your workflows interact with",
                    link: "/docs/enterprise/governance/assets",
                },
            },
            {
                feature: "Audit Logs",
                values: ["cross", "check"],
                description: {
                    text: "Record all activities made by all users on the resources created inside Kestra",
                    link: "/docs/enterprise/governance/audit-logs",
                },
            },
            {
                feature: "External Log Aggregators",
                values: ["cross", "check"],
                description: {
                    text: "Manage and distribute logs across your entire infrastructure",
                    link: "/docs/enterprise/governance/logshipper",
                },
            },
            {
                feature: "System Announcements",
                values: ["cross", "check"],
                description: {
                    text: "Communicate planned maintenance or incidents with in-app banners",
                    link: "/docs/enterprise/instance/announcements",
                },
            },
        ],
    },
    {
        title: "Development & Customization",
        rows: [
            {
                feature: "Plugin Versioning",
                values: ["cross", "check"],
                description: {
                    text: "Use multiple versions of a plugin depending on your instance requirements and upgrade path",
                    link: "/docs/enterprise/instance/versioned-plugins",
                },
            },
            {
                feature: "Unit Tests",
                values: ["cross", "check"],
                description: {
                    text: "Automated, isolated tests for your Kestra flows with fixtures and assertions to avoid regressions in production",
                    link: "/blogs/introducing-unit-tests",
                },
            },
            {
                feature: "App & Workflow Catalog",
                values: ["cross", "check"],
                description: {
                    text: "Browse and manage custom applications built with Kestra",
                    link: "/docs/enterprise/scalability/apps#app-catalog",
                },
            },
            {
                feature: "Custom Blueprints",
                values: ["cross", "check"],
                description: {
                    text: "Your private internal App store of ready to use Kestra workflows",
                    link: "/docs/enterprise/governance/custom-blueprints",
                },
            },
        ],
    },
    {
        title: "Infrastructure & Scalability",
        rows: [
            {
                feature: "Backup & Restore",
                values: ["cross", "check"],
                description: {
                    text: "Automated backup and restore for disaster recovery",
                    link: "/docs/administrator-guide/backup-and-restore",
                },
            },
            {
                feature: "Multi-Tenant",
                values: ["cross", "check"],
                description: {
                    text: "Isolate multiple environments within a single Kestra instance",
                    link: "/docs/enterprise/governance/tenants",
                },
            },
            {
                feature: "Worker Groups",
                values: ["cross", "check"],
                description: {
                    text: "A set of workers that can be explicitly targeted for task execution or polling trigger evaluation",
                    link: "/docs/enterprise/scalability/worker-group",
                },
            },
            {
                feature: "Cluster Health Monitoring",
                values: ["cross", "check"],
                description: {
                    text: "Monitor cluster health and performance. Support for plugging in your own storage backend",
                    link: "/docs/administrator-guide/monitoring",
                },
            },
            {
                feature: "Maintenance Mode",
                values: ["cross", "check"],
                description: {
                    text: "Pause the platform for safe upgrades and migrations",
                    link: "/docs/enterprise/instance/maintenance-mode",
                },
            },
            {
                feature: "Kill Switch",
                values: ["cross", "check"],
                description: {
                    text: "Instantly stop problematic executions by scope to prevent cascading failures",
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
