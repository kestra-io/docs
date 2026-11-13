import type { Props as HeroProps } from "~/components/lp/shared/Hero.astro"
import type { Props as PlatformProps } from "~/components/lp/shared/Platform.astro"
import type { Props as MigrationProps } from "~/components/lp/shared/Migration.astro"
import type { Props as TranslationProps } from "~/components/lp/shared/Translation.astro"
import type { Props as ProofProps } from "~/components/lp/shared/Proof.astro"
import type { Props as FeaturesProps } from "~/components/lp/shared/Features.astro"
import type { Props as StackProps } from "~/components/lp/shared/Stack.astro"
import type { Props as UseCasesProps } from "~/components/lp/shared/UseCases.astro"
import type { Props as FaqProps } from "~/components/lp/shared/Faq.astro"
import type { Props as ClosingBannerProps } from "~/components/lp/shared/ClosingBanner.astro"

import SelfServiceIcon from "./assets/automate-self-service.svg"
import DayTwoIcon from "./assets/automate-day-2.svg"
import DecommissioningIcon from "./assets/automate-decommissioning.svg"
import IntegrationsIcon from "./assets/automate-integrations.svg"

import {
    selfHostedFeatures,
    selfHostedReassurance,
} from "~/components/lp/shared/selfHostedCopy"

const reasons: PlatformProps["cards"] = [
    {
        kicker: "Pricing",
        title: "No expensive renewals at term.",
        body: "Kestra isn't sold inside a hypervisor bundle or priced per execution: the bill follows how widely you deploy it, not your VMware renewal.",
        icon: "mdi:cash-multiple",
    },
    {
        kicker: "Open by design",
        title: "Orchestrate your whole infrastructure, not just VMware.",
        body: "vSphere, Nutanix, Proxmox, the public clouds, Terraform, Ansible and your ITSM from one place. VCF Automation 9.1.1 disables native AWS, Azure and GCP endpoints by default.",
        icon: "mdi:lock-open-variant-outline",
    },
    {
        kicker: "Any language, declarative",
        title: "Bring any language. Declare the workflow.",
        body: "Flows are YAML any engineer can read and review in Git, with the logic in Python, PowerShell, Shell or Ansible, instead of vRO JavaScript only a few people can change.",
        icon: "mdi:code-braces",
    },
]

const stages: MigrationProps["steps"] = [
    {
        number: "01",
        title: "Assess",
        body: "The Migration Assistant reads your vRO and vRA exports and tells you what to retire, merge or convert.",
    },
    {
        number: "02",
        title: "Prove",
        body: "A proof of concept on your own workflows, with your security team in the room.",
    },
    {
        number: "03",
        title: "Migrate",
        body: "Move in waves by pattern. Both systems run side by side.",
    },
    {
        number: "04",
        title: "Exit",
        body: "Switch off vRA wave by wave and end the licence at renewal.",
    },
]

const mapping: TranslationProps["rows"] = [
    {
        from: "Service Broker catalog items and request forms",
        to: "Kestra Apps as the self-service form, or your ITSM portal calling Kestra",
    },
    {
        from: "Cloud templates",
        to: "A flow per template pattern, provisioning through Terraform or the vSphere and Nutanix plugins",
    },
    {
        from: "vRO workflows and actions",
        to: "Flows and subflows, with the JavaScript moved to Python, PowerShell or Shell tasks",
    },
    {
        from: "Event subscriptions and vRO schedules",
        to: "Triggers: webhook, message queue, another flow, or a schedule",
    },
    {
        from: "Configuration elements and SecureStrings",
        to: "KV Store and secrets",
    },
    {
        from: "Resource elements and script modules",
        to: "Namespace files, minus the modules a plugin already covers",
    },
    {
        from: "Deployment records and inventory",
        to: "Kestra Assets, or the CMDB you already run",
    },
    {
        from: "Resource actions: resize, snapshot, power",
        to: "Flows run against the asset or the CMDB record",
    },
    {
        from: "Approval policies",
        to: "A human approval step in the flow, or your ITSM approval",
    },
]

const cases: ProofProps["cases"] = [
    {
        status: "Migration complete",
        title: "Fortune 500 manufacturer, off Aria Automation across IT and OT",
        stats: [
            {
                value: "90%",
                label: "lower licensing cost than Aria Automation",
            },
            { value: "30×", label: "faster delivery" },
            { value: "4 + 1", label: "isolated platforms, for OT and IT" },
        ],
        body: "vRA and vRO replaced together: catalog, request forms, orchestration and the vCenter integration. Ansible and ServiceNow stayed.",
    },
    {
        status: "Go-live targeted January 2027",
        title: "Bundesagentur für Arbeit, fully air-gapped",
        stats: [
            { value: "1,600", label: "vRO workflows" },
            { value: "2,000", label: "vRO actions" },
            { value: "50,000+", label: "cloud resources supported" },
        ],
        body: "On-premises with no outbound connectivity. Kestra Apps for the catalog, Kestra Assets for the resource inventory.",
    },
    {
        status: "Assessed",
        title: "Global systems integrator, several vRO instances",
        stats: [
            { value: "3,000", label: "workflows" },
            { value: "3", label: "production vRO nodes" },
            { value: "100+", label: "services in its ServiceNow catalog" },
        ],
        body: "The assessment sized several thousand workflows spread across instances and tied to an established service catalog.",
    },
]

const automations: StackProps["columns"] = [
    {
        Glyph: SelfServiceIcon,
        title: "Self-service portal and VM provisioning",
        items: [
            "Request form in Kestra Apps or your ITSM portal",
            "Approval before the build",
            "VM build",
            "Post-install by server type and site",
        ],
    },
    {
        Glyph: DayTwoIcon,
        title: "Day-2 runbooks",
        items: ["Patching", "Snapshots", "Certificate rotation", "Resizing"],
    },
    {
        Glyph: DecommissioningIcon,
        title: "Decommissioning",
        items: [
            "Delete the VM",
            "Clean up AD, DNS and IPAM",
            "Close the ticket",
        ],
    },
    {
        Glyph: IntegrationsIcon,
        title: "Integrations",
        items: [
            "ServiceNow",
            "Infoblox",
            "Active Directory",
            "Microsoft Teams",
            "vCenter",
            "Terraform and Ansible",
        ],
    },
]

const ctaBullets: UseCasesProps["bullets"] = [
    {
        text: "We run the Migration Assistant on a sanitised export with you.",
        strong: true,
    },
    { text: "You get a wave plan.", strong: false },
    { text: "You get an exit plan timed to your renewal.", strong: false },
]

const faqItems: FaqProps["items"] = [
    {
        question:
            "Are vRealize Automation, Aria Automation and VCF Automation the same product?",
        answer: "Yes. VMware vRealize Automation (vRA) was renamed VMware Aria Automation, then VCF Automation in VMware Cloud Foundation 9. vRealize Orchestrator (vRO) became Aria Automation Orchestrator and now ships inside VCF Automation. The migration method is the same whichever name your version carries.",
    },
    {
        question: "Is Kestra a vRA alternative or a vRO replacement?",
        answer: "Both. Kestra replaces the vRO workflow engine with flows and subflows, and the vRA front end with Kestra Apps for the self-service catalog and Kestra Assets for the deployment inventory. If your catalog lives in ServiceNow or another ITSM portal, it can stay there and call Kestra.",
    },
    {
        question: "How is vRA priced since Broadcom?",
        answer: 'vRA is no longer sold on its own. It ships inside VMware Cloud Foundation, licensed per core on subscription, so the automation bill tracks the size of the hypervisor footprint rather than how much you automate. Gartner warned that most VMware customers\' bills could grow by 200 to 500 percent at their next renewal, <a href="https://www.theregister.com/2024/08/26/vmware_explore_preview/" target="_blank" rel="noopener">as reported by The Register</a>. The calculator above sets that renewal against the cost of migrating.',
    },
    {
        question: "Do we have to leave vSphere?",
        answer: "No. Kestra runs with vSphere and VCF today, and with Nutanix, Proxmox or any hypervisor you move to.",
    },
    {
        question:
            "We run vSphere on-prem and workloads in AWS, Azure or GCP. Can one platform cover both?",
        answer: 'Yes. The same flows call vCenter on-prem and the AWS, Azure and GCP APIs, Terraform and Ansible, with one audit trail and one access model. That matters since VCF Automation 9.1.1 <a href="https://knowledge.broadcom.com/external/article/448993" target="_blank" rel="noopener">disables native public cloud endpoints by default</a>.',
    },
    {
        question: "Can vRA and Kestra run side by side?",
        answer: "Yes, for as long as each wave needs.",
    },
    {
        question: "Do our vRO workflows have to be rewritten?",
        answer: "Wrappers are called as they are; the rest is converted or rebuilt, and the Migration Assistant tells you which. Converted flows are tested against a simulated copy of your environment before they reach yours.",
    },
    {
        question:
            "Can it run fully self-hosted, on-prem, or air-gapped, with our data never leaving our network?",
        answer: "Yes. Self-hosted is a first-class deployment rather than a workaround. Workers run inside your VPC or on-prem, you bring your own secret manager, and Kestra holds no access to your data. Worker Groups let one control plane reach physically isolated networks, and licensing works offline so a fully air-gapped install is supported.",
    },
    {
        question: "How is Kestra priced?",
        answer: "Kestra does not price per execution. The model scales with how broadly the platform is deployed rather than how often your workflows run, so adding volume does not change the bill. Enterprise pricing depends on deployment scope and support tier, and we walk through it on the call.",
    },
    {
        question: "How long does a migration take?",
        answer: "It depends on the environment. The assessment gives you the wave plan and the dates. A Fortune 500 manufacturer replaced vRA and vRO in about twelve months, with both running side by side until each wave was verified.",
    },
    {
        question: "Do you help teams moving off vRA and vRO?",
        answer: 'Yes. The <a href="/resources/migration/vra">vRA migration guide</a> covers the method stage by stage, and the open-source <a href="/resources/migration/vra/assistant">Migration Assistant</a> reads your vRO package on your own machine and writes the migration brief.',
    },
    {
        question:
            "We already use Kestra. How do we assess our vRO workflows ourselves?",
        answer: 'Run the <a href="/resources/migration/vra/assistant">Kestra Migration Assistant for vRA</a>, a free, open-source command-line tool. It reads your vRO package, and optionally your vRA export, on your own machine, sends nothing to Kestra, and writes a brief: what each workflow does and what it calls, which Kestra plugins cover those systems, whether each element converts directly or needs a redesign, and a plan in waves. It can use a model you host, or none at all, so it also runs air-gapped. The conversion itself is then done in Kestra, starting from the brief.',
    },
]

export const vraMigrationContent = {
    title: "Migrate off VMware vRA, Aria and VCF Automation",
    description:
        "Kestra replaces vRealize Automation (now Aria Automation and VCF Automation) and vRealize Orchestrator (vRO) with one governed orchestration platform on your own infrastructure. Keep your Terraform, Ansible and scripts.",

    hero: {
        formTitle: "Bring your VMware renewal quote.",
        companies: [
            "bundesagentur",
            "itzbund",
            "jpmorgan",
            "t-system",
            "amdocs",
            "fila",
            "bloomberg",
            "xiaomi",
            "apple",
        ],
    } satisfies Omit<HeroProps, "routePath">,

    platform: {
        heading: "Switch to orchestration without lock-in",
        cards: reasons,
    } satisfies PlatformProps,

    migration: {
        heading: "Leave vRA in four stages, with vRA still running",
        sub: "Kestra runs alongside vRA until each wave is verified.",
        steps: stages,
    } satisfies MigrationProps,

    translation: {
        heading: "What vRA and vRO become in Kestra",
        sub: "A starting map. Many objects are retired or merged before anything is converted.",
        fromLabel: "vRA / vRO",
        rows: mapping,
    } satisfies TranslationProps,

    proof: {
        heading: "Enterprise vRA environments, at every stage",
        sub: "From assessment to completed migration.",
        cases,
    } satisfies ProofProps,

    features: { features: selfHostedFeatures } satisfies FeaturesProps,

    stack: {
        heading: "What teams automate after vRA",
        sub: "The VMware automation that ran in vRA and vRO, rebuilt as flows that also reach beyond vSphere.",
        columns: automations,
        glyphSize: 72,
    } satisfies StackProps,

    useCases: {
        headingLines: ["See it on your", "own vRO workflows"],
        bullets: ctaBullets,
    } satisfies Omit<UseCasesProps, "routePath">,

    faq: { items: faqItems } satisfies FaqProps,

    closingBanner: {
        heading: "Bring your VMware renewal quote",
        sub: "We'll set the exit plan against your renewal date.",
        reassurance: selfHostedReassurance,
    } satisfies ClosingBannerProps,
}
