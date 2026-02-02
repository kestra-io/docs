<template>
    <div class="table-content" ref="tableContentRef">
        <div class="container table-responsive">
            <h3>Compare All Features</h3>
            <table class="table table-dark">
                <thead class="t-head">
                    <tr>
                        <th
                            class="t-head-title text-center"
                            v-for="(head, index) in tableHead"
                            :key="index"
                        >
                            <div
                                class="border-radius"
                                :class="{
                                    'bg-gray': index !== 0,
                                }"
                            >
                                <p class="fw-bold">{{ head.name }}</p>
                                <span>{{ head.period }}</span>
                                <a
                                    v-if="head?.button"
                                    :href="head?.button?.href"
                                    :class="
                                        head.name === 'Enterprise'
                                            ? 'enterprise-btn'
                                            : 'edition-btn'
                                    "
                                >
                                    {{ head.button?.text }}
                                </a>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody class="t-head-body">
                    <tr
                        v-for="(item, index) in tableData"
                        :key="index"
                        :class="!item.textBold ? '' : 'sticky-tr'"
                    >
                        <td
                            class="ps-5 t-border-data-first-block"
                            :class="!item.textBold ? '' : 't-r-heading-text'"
                        >
                            <span>
                                {{ item.title }}
                                <div
                                    v-if="!item.textBold && item.description"
                                    class="tooltip-container"
                                >
                                    <Information class="info" />
                                    <div class="tooltip-content">
                                        {{ item.description.text }}
                                        <a
                                            v-if="item.description.link"
                                            :href="item.description.link"
                                            >Learn more</a
                                        >
                                    </div>
                                </div>
                            </span>
                        </td>
                        <td class="tick t-border-data">
                            <div class="bg-gray" :class="!item.textBold ? '' : 'heading-bg'">
                                <CheckBold
                                    v-if="!item.isFullLine && item.isOpenSource"
                                    class="check-svg-purple"
                                />
                                <Close
                                    class="close-svg-red"
                                    v-else-if="!item.isFullLine && !item.openSourceText"
                                />
                                <span class="enterprise-text" v-else-if="!item.isFullLine">{{
                                    item.openSourceText
                                }}</span>
                            </div>
                        </td>
                        <td class="tick t-border-data">
                            <div class="bg-gray" :class="!item.textBold ? '' : 'heading-bg'">
                                <CheckBold
                                    v-if="!item.isFullLine && item.isEnterprise"
                                    class="check-svg-purple"
                                />
                                <Close
                                    class="close-svg-red"
                                    v-else-if="!item.isFullLine && !item.enterpriseText"
                                />
                                <span class="enterprise-text" v-else-if="!item.isFullLine">{{
                                    item.enterpriseText
                                }}</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="collapsed-table">
        <div class="container">
            <div class="buttons">
                <div
                    :class="selectedType === 'enterprise' ? 'enterprs-btn' : 'ops-btn'"
                    @click="changeSelectedType('enterprise')"
                >
                    <p>Enterprise</p>
                    <span>Per Instance</span>
                </div>
                <div
                    :class="selectedType === 'opensource' ? 'enterprs-btn' : 'ops-btn'"
                    @click="changeSelectedType('opensource')"
                >
                    <p>Open-Source</p>
                    <span>Free</span>
                </div>
            </div>
            <div class="features">
                <CollapsedFeatures
                    v-for="(item, index) in tableSortedData"
                    :key="index"
                    class="que text-white"
                    :title="item.title"
                >
                    <div
                        v-for="(child, childIndex) in item.children"
                        :key="childIndex"
                        class="feature-row"
                    >
                        <div
                            class="feature-row-title"
                            :class="{
                                'border-bottom-none': childIndex === item.children.length - 1,
                            }"
                        >
                            <span>
                                {{ child.title }}
                                <div v-if="child.description" class="tooltip-container ms-auto">
                                    <Information class="info ps-4" />
                                    <div class="tooltip-content">
                                        {{ child.description.text }}
                                        <a
                                            v-if="child.description.link"
                                            :href="child.description.link"
                                            >Learn more</a
                                        >
                                    </div>
                                </div>
                            </span>
                        </div>
                        <div
                            class="feature-row-access"
                            :class="{
                                'border-bottom-none': childIndex === item.children.length - 1,
                            }"
                        >
                            <span v-if="selectedType === 'enterprise' && child.enterpriseText">{{
                                child.enterpriseText
                            }}</span>
                            <span
                                v-else-if="selectedType !== 'enterprise' && child.openSourceText"
                                >{{ child.openSourceText }}</span
                            >
                            <div v-if="selectedType === 'enterprise' && !child.enterpriseText">
                                <Close class="close-svg-red" v-if="!child.isEnterprise" />
                                <CheckBold
                                    v-else-if="child.isEnterprise"
                                    class="check-svg-purple"
                                />
                            </div>
                            <div v-else-if="selectedType === 'opensource' && !child.openSourceText">
                                <Close class="close-svg-red" v-if="!child.isOpenSource" />
                                <CheckBold
                                    v-else-if="child.isOpenSource"
                                    class="check-svg-purple"
                                />
                            </div>
                        </div>
                    </div>
                </CollapsedFeatures>
                <a
                    :href="selectedType === 'enterprise' ? '/enterprise' : '/demo'"
                    :class="selectedType === 'enterprise' ? 'enterprise-btn' : 'edition-btn'"
                >
                    {{ selectedType === "enterprise" ? "Talk to Sales" : "Get Started" }}
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, onUnmounted } from "vue"
    import Close from "vue-material-design-icons/Close.vue"
    import CheckBold from "vue-material-design-icons/CheckBold.vue"
    import Information from "vue-material-design-icons/Information.vue"
    import CollapsedFeatures from "~/components/layout/CollapsedFeatures.vue"
    import { usePluginsCount } from "~/composables/usePluginsCount"

    const { totalPlugins } = usePluginsCount()

    const selectedType = ref<string>("enterprise")
    const tableHead = computed(() => tableHeadData)
    const tableSortedData = computed(() => getTableSortedData(totalPlugins.value))

    const tableData = computed(() => {
        const flattened: any[] = []
        tableSortedData.value.forEach((group) => {
            flattened.push({
                title: group.title,
                isFullLine: true,
                textBold: true,
            })
            group.children.forEach((child) => {
                flattened.push(child)
            })
        })
        return flattened
    })

    const changeSelectedType = (type: string): void => {
        selectedType.value = type
    }

    const handleScroll = (): void => {
        const stickyElements = document.querySelectorAll(".sticky-tr")
        if (stickyElements) {
            stickyElements?.forEach((item) => {
                if (item.getBoundingClientRect()?.top <= 240) {
                    item?.classList.add("shadow")
                } else {
                    item?.classList.remove("shadow")
                }
            })
        }
    }

    onMounted(() => {
        window.addEventListener("scroll", handleScroll)
    })

    onUnmounted(() => {
        window.removeEventListener("scroll", handleScroll)
    })

    const tableHeadData = [
        {
            name: "",
            period: "",
        },
        {
            name: "The Open-Source Edition",
            period: "Free",
            button: {
                text: "Get Started",
                href: "/docs/quickstart#start-kestra",
            },
        },
        {
            name: "Enterprise",
            period: "Per Instance",
            button: {
                text: "Talk to us",
                href: "/demo",
            },
        },
    ]

    const getTableSortedData = (totalPlugins: string) => [
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
                        link: "/docs/workflow-components",
                    },
                },
                {
                    title: "Multi-Cloud or On-Prem Deployment Options",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Install Kestra on any cloud or on-prem",
                        link: "/docs/installation",
                    },
                },
                {
                    title: "Embedded Code Editor",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Built-in code editor to write and run your workflows",
                        link: "/docs/ui/flows",
                    },
                },
                {
                    title: "Plugins",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: `Connect Kestra to ${totalPlugins} plugins`,
                        link: "/plugins",
                    },
                },
                {
                    title: "Plugin Development Support",
                    openSourceText: false,
                    enterpriseText: "On-Demand",
                    description: {
                        text: "Support for developing custom plugins",
                        link: "/docs/plugin-developer-guide",
                    },
                },
                {
                    title: "Code Versioning & Git Integration",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Advanced Git integration to sync all your Kestra objects incl. flows, apps, unit tests, dashboards and namespace files",
                        link: "/docs/version-control-cicd/git",
                    },
                },
                {
                    title: "Autocompletion & Syntax Validation",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Trigger autocompletion to list available tasks or properties of a given task",
                        link: "/docs/tutorial/fundamentals#autocompletion",
                    },
                },
                {
                    title: "Live-Updated Topology View",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Visualize the structure of your flow",
                        link: "/docs/ui/flows#topology-view",
                    },
                },
                {
                    title: "Task & Subflow Dependency Management",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Visualize the relationship dependencies between your flows",
                        link: "/docs/ui/flows#dependencies",
                    },
                },
                {
                    title: "Flexible Scheduling System",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "The Scheduler is a server component responsible for processing all triggers",
                        link: "/docs/architecture/server-components#scheduler",
                    },
                },
                {
                    title: "Event-Driven Data Processing",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Execute your workflow based on events",
                        link: "/docs/workflow-components/triggers",
                    },
                },
                {
                    title: "Embedded Task & Trigger Documentation",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "The documentation view displays Kestra's documentation right inside of the editor",
                        link: "/docs/ui/flows#documentation-view",
                    },
                },
                {
                    title: "KV Store",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Key-value store to persist configuration and custom workflow execution data",
                        link: "/docs/concepts/kv-store",
                    },
                },
                {
                    title: "Playground Mode",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Build workflows iteratively, one task at a time",
                        link: "/docs/ui/playground",
                    },
                },
                {
                    title: "Multi-Panel Editor",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Split-screen Flow Editor that lets you open, reorder, and close multiple panels, including Code, No-Code, Files, Docs, and more side by side",
                        link: "/docs/ui/flows#edit",
                    },
                },
                {
                    title: "No-Code Workflow Builder",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Create Kestra flows from the form-based UI tabs without writing code",
                        link: "/docs/no-code/no-code-flow-building",
                    },
                },
                {
                    title: "Conditional Inputs",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Show/hide inputs based on other input values or custom conditions",
                        link: "/docs/workflow-components/inputs#dynamic-inputs",
                    },
                },
                {
                    title: "Dynamic Dropdowns",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Dropdown options dynamically fetched from external HTTP endpoints",
                        link: "/blogs/release-0-24#dynamic-dropdowns-powered-by-http-function",
                    },
                },
                {
                    title: "Namespace Files",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Store and manage custom code separately for each namespace",
                        link: "/docs/concepts/namespace-files",
                    },
                },
                {
                    title: "Flow-level SLA",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Define service level agreements for workflow execution",
                        link: "/docs/workflow-components/sla",
                    },
                },
                {
                    title: "Task Caching",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Intelligent caching of task outputs to avoid redundant execution",
                        link: "/docs/workflow-components/task-cache",
                    },
                },
                {
                    title: "Realtime Event Triggers",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Millisecond-latency event processing for business-critical workflows",
                        link: "/docs/workflow-components/triggers/realtime-trigger",
                    },
                },
                {
                    title: "LoopUntil Orchestration Pattern",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Wait for specific conditions to be met before proceeding",
                        link: "/plugins/core/flow/io.kestra.plugin.core.flow.loopuntil",
                    },
                },
                {
                    title: "Human-in-the-loop Manual Approval",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Pause and resume workflow executions with custom inputs",
                        link: "/docs/how-to-guides/pause-resume",
                    },
                },
                {
                    title: "AI Agents",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Launch autonomous processes with an LLM, memory, and tools",
                        link: "/docs/ai-tools/ai-agents",
                    },
                },
                {
                    title: "AI Copilot (Gemini models only)",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "AI-Copilot generating workflow code based on a natural language prompt using Gemini models",
                        link: "/docs/ai-tools/ai-copilot",
                    },
                },
                {
                    title: "AI Copilot (Any LLM provider)",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "AI-Copilot with support for any LLM provider",
                        link: "/docs/ai-tools/ai-copilot",
                    },
                },
            ],
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
                        link: "/blogs/introducing-lts",
                    },
                },
                {
                    title: "Users Management",
                    isOpenSource: false,
                    isEnterprise: false,
                    openSourceText: "",
                    enterpriseText: "Unlimited",
                    description: {
                        text: "Manage users inside Kestra UI",
                        link: "/docs/enterprise/auth/rbac",
                    },
                },
                {
                    title: "SSO & OIDC Authentication",
                    isEnterprise: true,
                    isOpenSource: false,
                    description: {
                        text: "Access multiple applications with one set of login credentials",
                        link: "/docs/enterprise/auth/sso",
                    },
                },
                {
                    title: "Role-Based Access Control (RBAC)",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Manage access to workflows and resources by assigning Roles to Users, Groups, and Service Accounts",
                        link: "/docs/enterprise/auth/rbac",
                    },
                },
                {
                    title: "Multi-Tenancy Support",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Isolate multiple environments within a single Kestra instance",
                        link: "/docs/enterprise/governance/tenants",
                    },
                },
                {
                    title: "Audit Logs & Revision History",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Record all activities made by all users on the resources created inside Kestra",
                        link: "/docs/enterprise/governance/audit-logs",
                    },
                },
                {
                    title: "Secret Manager Integrations",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Store sensitive information securely.",
                        link: "/docs/enterprise/governance/secrets-manager",
                    },
                },
                {
                    title: "Namespace-Level Permissions",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Govern secrets, variables, and plugin defaults on a namespace level.",
                        link: "/docs/enterprise/governance/namespace-management",
                    },
                },
                {
                    title: "Worker Security Isolation",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Isolate your executions on dedicated tenants",
                        link: "/docs/enterprise/scalability/worker-group",
                    },
                },
                {
                    title: "Encryption & Fault Tolerance",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Built-in encryption and workflow reliability with automatic retries and state persistence",
                        link: "/docs",
                    },
                },
                {
                    title: "SCIM Directory Sync",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Sync users and groups from your Identity Provider to Kestra",
                        link: "/docs/enterprise/auth/scim",
                    },
                },
                {
                    title: "User Invitations",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Streamlined user onboarding with invitations",
                        link: "/docs/enterprise/auth/invitations",
                    },
                },
                {
                    title: "Announcements",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Communicate planned maintenance or incidents with in-app banners",
                        link: "/docs/enterprise/instance/announcements",
                    },
                },
                {
                    title: "Log Shippers",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Manage and distribute logs across your entire infrastructure",
                        link: "/docs/enterprise/governance/logshipper",
                    },
                },
                {
                    title: "SOC 2",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "SOC 2 compliance",
                        link: "/trust",
                    },
                },
            ],
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
                        link: "/docs/enterprise/governance/custom-blueprints",
                    },
                },
                {
                    title: "Full-Text Search on Task Runs",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Manage Task Runs in one place",
                        link: "/docs/workflow-components/tasks/task-runs",
                    },
                },
                {
                    title: "Centralized User & Permission Management",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Give users restricted access or full control over your Kestra instance",
                        link: "/docs/enterprise/auth/rbac#permissions",
                    },
                },
                {
                    title: "Onboarding & Training Support",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Get your team using Kestra as it full potential with the help of our experts",
                        link: "/docs",
                    },
                },
                {
                    title: "Customer Success Program with SLAs",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Get dedicated support with a guaranteed Service Level Agreement",
                        link: "/docs",
                    },
                },
                {
                    title: "Namespace-Level Secrets Management",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Configure secrets, plugin defaults, and variables that can be used within any flow in a given namespace",
                        link: "/docs/enterprise/governance/namespace-management#namespace-level-features",
                    },
                },
                {
                    title: "Apps",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Build custom UIs to interact with Kestra from the outside world",
                        link: "/docs/enterprise/scalability/apps",
                    },
                },
                {
                    title: "Apps Catalog",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Browse and manage custom applications built with Kestra",
                        link: "/docs/enterprise/scalability/apps#app-catalog",
                    },
                },
                {
                    title: "Unit Tests",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Automated, isolated tests for your Kestra flows with fixtures and assertions to avoid regressions in production",
                        link: "/blogs/introducing-unit-tests",
                    },
                },
                {
                    title: "Custom Dashboards",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Build custom dashboards for monitoring and analytics",
                        link: "/docs/ui/dashboard",
                    },
                },
                {
                    title: "Bookmarks",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Save and organize frequently accessed workflows and resources",
                        link: "/docs/ui/bookmarks",
                    },
                },
                {
                    title: "UI Localization",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Access the UI in one of 12 supported languages",
                        link: "/blogs/release-0-19#localization-ui",
                    },
                },
                {
                    title: "In-app Versioned Docs",
                    isOpenSource: true,
                    isEnterprise: true,
                    description: {
                        text: "Contextual documentation integrated into the UI",
                        link: "/blogs/release-0-19#in-app-versioning-for-docs-and-blueprints",
                    },
                },
                {
                    title: "Plugin Versioning",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Use multiple versions of a plugin depending on your instance requirements and upgrade path",
                        link: "/docs/enterprise/instance/versioned-plugins",
                    },
                },
                {
                    title: "Customizable UI Links",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Customize navigation and external links in the UI",
                        link: "/docs/configuration#ee-sidebar-configuration",
                    },
                },
            ],
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
                        link: "/docs/administrator-guide/high-availability",
                    },
                },
                {
                    title: "Worker Groups for Distributed Tasks",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "A set of workers that can be explicitly targeted for task execution or polling trigger evaluation",
                        link: "/docs/enterprise/scalability/worker-group",
                    },
                },
                {
                    title: "Task Runners",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Offload compute-intensive tasks to remote environments",
                        link: "/docs/task-runners",
                    },
                },
                {
                    title: "Service Accounts & API Tokens",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Create applications with programmatic API access or create token for real users",
                        link: "/docs/enterprise/auth/service-accounts",
                    },
                },
                {
                    title: "Dedicated Storage & Tenant Isolation",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Add extra security measures to your Kestra instance to isolate access",
                        link: "/docs/enterprise/governance/worker-isolation",
                    },
                },
                {
                    title: "Backup & Restore",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Automated backup and restore for disaster recovery",
                        link: "/docs/administrator-guide/backup-and-restore",
                    },
                },
                {
                    title: "Maintenance Mode",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Graceful maintenance mode for system updates and maintenance",
                        link: "/docs/enterprise/instance/maintenance-mode",
                    },
                },
                {
                    title: "Cluster Monitoring & Custom Storage",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Monitor cluster health and performance. Support for plugging in your own storage backend",
                        link: "/docs",
                    },
                },
                {
                    title: "High-Throughput Event Handling",
                    isOpenSource: false,
                    isEnterprise: true,
                    description: {
                        text: "Handle large volumes of events per second with built-in parallelism, scaling, and queue management",
                        link: "/docs",
                    },
                },
            ],
        },
    ]
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";
    .shadow {
        box-shadow: 0px 2px 0px 0px #efefef !important;
        td {
            > span {
                margin-top: 25px !important;
            }
        }
    }
    .close-svg-red,
    .check-svg-purple {
        width: 24px;
        height: auto;
    }
    :deep(.close-svg-red > svg) {
        color: #fd7278 !important;
        font-size: 24px !important;
    }
    :deep(.check-svg-purple > svg) {
        color: #8405ff !important;
        font-size: 24px !important;
    }
    .info {
        width: 14px;
        height: auto;
    }

    :deep(.info > svg) {
        position: absolute;
        bottom: -0.23em;
        color: #b9b9ba !important;

        &:hover {
            color: #646465 !important;
            transition: color 200ms ease-in-out;
        }
    }

    .enterprise-btn {
        &:hover {
            background-color: #8255ff;
        }
        margin-top: 8px;
        display: flex;
        width: 100%;
        justify-content: center;
        color: $white !important;
        padding: 9px 0;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 700;
        background-color: #7117ff;
    }

    .edition-btn {
        &:hover {
            background: #f2f5f8;
        }
        margin-top: 8px;
        display: flex;
        width: 100%;
        justify-content: center;
        color: $black-2 !important;
        padding: 9px 0;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 700;
        background-color: transparent;
        border: 1px solid #b0b0b0;
    }

    .container {
        @include media-breakpoint-down(sm) {
            padding: 0 $rem-2;
        }
    }

    .table-content {
        background-color: #ffffff;
        padding: 100px 0;

        @media screen and (max-width: 824px) {
            display: none;
        }

        .table-responsive {
            overflow: unset;
            max-width: 1140px;
            padding: 0;
        }

        h3 {
            color: $black-2;
            font-size: 40px;
            text-align: center;
            padding-bottom: 40px;
        }

        :deep(svg) {
            font-size: 16px;
        }

        .border-radius {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }

        .table {
            overflow: unset;
            background-color: $white !important;
            border-radius: 8px;
            border: none;

            .border-top-transparent {
                border-top: 16px solid transparent;
            }

            .t-r-heading-text {
                display: flex;
                color: $black-2;
                line-height: 24px;
                max-height: 74px;

                span {
                    margin-top: 32px;
                    font-weight: 700;
                    font-size: 18px !important;
                }
            }

            .t-head {
                background: #ffffff;
                border: none;
                z-index: 200;
                position: sticky;
                top: 67px;
                @include media-breakpoint-down(xl) {
                    top: 64px;
                }

                tr th div {
                    padding-top: 62px;
                }

                tr th:last-child {
                    .border-radius {
                        border-left: 1px solid #7117ff;
                        border-right: 1px solid #7117ff;
                        border-top: 1px solid #7117ff;
                    }
                }

                .border-bottom-elem {
                    position: absolute;
                    width: 100%;
                    z-index: 100;
                    padding: 0 16px 0 44px;

                    @include media-breakpoint-down(xl) {
                        padding: 0 16px;
                    }
                    div {
                        padding: 0;
                        width: 100%;
                        border-bottom: 1px solid #b0b0b0;
                    }
                }
            }

            .heading-bg {
                min-height: 74px !important;
            }

            .bg-gray {
                min-height: 45px;
                padding: 10px $rem-2;
                background-color: #f8f8f8;
            }

            .t-head-body {
                tr:last-child td .bg-gray {
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                }
                tr td:last-child .bg-gray {
                    border-left: 1px solid $purple-15;
                    border-right: 1px solid $purple-15;
                }

                tr:first-child td:last-child .bg-gray {
                    border-top: none;
                }

                tr:last-child td:last-child .bg-gray {
                    border-bottom: 1px solid $purple-15;
                }
            }

            .t-head-title {
                border: none;
                font-size: $font-size-md;
                font-weight: 700;
                line-height: 1.5rem;
                padding: 0 $rem-1;

                p {
                    margin: 0;
                    white-space: nowrap;
                    color: $black-2;
                    font-size: 18px;
                    line-height: 24px;
                    font-weight: 400;
                }

                span {
                    color: #827dfe;
                    line-height: 28px;
                    font-weight: 400;
                }
            }

            .t-head-body {
                .tick {
                    text-align: center;
                }
                .sticky-tr {
                    position: sticky;
                    top: 240px;
                    background: #ffffff;
                    z-index: 100;
                }

                tr {
                    line-height: 16px;
                    td {
                        min-width: 358px;
                        font-size: $font-size-base;
                        padding: 0 $rem-1;

                        @include media-breakpoint-down(xl) {
                            min-width: 300px;
                        }
                    }
                }
            }

            .t-border-data {
                border-bottom: none;
                color: $black-2;

                .enterprise-text {
                    font-size: 14px;
                    font-weight: 400;
                    color: #000000;
                }
            }

            .t-border-data-first-block {
                border-bottom: none;
                vertical-align: middle;

                @include media-breakpoint-down(xl) {
                    min-width: unset !important;
                    padding-left: $rem-1 !important;
                }

                span {
                    color: $black-2;
                    font-size: 14px;
                }
            }
        }

        .table-dark {
            --bs-table-bg: $black-2 !important;
            color: transparent !important;
            outline: none !important;
        }
    }

    .collapsed-table {
        background-color: #ffffff;
        padding: $rem-4 0;
        display: none;

        @media screen and (max-width: 824px) {
            display: block;
        }

        .buttons {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;

            .enterprs-btn {
                padding: $rem-1 30px;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-width: 160px;
                background-color: #000000;

                p {
                    white-space: nowrap;
                    margin: 0;
                    color: $white;
                    font-size: $rem-1;
                    font-weight: 600;
                    line-height: 20px;
                    text-align: center;
                }

                span {
                    color: #b9b9ba;
                    font-size: 12px;
                    font-weight: 400;
                    text-align: left;
                    line-height: 22px;
                }
            }

            .ops-btn {
                padding: $rem-1 30px;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-width: 160px;
                background-color: #e1e1e1;

                p {
                    white-space: nowrap;
                    margin: 0;
                    font-size: $rem-1;
                    font-weight: 600;
                    line-height: 20px;
                    text-align: center;
                }

                span {
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 22px;
                    text-align: left;
                    color: #3d3d3f;
                }
            }
        }

        .features {
            margin-top: $rem-1;

            .border-bottom-none {
                border-bottom: 0 !important;
            }

            .feature-row {
                width: 100%;
                min-height: 60px;
                display: grid;
                grid-template-columns: 70% 30%;
                align-items: center;

                :deep(svg) {
                    font-size: 16px;
                }

                &:first-child {
                    border-top: 1px solid $black-1;
                }

                .feature-row-title {
                    padding: 8px;
                    display: flex;
                    height: 100%;
                    align-items: center;
                    border: 1px solid $black-1;
                    border-left: 0;
                    border-top: 0;
                    color: $black-1;

                    span {
                        display: flex;
                        align-items: center;
                        justify-content: end;
                        width: 100%;
                        font-size: 14px;
                        font-weight: 400;
                        color: #000000;
                    }

                    .tooltip-container {
                        position: relative;

                        .tooltip-content {
                            top: calc(100% + 15px);
                            right: -20px;
                            left: auto;
                            transform: none;

                            &::before,
                            &::after {
                                right: 20px;
                                left: auto;
                                transform: none;
                            }

                            &::before {
                                top: -8px;
                                border-left: 8px solid transparent;
                                border-right: 8px solid transparent;
                                border-bottom: 8px solid #e5e5e5;
                            }

                            &::after {
                                top: -7px;
                                border-left: 7px solid transparent;
                                border-right: 7px solid transparent;
                                border-bottom: 7px solid #ffffff;
                            }
                        }
                    }
                }

                .feature-row-access {
                    display: flex;
                    height: 100%;
                    align-items: center;
                    border-bottom: 1px solid $black-1;
                    color: $black-1;
                    justify-content: center;
                    padding: 8px;

                    span {
                        text-align: center;
                        font-size: 14px;
                        font-weight: 400;
                        color: #000000;
                    }
                }
            }
        }
    }

    .tooltip-container {
        position: relative;
        display: inline-block;
        margin-left: 4px;

        .tooltip-content {
            position: absolute;
            opacity: 0;
            visibility: hidden;
            top: calc(100% + 10px);
            left: 30%;
            transform: translateX(-30%);
            background-color: $white;
            border: 1px solid #9797a6;
            border-radius: 4px;
            padding: 8px 16px;
            width: max-content;
            max-width: 250px;
            z-index: 1000;
            font-size: $font-size-xs;
            line-height: 20px;
            white-space: normal;
            transition:
                opacity 0.3s ease 0.2s,
                visibility 0.3s ease 0.2s;

            &::before,
            &::after {
                content: "";
                position: absolute;
                left: 30%;
                transform: translateX(-30%);
            }

            &::before {
                top: -8px;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-bottom: 8px solid #9797a6;
            }

            &::after {
                top: -7px;
                border-left: 7px solid transparent;
                border-right: 7px solid transparent;
                border-bottom: 7px solid #ffffff;
            }

            a {
                display: inline-block;
                color: #8405ff;
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                }
            }
        }

        &:hover .tooltip-content {
            opacity: 1;
            visibility: visible;
            transition-delay: 0s;
        }

        .tooltip-content:hover {
            opacity: 1;
            visibility: visible;
        }
    }
</style>