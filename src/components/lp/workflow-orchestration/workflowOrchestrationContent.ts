import type { Props as HeroProps } from "~/components/lp/shared/Hero.astro"
import type { Props as PlatformProps } from "~/components/lp/shared/Platform.astro"
import type { Props as MigrationProps } from "~/components/lp/shared/Migration.astro"
import type { Props as FeaturesProps } from "~/components/lp/shared/Features.astro"
import type { Props as StackProps } from "~/components/lp/shared/Stack.astro"
import type { Props as UseCasesProps } from "~/components/lp/shared/UseCases.astro"
import type { Props as FaqProps } from "~/components/lp/shared/Faq.astro"
import type { Props as ClosingBannerProps } from "~/components/lp/shared/ClosingBanner.astro"

import DataPipelinesIcon from "~/components/lp/shared/assets/stack-data-pipelines.svg"
import InfraPlatformIcon from "~/components/lp/shared/assets/stack-infra-platform.svg"
import AppMicroservicesIcon from "~/components/lp/shared/assets/stack-app-microservices.svg"
import BusinessProcessesIcon from "~/components/lp/shared/assets/stack-business-processes.svg"

import {
    selfHostedFeatures,
    selfHostedReassurance,
} from "~/components/lp/shared/selfHostedCopy"

const stages: MigrationProps["steps"] = [
    {
        number: "01",
        title: "Run your first workflow",
        body: "Take one you already have. Your scripts run as they are, in whatever language they were written in. No rewrite, no commitment.",
    },
    {
        number: "02",
        title: "Migrate at your own pace",
        body: "Move the workflows that hurt the most first. The old tools keep running next to Kestra until you decide otherwise, team by team.",
    },
    {
        number: "03",
        title: "Switch off your old stack",
        body: "When the last workflow moves, decommission what it replaced: the licenses, the servers, and the maintenance nobody will miss.",
    },
]

const automations: StackProps["columns"] = [
    {
        Glyph: DataPipelinesIcon,
        title: "Data pipelines",
        items: [
            "Ingestion from warehouses, lakes, APIs and SaaS sources",
            "Dbt runs that start only once ingestion has actually finished",
            "Data-quality gates before anything downstream reads the table",
            "Backfills across hundreds of days without hand-rolling a loop",
        ],
    },
    {
        Glyph: InfraPlatformIcon,
        title: "Infra & platform",
        items: [
            "VM, cluster and environment provisioning with Terraform or Ansible",
            "Certificate rotation, patching and scheduled maintenance",
            "Self-service platform actions your teams can trigger safely",
            "Cron entries and legacy scheduler jobs, moved across as they are",
        ],
    },
    {
        Glyph: AppMicroservicesIcon,
        title: "App & microservices",
        items: [
            "API and microservice calls sequenced with retries, timeouts and state",
            "Event-driven choreography on top of streaming and messaging layer",
            "Handoffs picked up where ServiceNow or Salesforce automation stops",
            "ERP and core-banking migrations where the workflows keep running through the cutover",
        ],
    },
    {
        Glyph: BusinessProcessesIcon,
        title: "Business processes",
        items: [
            "Employee onboarding and offboarding across directory, cloud and email",
            "Order, invoice and settlement steps across internal systems",
            "Reports generated and distributed on a schedule or an event",
            "Approvals with a human step in the middle of the flow",
        ],
    },
]

const ctaBullets: UseCasesProps["bullets"] = [
    {
        text: "We'll discuss your requirements for security, scale, and language-agnostic support.",
        strong: true,
    },
    {
        text: "See exactly how Kestra's architecture resolves the friction points in your stack.",
        strong: false,
    },
    {
        text: "See how Kestra fits your platform, and get a roadmap for your orchestration needs.",
        strong: false,
    },
]

const faqItems: FaqProps["items"] = [
    {
        question:
            "Can we run it fully self-hosted, on-prem, or air-gapped, with our data never leaving our network?",
        answer: "Yes. Self-hosted is a first-class deployment rather than a workaround. Workers run inside your VPC or on-prem, you bring your own secret manager, and Kestra holds no access to your data. Worker Groups let one control plane reach physically isolated networks, and licensing works offline so a fully air-gapped install is supported.",
    },
    {
        question:
            "Does it support SSO/SAML, RBAC, audit logs, and multi-tenant isolation?",
        answer: "Yes, all four. Fine-grained role-based access control, SSO and SCIM, full audit logs, and native multi-tenancy where namespace isolation lets dozens of teams run on one deployment.",
    },
    {
        question: "Do we need Kubernetes?",
        answer: "No. Kestra runs on a single VM with Docker if that's what you have. Kubernetes is supported and common at scale, and it is not a requirement to start or to run in production.",
    },
    {
        question: "How do we avoid lock-in?",
        answer: "The engine is open source under Apache 2.0, and it is the same engine that runs in production. Your workflows are declarative files in your own Git repository, so the definitions stay yours whether or not you stay. Any script or API call runs natively as a task, so you are never waiting on a proprietary connector.",
    },
    {
        question:
            "Can one platform run data, infrastructure, application and business workflows, or do we end up with two orchestrators?",
        answer: "One platform. All four run on the same engine, with the same access model and the same audit trail. Teams keep their own namespaces, so a single deployment serves many teams without them colliding.",
    },
    {
        question: "How is Kestra priced?",
        answer: "Kestra does not price per execution. The model scales with how broadly the platform is deployed rather than how often your workflows run, so adding volume or agent steps does not change the bill. Enterprise pricing depends on deployment scope and support tier, and we walk through it on the call.",
    },
]

/** Takes the formatted plugin count, which the Platform and Stack copy quote. */
export const getWorkflowOrchestrationContent = (totalPlugins: string) => ({
    title: "Unified Workflow Orchestration Platform for the AI era",
    description:
        "Build, run, and govern every workflow across data, infrastructure, agent, and business processes. Any language, on your own infrastructure.",

    hero: {
        formTitle: "Discuss your orchestration strategy",
    } satisfies Omit<HeroProps, "routePath">,

    platform: {
        heading: "One platform. Every workflow. Your infrastructure.",
        cards: [
            {
                kicker: "Control",
                title: "One control plane for data, infra, AI, and business processes.",
                body: "Replace your legacy schedulers with one governed platform, running on top of the tools you already have.",
                icon: "mdi:monitor-dashboard",
            },
            {
                kicker: "Declarative workflows",
                title: "Every job visible, owned, and audited.",
                body: "Including the ones that used to live in cron tabs and legacy scripts. Declarative workflows versioned in Git, editable from a full UI, with RBAC and audit logs built in.",
                icon: "mdi:eye-outline",
            },
            {
                kicker: "Language-agnostic",
                title: "Any language. Every engineer builds.",
                body: `Python, Java, Shell, Node, and ${totalPlugins}+ plugins for your databases, clouds, and SaaS tools. No rewrites to adopt, so one platform actually replaces many.`,
                icon: "mdi:cube-outline",
            },
        ],
    } satisfies PlatformProps,

    migration: {
        heading: "Replace your Legacy Scheduler",
        sub: "Kestra runs alongside your current tools for as long as you need them.",
        steps: stages,
    } satisfies MigrationProps,

    features: { features: selfHostedFeatures } satisfies FeaturesProps,

    stack: {
        heading: "Unified Orchestration Across Your Stack",
        sub: `API-first, with ${totalPlugins}+ plugins for your databases, clouds, and internal systems`,
        columns: automations,
    } satisfies StackProps,

    useCases: {
        headingLines: ["See it on", "your use cases"],
        bullets: ctaBullets,
    } satisfies Omit<UseCasesProps, "routePath">,

    faq: { items: faqItems } satisfies FaqProps,

    closingBanner: {
        heading: "Bring your own list of questions",
        sub: "We'll go through them against your own architecture.",
        reassurance: selfHostedReassurance,
    } satisfies ClosingBannerProps,
})
