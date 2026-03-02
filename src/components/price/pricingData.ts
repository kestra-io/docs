export type CellValue = "check" | "cross"

export interface Plan {
    name: string
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
    { name: "Open source" },
    {
        name: "Team",
        button: {
            text: "Request Free Trial",
            href: "/enterprise/free-trial",
            class: "btn btn-secondary",
        },
    },
    {
        name: "Pro",
        button: {
            text: "Contact us",
            href: "/demo",
            class: "btn btn-secondary",
        },
    },
    {
        name: "Enterprise",
        button: {
            text: "Contact us",
            href: "/demo",
            class: "btn btn-primary",
        },
    },
]

export const getSections = (totalPlugins: number): Section[] => [
    {
        title: "Core Features",
        rows: [
            {
                feature: "Workflow Design & Execution",
                values: ["check", "check", "check", "check"],
                description: {
                    text: "Execute all your workflows as code or from the UI",
                    link: "/docs/workflow-components",
                },
            },
            {
                feature: "Task & Subflow Dependencies",
                values: ["check", "check", "check", "check"],
                description: {
                    text: "Visualize the relationship dependencies between your flows",
                    link: "/docs/ui/flows#dependencies",
                },
            },
            {
                feature: "Advanced Orchestration Patterns (Loops, Conditions)",
                values: ["check", "check", "check", "check"],
                description: {
                    text: "Wait for specific conditions to be met before proceeding",
                    link: "/plugins/core/flow/io.kestra.plugin.core.flow.loopuntil",
                },
            },
            {
                feature: "Human-in-the-Loop Approvals",
                values: ["cross", "check", "check", "check"],
                description: {
                    text: "Pause and resume workflow executions with custom inputs",
                    link: "/docs/how-to-guides/pause-resume",
                },
            },
        ],
    },
    {
        title: "Scheduling & Events",
        rows: [
            {
                feature: "Flexible Scheduling",
                values: ["check", "check", "check", "check"],
                description: {
                    text: "The Scheduler is a server component responsible for processing all triggers",
                    link: "/docs/architecture/server-components#scheduler",
                },
            },
            {
                feature: "Event-Driven Triggers",
                values: ["check", "check", "check", "check"],
                description: {
                    text: "Execute your workflow based on events",
                    link: "/docs/workflow-components/triggers",
                },
            },
            {
                feature: "Real-Time Processing",
                values: ["check", "check", "check", "check"],
                description: {
                    text: "Millisecond-latency event processing for business-critical workflows",
                    link: "/docs/workflow-components/triggers/realtime-trigger",
                },
            },
            {
                feature: "Flow-Level APIs",
                values: ["check", "check", "check", "check"],
                description: {
                    text: "Define service level agreements for workflow execution",
                    link: "/docs/workflow-components/sla",
                },
            },
        ],
    },
    {
        title: "Developer Experience",
        rows: [
            {
                feature: "Embedded Code Editor",
                values: ["check", "check", "check", "check"],
                description: {
                    text: "Built-in code editor to write and run your workflows",
                    link: "/docs/ui/flows",
                },
            },
            {
                feature: "Autocomplete & Validation",
                values: ["check", "check", "check", "check"],
                description: {
                    text: "Trigger autocompletion to list available tasks or properties of a given task",
                    link: "/docs/tutorial/fundamentals#autocompletion",
                },
            },
            {
                feature: "Git Integration & Versioning",
                values: ["check", "check", "check", "check"],
                description: {
                    text: "Advanced Git integration to sync all your Kestra objects incl. flows, apps, unit tests, dashboards and namespace files",
                    link: "/docs/version-control-cicd/git",
                },
            },
            {
                feature: "Live Execution Topology",
                values: ["check", "check", "check", "check"],
                description: {
                    text: "Visualize the structure of your flow",
                    link: "/docs/ui/flows#topology-view",
                },
            },
        ],
    },
    {
        title: "Platform & Deployment",
        rows: [
            {
                feature: "Multi-Cloud & On-Prem Deployment",
                values: ["check", "check", "check", "check"],
                description: {
                    text: "Install Kestra on any cloud or on-prem",
                    link: "/docs/installation",
                },
            },
            {
                feature: "Namespace File Management",
                values: ["check", "check", "check", "check"],
                description: {
                    text: "Store and manage custom code separately for each namespace",
                    link: "/docs/concepts/namespace-files",
                },
            },
            {
                feature: "Built-in Key-Value Store",
                values: ["check", "check", "check", "check"],
                description: {
                    text: "Key-value store to persist configuration and custom workflow execution data",
                    link: "/docs/concepts/kv-store",
                },
            },
        ],
    },
    {
        title: "Extensibility",
        rows: [
            {
                feature: `${totalPlugins}+ Plugins`,
                values: ["check", "check", "check", "check"],
                description: {
                    text: `Connect Kestra to ${totalPlugins}+ plugins`,
                    link: "/plugins",
                },
            },
            {
                feature: "Enterprise Plugins",
                values: ["cross", "check", "check", "check"],
                description: {
                    text: "Access enterprise-grade integrations and features designed for secure, compliant, and large-scale orchestration across your stack.",
                    link: "/plugins",
                },
            },
            {
                feature: "Task Runners",
                values: ["cross", "cross", "check", "check"],
                description: {
                    text: "Offload compute-intensive tasks to remote environments",
                    link: "/docs/task-runners",
                },
            },
        ],
    },
    {
        title: "AI Capabilities",
        rows: [
            {
                feature: "AI Agents",
                values: ["check", "check", "check", "check"],
                description: {
                    text: "Launch autonomous processes with an LLM, memory, and tools",
                    link: "/docs/ai-tools/ai-agents",
                },
            },
            {
                feature: "AI Copilot (Gemini)",
                values: ["check", "check", "check", "check"],
                description: {
                    text: "AI-Copilot generating workflow code based on a natural language prompt using Gemini models",
                    link: "/docs/ai-tools/ai-copilot",
                },
            },
            {
                feature: "AI Copilot (Any LLM Cloud or Self-Hosted)",
                values: ["cross", "cross", "cross", "check"],
                description: {
                    text: "AI-Copilot with support for any LLM provider",
                    link: "/docs/ai-tools/ai-copilot",
                },
            },
        ],
    },
    {
        title: "User Management & Security",
        rows: [
            {
                feature: "Users Management",
                values: ["cross", "check", "check", "check"],
                description: {
                    text: "Manage users inside Kestra UI",
                    link: "/docs/enterprise/auth/rbac",
                },
            },
            {
                feature: "Role-Based Access Control (RBAC)",
                values: ["cross", "check", "cross", "check"],
                description: {
                    text: "Manage access to workflows and resources by assigning Roles to Users, Groups, and Service Accounts",
                    link: "/docs/enterprise/auth/rbac",
                },
            },
            {
                feature: "Fine-Grained RBAC",
                values: ["cross", "cross", "cross", "check"],
                description: {
                    text: "Give users restricted access or full control over your Kestra instance",
                    link: "/docs/enterprise/auth/rbac#permissions",
                },
            },
            {
                feature: "SSO (OIDC)",
                values: ["cross", "check", "check", "check"],
                description: {
                    text: "Access multiple applications with one set of login credentials",
                    link: "/docs/enterprise/auth/sso",
                },
            },
            {
                feature: "Lightweight Directory Access Protocol (LDAP)",
                values: ["cross", "cross", "cross", "check"],
                description: {
                    text: "Enable LDAP authentication in Kestra to streamline access using existing LDAP credentials",
                    link: "/docs/enterprise/auth/sso/ldap",
                },
            },
            {
                feature: "System for Cross-domain Identity Management (SCIM)",
                values: ["cross", "cross", "cross", "check"],
                description: {
                    text: "Sync users and groups from your Identity Provider to Kestra",
                    link: "/docs/enterprise/auth/scim",
                },
            },
            {
                feature: "Internal Secret Manager",
                values: ["cross", "check", "check", "check"],
                description: {
                    text: "Configure secrets, plugin defaults, and variables that can be used within any flow in a given namespace",
                    link: "/docs/enterprise/governance/namespace-management#namespace-level-features",
                },
            },
            {
                feature: "External Secret Manager (Vault, AWS Secrets Manager...)",
                values: ["cross", "cross", "check", "check"],
                description: {
                    text: "Store sensitive information securely.",
                    link: "/docs/enterprise/governance/secrets-manager",
                },
            },
            {
                feature: "Service Account",
                values: ["cross", "check", "check", "check"],
                description: {
                    text: "Create applications with programmatic API access or create token for real users",
                    link: "/docs/enterprise/auth/service-accounts",
                },
            },
        ],
    },
    {
        title: "Observability & Governance",
        rows: [
            {
                feature: "Namespaces, Variables",
                values: ["cross", "check", "check", "check"],
                description: {
                    text: "Govern secrets, variables, and plugin defaults on a namespace level.",
                    link: "/docs/enterprise/governance/namespace-management",
                },
            },
            {
                feature: "System Announcements",
                values: ["cross", "cross", "cross", "check"],
                description: {
                    text: "Communicate planned maintenance or incidents with in-app banners",
                    link: "/docs/enterprise/instance/announcements",
                },
            },
            {
                feature: "Assets & Lineage",
                values: ["cross", "cross", "check", "check"],
                description: {
                    text: "Assets keeps a live inventory of resources that your workflows interact with",
                    link: "/docs/enterprise/governance/assets",
                },
            },
            {
                feature: "Audit Logs",
                values: ["cross", "cross", "cross", "check"],
                description: {
                    text: "Record all activities made by all users on the resources created inside Kestra",
                    link: "/docs/enterprise/governance/audit-logs",
                },
            },
            {
                feature: "External Log Aggregators",
                values: ["cross", "cross", "cross", "check"],
                description: {
                    text: "Manage and distribute logs across your entire infrastructure",
                    link: "/docs/enterprise/governance/logshipper",
                },
            },
        ],
    },
    {
        title: "Development & Customization",
        rows: [
            {
                feature: "Plugin Versioning",
                values: ["cross", "check", "check", "check"],
                description: {
                    text: "Use multiple versions of a plugin depending on your instance requirements and upgrade path",
                    link: "/docs/enterprise/instance/versioned-plugins",
                },
            },
            {
                feature: "Unit Tests",
                values: ["cross", "cross", "check", "check"],
                description: {
                    text: "Automated, isolated tests for your Kestra flows with fixtures and assertions to avoid regressions in production",
                    link: "/blogs/introducing-unit-tests",
                },
            },
            {
                feature: "App & Workflow Catalog",
                values: ["cross", "cross", "check", "check"],
                description: {
                    text: "Browse and manage custom applications built with Kestra",
                    link: "/docs/enterprise/scalability/apps#app-catalog",
                },
            },
            {
                feature: "Custom Blueprints",
                values: ["cross", "cross", "cross", "check"],
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
                values: ["cross", "check", "check", "check"],
                description: {
                    text: "Automated backup and restore for disaster recovery",
                    link: "/docs/administrator-guide/backup-and-restore",
                },
            },
            {
                feature: "Multi-Tenant",
                values: ["cross", "cross", "check", "check"],
                description: {
                    text: "Isolate multiple environments within a single Kestra instance",
                    link: "/docs/enterprise/governance/tenants",
                },
            },
            {
                feature: "Worker Groups",
                values: ["cross", "cross", "check", "check"],
                description: {
                    text: "A set of workers that can be explicitly targeted for task execution or polling trigger evaluation",
                    link: "/docs/enterprise/scalability/worker-group",
                },
            },
            {
                feature: "Advanced Secret Manager Multiple by (Namespace/Tenant)",
                values: ["cross", "cross", "cross", "check"],
                description: {
                    text: "Store sensitive information securely.",
                    link: "/docs/enterprise/governance/secrets-manager",
                },
            },
            {
                feature: "Cluster Health Monitoring",
                values: ["cross", "check", "check", "check"],
                description: {
                    text: "Monitor cluster health and performance. Support for plugging in your own storage backend",
                    link: "/docs/administrator-guide/monitoring",
                },
            },
            {
                feature: "Storage Isolation",
                values: ["cross", "cross", "cross", "check"],
                description: {
                    text: "Add extra security measures to your Kestra instance to isolate access",
                    link: "/docs/enterprise/governance/worker-isolation",
                },
            },
        ],
    },
]

export const SUPPORT_PLANS = ["Standard", "Premium", "Platinum"]

export const SUPPORT_ROWS: SupportRow[] = [
    {
        feature: "Named Users",
        values: ["3", "5", "10+"],
    },
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