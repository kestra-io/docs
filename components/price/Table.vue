<template>
    <div class="container table-responsive">
        <table class="table w-75 container table-dark">
            <thead class="t-head">
                <tr>
                    <th class="t-head-title  t-border-data-title-thead"
                        :class="title == 'Features' ? 'w-50 ps-5' : 'text-center'" v-for="title in  tableHead "
                        :key="title">
                        {{ title }}</th>

                </tr>
            </thead>
            <tbody class="t-head-body">
                <tr :class="item.isOpenSource || item.isEnterprise ? '' : 't-r-heading'" v-for="item in tableData"
                    :key="item.id">
                    <td class="ps-5 t-border-data"
                        :class="item.isEnterprise || item.isOpenSource ? '' : 't-r-heading-text t-border-data-title'">{{
                            item.title }}</td>
                    <td class="tick t-border-data" :class="item.isOpenSource ? '' : 't-border-data-title'">{{
                        item.isOpenSource ? "✓" : "" }}</td>
                    <td class="tick t-border-data">{{ item.isEnterprise ? "✓" : "" }}</td>
                </tr>

            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref } from "vue"
const tableHead = ref([
    "Features",
    'Open source',
    'Enterprise',
])

const tableData = ref([
    {
        id: 1,
        title: "Workflow Creation and Execution",
        isOpenSource: false,
        isEnterprise: false,
    },
    {
        id: 2,
        title: "Embedded code editor",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 3,
        title: "Open-source plugins",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 4,
        title: "Custom plugins",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 5,
        title: "Code versioning & Git integration",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 6,
        title: "Autocompletion and syntax validation",
        isOpenSource: true,
        isEnterprise: true,
    },

    {
        id: 7,
        title: "Live-updating topology view",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 8,
        title: "Dependency management between tasks, subflows and flow event triggers",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 9,
        title: "Workflow Orchestration and Scheduling",
        isOpenSource: false,
        isEnterprise: false,
    },
    {
        id: 10,
        title: "Advanced orchestration engine (sequential and parallel task processing, ditributed mapping)",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 11,
        title: "Concurrency limits",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 12,
        title: "Human-in-the-loop orchestration with pauses for manual approval",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 13,
        title: "Flexible scheduling system (Cron, interval-based and custom conditions)",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 14,
        title: "Event-driven data processing",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 15,
        title: "Event-driven data processing at scale (high throughput)",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 16,
        title: "Custom error handling and on-failure behavior",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 17,
        title: "Automated retries and restarts",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 18,
        title: "Automated notifications on success or failure",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 19,
        title: "Custom internal storage backend",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 20,
        title: "Workflow monitoring, observability & performance optimization",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 21,
        title: "User Interface",
        isOpenSource: false,
        isEnterprise: false,
    },
    {
        id: 22,
        title: "Fine-grained visibility into workflow execution states",
        isOpenSource: true,
        isEnterprise: true,
    },

    {
        id: 23,
        title: "Dashboard about the status of your workflow executions across the instance",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 24,
        title: "Embedded code editor enabling fast feedback loops without deployment overhead",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 25,
        title: "Input validation on manual workflow executions from the UI",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 26,
        title: "Embedded task and trigger documentation",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 27,
        title: "Embedded blueprints with example usage",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 28,
        title: "Custom blueprints showing company-wide usage patterns",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 29,
        title: "Full-text search across task runs",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 30,
        title: "Centralized user & permission management from the UI",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 31,
        title: "Governance over code revision history (who updated the workflow and when)",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 32,
        title: "Namespace-level management for secrets, variables and task configuration",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 33,
        title: "Support to seamlessly switch between environments from the same UI via tenants",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 34,
        title: "Connectivity and Integration",
        isOpenSource: false,
        isEnterprise: false,
    },
    {
        id: 35,
        title: "API-first design: everything can be automated via an API call",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 36,
        title: "Webhook triggers",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 37,
        title: "Webhook triggers at scale capable of handling millions of events",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 38,
        title: "Official Terraform provider for provisioning flows and namespace files",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 39,
        title: "Official Terraform provider to provision all resources incl. users and secrets management",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 40,
        title: "Official support for GitHub Actions, GitLab, Azure DevOps and more CI/CD providers",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 41,
        title: "Community blueprints",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 42,
        title: "Custom blueprints representing company-wide usage patterns",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 43,
        title: "Security and authentication",
        isOpenSource: false,
        isEnterprise: false,
    },
    {
        id: 44,
        title: "OIDC/SSO authentication",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 45,
        title: "Role-Based Access Control",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 46,
        title: "Audit Logs",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 47,
        title: "Custom secrets backends (AWS Secret Manager, Azure Key Vault, Elasticsearch, Google Secret Manager, Hashicorp Vault)",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 48,
        title: "Namespace-level credential store",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 49,
        title: "Namespace-level variable store",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 50,
        title: "Namespace-level task configuration",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 51,
        title: "Namespace-level permissions",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 52,
        title: "Worker security isolation",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 53,
        title: "Deployment and hosting",
        isOpenSource: false,
        isEnterprise: false,
    },
    {
        id: 54,
        title: "Self-hosted deployment",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 55,
        title: "High-Availability with No Single Point of Failure",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 56,
        title: "Worker groups supporting distributed workers",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 57,
        title: "Support & custom development services",
        isOpenSource: false,
        isEnterprise: false,
    },
    {
        id: 58,
        title: "Community support",
        isOpenSource: true,
        isEnterprise: true,
    },
    {
        id: 59,
        title: "Enterprise support with SLAs",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 60,
        title: "Onboarding",
        isOpenSource: false,
        isEnterprise: true,
    },
    {
        id: 61,
        title: "Training",
        isOpenSource: false,
        isEnterprise: true,
    },

])

</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";

.container {
    padding-top: 100px;

}

.t-r-heading {
    background-color: $black-3;
    padding: 1.375rem 2.9rem
}

.t-r-heading-text {
   color: $body-tertiary-color;
   font-weight: 600;
   line-height: 24px;
}

.t-head {
    border-bottom: none;
}

.t-head-body {
    tr {
        td {
            font-size: $font-size-base;
            padding: 1.3rem 2.5rem;
        }
    }
}

.t-head-title {
    font-size: $font-size-md;
    font-weight: 700;
    line-height: 1.5rem;
    padding: 1.375rem 2.9rem;
    background-color: $black-2;
}

.tick {
    color: $green;
    text-align: center;
}

.t-border-data {
    border: 1px solid #1d1d1e;
    border-bottom: none
}

.t-border-data-title {
    border: 1px solid $black-3;
    border-bottom: none
}

.t-border-data-title-thead {
    border: 1px solid $black-3;
    border-top: none
}

.t-desc {
    padding-left: 10px !important;
}

.table {
    background-color: $black-2!important;
    border-radius: 8px;

    border: none;
    tr:first-child td {
        border-top: none;
    }
    tr:last-child td {
        border-bottom: none;
    }
    tr td:first-child {
        border-left: none;
    }
    tr td:last-child {
        border-right: none;
    }
    tr th:first-child {
        border-left: none;
    }
    tr th:last-child {
        border-right: none;
    }
}

.table-dark {
    --bs-table-bg: $black-2 !important;
    color: transparent !important;
    outline: none !important;
}
</style>