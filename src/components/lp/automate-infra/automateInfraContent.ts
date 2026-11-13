import type { Props as HeroProps } from "~/components/lp/shared/Hero.astro"
import type { Props as PlatformProps } from "~/components/lp/shared/Platform.astro"
import type { Props as TranslationProps } from "~/components/lp/shared/Translation.astro"
import type { Props as UseCasesProps } from "~/components/lp/shared/UseCases.astro"
import type { Props as FaqProps } from "~/components/lp/shared/Faq.astro"
import type { Props as ClosingBannerProps } from "~/components/lp/shared/ClosingBanner.astro"

const reasons: PlatformProps["cards"] = [
    {
        kicker: "In Git",
        title: "One YAML file per workflow.",
        body: "Review a change in a pull request and roll it back like any other code. The editor in the UI writes the same YAML.",
        icon: "mdi:file-code-outline",
    },
    {
        kicker: "No rewrite",
        title: "Every tool keeps its job.",
        body: "Your playbooks, modules and scripts run as they are, each in its own container. Kestra runs the order between them.",
        icon: "mdi:console",
    },
    {
        kicker: "Around every step",
        title: "Triggers, approvals, retries and logs.",
        body: "A schedule, a webhook or a Git push starts a flow. A failed step retries, a pause waits for approval, and every run keeps its logs.",
        icon: "mdi:state-machine",
    },
]

const rows: TranslationProps["rows"] = [
    {
        from: "Cron jobs and systemd timers on scattered hosts",
        to: "Schedule triggers that run the same scripts, with logs and alerts in one place",
    },
    {
        from: "Ansible playbooks run from a laptop, Semaphore or AWX",
        to: "Ansible tasks with the same playbooks and inventories",
    },
    {
        from: "Terraform or OpenTofu applied from a laptop or a CI job",
        to: "Terraform and OpenTofu tasks on your existing modules and state backend",
    },
    {
        from: "Rundeck or Jenkins jobs stored in a database",
        to: "Flows stored as YAML files in Git",
    },
]

const ctaBullets: UseCasesProps["bullets"] = [
    {
        text: "We go through the requests and runbooks your team handles today.",
        strong: true,
    },
    {
        text: "See them run with individual logins, access per team, approvals and an audit trail.",
        strong: false,
    },
    {
        text: "Requests come in through forms, and the platform team can require approval before anything runs.",
        strong: false,
    },
]

const faqItems: FaqProps["items"] = [
    {
        question: "Is Kestra really open source?",
        answer: "Yes. The engine, the UI and the open-source plugins are Apache 2.0 and on GitHub, and the open-source edition runs in production on its own. The Enterprise Edition adds what a shared, multi-team instance needs: individual logins, access control, secret managers and audit logs.",
    },
    {
        question: "How much memory does it need?",
        answer: "Kestra runs on the JVM and needs at least 2 vCPUs and 4 GiB of memory. A single standalone server with Postgres is enough for a homelab or a small team, and server roles split apart when you need to scale.",
    },
    {
        question: "Does it need root and the Docker socket?",
        answer: "Only for the quickstart. Script tasks run in containers by default, which is why the one-liner mounts the Docker socket and runs as root. You can run tasks as plain processes with the Process task runner instead, or deploy with rootless Podman.",
    },
    {
        question: "How does the open-source edition handle secrets?",
        answer: "As base64-encoded environment variables prefixed with SECRET_, read in flows with the secret() function, so values never sit in the YAML. Vault, AWS, Azure, Google Cloud and other secret managers connect in the Enterprise Edition.",
    },
    {
        question: "Kestra, Semaphore, AWX or Rundeck?",
        answer: "Semaphore and AWX put a UI on running playbooks, and Rundeck runs jobs and runbooks. Kestra chains the steps around them: take a Proxmox snapshot, run the playbook, call a webhook, post to Slack, all in one versioned YAML file. You can also call your existing jobs from a flow and move them across later.",
    },
    {
        question: "What does it cost?",
        answer: "The open-source edition is free. The Enterprise Edition is not priced per execution: the price depends on how broadly it is deployed and the support tier, and we walk through it on the call.",
    },
]

export const automateInfraContent = {
    title: "Infrastructure automation, as code | Kestra",
    description:
        "Kestra is an open-source orchestrator for Terraform, Ansible, OpenTofu and scripts: one YAML file per workflow, versioned in Git, with triggers, approvals, retries and logs. Self-host it with one command.",

    hero: {
        formTitle: "Try it on your own infrastructure",
    } satisfies Omit<HeroProps, "routePath">,

    platform: {
        heading: "How it fits your tools",
        cards: reasons,
    } satisfies PlatformProps,

    translation: {
        heading: "What your current setup becomes",
        sub: "Nothing is rewritten up front. Each piece moves when you are ready.",
        fromLabel: "Today",
        rows,
    } satisfies TranslationProps,

    useCases: {
        headingLines: ["Rolling it out", "to your team?"],
        bullets: ctaBullets,
    } satisfies Omit<UseCasesProps, "routePath">,

    faq: { items: faqItems } satisfies FaqProps,

    closingBanner: {
        heading: "Run your first infra flow",
        sub: "Free, open source and self-hosted. One command, then your first flow.",
        cta: { text: "Read the quickstart", href: "/docs/quickstart" },
        reassurance: "Apache 2.0, self-hosted on your own machines.",
    } satisfies ClosingBannerProps,
}
