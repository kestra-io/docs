export const tableHeadData = [
    {
        name: "",
        period: "",
    },
    {
        name: 'The Open-Source Edition',
        period: "Free",
        button: {
            text: "Get Started",
            href: "/docs/getting-started/quickstart#start-kestra",
        },
    },
    {
        name: 'Enterprise',
        period: "Per Instance",
        button: {
            text: "Talk to us",
            href: "/demo",
        },
    },
];

export const getTableSortedData = (totalPlugins: string) => [
    {
        title: "Core Features",
        isFullLine: true,
        textBold: true,
        children: [
            {
                title: "Workflow Creation and Execution",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Execute all your workflows as code or from the UI",
                    link: "/docs/workflow-components"
                }
            },
            {
                title: "Multi-Cloud or On-Prem Deployment Options",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Install Kestra on any cloud or on-prem",
                    link: "/docs/installation"
                }
            },
            {
                title: "Embedded Code Editor",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Built-in code editor to write and run your workflows",
                    link: "/docs/concepts/editor"
                }
            },
            {
                title: "Plugins",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: `Connect Kestra to ${totalPlugins} plugins`,
                    link: "/plugins"
                }
            },
            {
                title: "Plugin Development Support",
                openSourceText: false,
                enterpriseText: 'On-Demand',
                description: {
                    text: "Support for developing custom plugins",
                    link: "/docs/plugin-developer-guide"
                }
            },
            {
                title: "Code Versioning & Git Integration",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Advanced Git integration to sync all your Kestra objects incl. flows, apps, unit tests, dashboards and namespace files",
                    link: "/docs/version-control-cicd/git"
                }
            },
            {
                title: "Autocompletion & Syntax Validation",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Trigger autocompletion to list available tasks or properties of a given task",
                    link: "/docs/tutorial/fundamentals#autocompletion"
                }
            },
            {
                title: "Live-Updated Topology View",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Visualize the structure of your flow",
                    link: "/docs/ui/flows#topology-view"
                }
            },
            {
                title: "Task & Subflow Dependency Management",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Visualize the relationship dependencies between your flows",
                    link: "/docs/ui/flows#dependencies"
                }
            },
            {
                title: "Flexible Scheduling System",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "The Scheduler is a server component responsible for processing all triggers",
                    link: "/docs/architecture/scheduler"
                }
            },
            {
                title: "Event-Driven Data Processing",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Execute your workflow based on events",
                    link: "/docs/workflow-components/triggers"
                }
            },
            {
                title: "Embedded Task & Trigger Documentation",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "The documentation view displays Kestra's documentation right inside of the editor",
                    link: "/docs/ui/flows#documentation-view"
                }
            },
            {
                title: "KV Store",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Key-value store to persist configuration and custom workflow execution data",
                    link: "/docs/concepts/kv-store"
                }
            },
            {
                title: "Playground Mode",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Build workflows iteratively, one task at a time",
                    link: "/docs/ui/playground"
                }
            },
            {
                title: "Multi-Panel Editor",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Split-screen Flow Editor that lets you open, reorder, and close multiple panels, including Code, No-Code, Files, Docs, and more side by side",
                    link: "/docs/ui/flows#edit"
                }
            },
            {
                title: "No-Code Workflow Builder",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Create Kestra flows from the form-based UI tabs without writing code",
                    link: "/docs/ui/flows#no-code-view"
                }
            },
            {
                title: "Conditional Inputs",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Show/hide inputs based on other input values or custom conditions",
                    link: "/docs/workflow-components/inputs#dynamic-inputs"
                }
            },
            {
                title: "Dynamic Dropdowns",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Dropdown options dynamically fetched from external HTTP endpoints",
                    link: "/blogs/release-0-24#dynamic-dropdowns-powered-by-http-function"
                }
            },
            {
                title: "Namespace Files",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Store and manage custom code separately for each namespace",
                    link: "/docs/concepts/namespace-files"
                }
            },
            {
                title: "Flow-level SLA",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Define service level agreements for workflow execution",
                    link: "/docs/workflow-components/sla"
                }
            },
            {
                title: "Task Caching",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Intelligent caching of task outputs to avoid redundant execution",
                    link: "/docs/workflow-components/task-cache"
                }
            },
            {
                title: "Realtime Event Triggers",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Millisecond-latency event processing for business-critical workflows",
                    link: "/docs/workflow-components/triggers/realtime-trigger"
                }
            },
            {
                title: "LoopUntil Orchestration Pattern",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Wait for specific conditions to be met before proceeding",
                    link: "/plugins/core/flow/io.kestra.plugin.core.flow.loopuntil"
                }
            },
            {
                title: "Human-in-the-loop Manual Approval",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Pause and resume workflow executions with custom inputs",
                    link: "/docs/how-to-guides/pause-resume"
                }
            },
            {
                title: "AI Agents",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Launch autonomous processes with an LLM, memory, and tools",
                    link: "/docs/ai-tools/ai-agents"
                }
            },
            {
                title: "AI Copilot (Gemini models only)",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "AI-Copilot generating workflow code based on a natural language prompt using Gemini models",
                    link: "/docs/ai-tools/ai-copilot"
                }
            },
            {
                title: "AI Copilot (Any LLM provider)",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "AI-Copilot with support for any LLM provider",
                    link: "/docs/ai-tools/ai-copilot"
                }
            },
        ]
    },
    {
        title: "Security & Governance",
        isFullLine: true,
        textBold: true,
        children: [
            {
                title: "LTS Releases (Long-Term Support)",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Long-term support releases with guaranteed 1-year maintenance",
                    link: "/blogs/introducing-lts"
                }
            },
            {
                title: "Users Management",
                isOpenSource: false,
                isEnterprise: false,
                openSourceText: '',
                enterpriseText: 'Unlimited',
                description: {
                    text: "Manage users inside Kestra UI",
                    link: "/docs/ui/administration/users"
                }
            },
            {
                title: "SSO & OIDC Authentication",
                isEnterprise: true,
                isOpenSource: false,
                description: {
                    text: "Access multiple applications with one set of login credentials",
                    link: "/docs/enterprise/auth/sso"
                }
            },
            {
                title: "Role-Based Access Control (RBAC)",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Manage access to workflows and resources by assigning Roles to Users, Groups, and Service Accounts",
                    link: "/docs/enterprise/auth/rbac"
                }
            },
            {
                title: "Multi-Tenancy Support",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Isolate multiple environments within a single Kestra instance",
                    link: "/docs/enterprise/governance/tenants"
                }
            },
            {
                title: "Audit Logs & Revision History",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Record all activities made by all users on the resources created inside Kestra",
                    link: "/docs/ui/administration/audit-logs"
                }
            },
            {
                title: "Secret Manager Integrations",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Store sensitive information securely.",
                    link: "/docs/enterprise/governance/secrets-manager"
                }
            },
            {
                title: "Namespace-Level Permissions",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Govern secrets, variables, and plugin defaults on a namespace level.",
                    link: "/docs/enterprise/governance/namespace-management"
                }
            },
            {
                title: "Worker Security Isolation",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Isolate your executions on dedicated tenants",
                    link: "/docs/enterprise/scalability/worker-group"
                }
            },
            {
                title: "Encryption & Fault Tolerance",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Built-in encryption and workflow reliability with automatic retries and state persistence",
                    link: "/docs"
                }
            },
            {
                title: "SCIM Directory Sync",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Sync users and groups from your Identity Provider to Kestra",
                    link: "/docs/enterprise/auth/scim"
                }
            },
            {
                title: "User Invitations",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Streamlined user onboarding with invitations",
                    link: "/docs/enterprise/auth/invitations"
                }
            },
            {
                title: "Announcements",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Communicate planned maintenance or incidents with in-app banners",
                    link: "/docs/enterprise/instance/announcements"
                }
            },
            {
                title: "Log Shippers",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Manage and distribute logs across your entire infrastructure",
                    link: "/docs/enterprise/governance/logshipper"
                }
            },
            {
                title: "SOC 2",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "SOC 2 compliance",
                    link: "/trust"
                }
            },
        ]
    },
    {
        title: "Productivity",
        isFullLine: true,
        textBold: true,
        children: [
            {
                title: "Custom Blueprints & Templates",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Your private internal App store of ready to use Kestra workflows",
                    link: "/docs/enterprise/governance/custom-blueprints"
                }
            },
            {
                title: "Full-Text Search on Task Runs",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Manage Task Runs in one place",
                    link: "/docs/ui/task-runs"
                }
            },
            {
                title: "Centralized User & Permission Management",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Give users restricted access or full control over your Kestra instance",
                    link: "/docs/enterprise/auth/rbac#permissions"
                }
            },
            {
                title: "Onboarding & Training Support",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Get your team using Kestra as it full potential with the help of our experts",
                    link: "/docs"
                }
            },
            {
                title: "Customer Success Program with SLAs",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Get dedicated support with a guaranteed Service Level Agreement",
                    link: "/docs"
                }
            },
            {
                title: "Namespace-Level Secrets Management",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Configure secrets, plugin defaults, and variables that can be used within any flow in a given namespace",
                    link: "/docs/enterprise/governance/namespace-management#namespace-level-features"
                }
            },
            {
                title: "Apps",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Build custom UIs to interact with Kestra from the outside world",
                    link: "/docs/enterprise/scalability/apps"
                }
            },
            {
                title: "Apps Catalog",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Browse and manage custom applications built with Kestra",
                    link: "/docs/enterprise/scalability/apps#app-catalog"
                }
            },
            {
                title: "Unit Tests",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Automated, isolated tests for your Kestra flows with fixtures and assertions to avoid regressions in production",
                    link: "/blogs/introducing-unit-tests"
                }
            },
            {
                title: "Custom Dashboards",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Build custom dashboards for monitoring and analytics",
                    link: "/docs/ui/dashboard"
                }
            },
            {
                title: "Bookmarks",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Save and organize frequently accessed workflows and resources",
                    link: "/docs/ui/bookmarks"
                }
            },
            {
                title: "UI Localization",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Access the UI in one of 12 supported languages",
                    link: "/blogs/release-0-19#localization-ui"
                }
            },
            {
                title: "In-app Versioned Docs",
                isOpenSource: true,
                isEnterprise: true,
                description: {
                    text: "Contextual documentation integrated into the UI",
                    link: "/blogs/release-0-19#in-app-versioning-for-docs-and-blueprints"
                }
            },
            {
                title: "Plugin Versioning",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Use multiple versions of a plugin depending on your instance requirements and upgrade path",
                    link: "/docs/enterprise/instance/versioned-plugins"
                }
            },
            {
                title: "Customizable UI Links",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Customize navigation and external links in the UI",
                    link: "/docs/configuration#ee-sidebar-configuration"
                }
            }
        ]
    },
    {
        title: "Scalability & Infrastructure",
        isFullLine: true,
        textBold: true,
        children: [
            {
                title: "High Availability (No Single Point of Failure)",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Kestra is designed to be highly available and fault-tolerant",
                    link: "/docs/administrator-guide/high-availability"
                }
            },
            {
                title: "Worker Groups for Distributed Tasks",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "A set of workers that can be explicitly targeted for task execution or polling trigger evaluation",
                    link: "/docs/enterprise/scalability/worker-group"
                }
            },
            {
                title: "Task Runners",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Offload compute-intensive tasks to remote environments",
                    link: "/docs/enterprise/scalability/task-runners"
                }
            },
            {
                title: "Service Accounts & API Tokens",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Create applications with programmatic API access or create token for real users",
                    link: "/docs/enterprise/auth/service-accounts"
                }
            },
            {
                title: "Dedicated Storage & Tenant Isolation",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Add extra security measures to your Kestra instance to isolate access",
                    link: "/docs/enterprise/governance/worker-isolation"
                }
            },
            {
                title: "Backup & Restore",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Automated backup and restore for disaster recovery",
                    link: "/docs/administrator-guide/backup-and-restore"
                }
            },
            {
                title: "Maintenance Mode",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Graceful maintenance mode for system updates and maintenance",
                    link: "/docs/enterprise/maintenance-mode"
                }
            },
            {
                title: "Cluster Monitoring & Custom Storage",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Monitor cluster health and performance. Support for plugging in your own storage backend",
                    link: "/docs"
                }
            },
            {
                title: "High-Throughput Event Handling",
                isOpenSource: false,
                isEnterprise: true,
                description: {
                    text: "Handle large volumes of events per second with built-in parallelism, scaling, and queue management",
                    link: "/docs"
                }
            }
        ]
    },
];