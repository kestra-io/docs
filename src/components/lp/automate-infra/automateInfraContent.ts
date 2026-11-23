import type { Props as HeroProps } from "~/components/lp/shared/Hero.astro"
import type { Props as PlatformProps } from "~/components/lp/shared/Platform.astro"
import type { Props as TranslationProps } from "~/components/lp/shared/Translation.astro"
import type { Props as UseCasesProps } from "~/components/lp/shared/UseCases.astro"
import type { Props as FaqProps } from "~/components/lp/shared/Faq.astro"
import type { Props as ClosingBannerProps } from "~/components/lp/shared/ClosingBanner.astro"
import type { AwxHeadline } from "~/components/lp/automate-infra/awxVariant"

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
        event: "lp_infra_quickstart_click",
        reassurance: "Apache 2.0, self-hosted on your own machines.",
    } satisfies ClosingBannerProps,
}

/* ------------------------------------------------------------------------
 * G_AWX variant: shown only to visitors from the AWX/Tower/AAP ads, picked
 * before first paint by the inline script on the page (see awxVariant.ts).
 * --------------------------------------------------------------------- */

/** One headline segment; `grad` paints it with the hero's gradient. */
export type HeadlinePart = { text: string; grad?: "a" | "b" }

export interface AwxHero {
    title: HeadlinePart[]
    lead: string
    strong: string
}

/* One hero per ad group. Every claim here is either on the AWX release-status
 * page or already on this page (the cost FAQ). Not "priced per node": that
 * wording waits for product marketing. */
const awxHeroes: Record<AwxHeadline, AwxHero> = {
    awx: {
        title: [
            { text: "AWX", grad: "a" },
            { text: " stopped shipping releases. Your " },
            { text: "playbooks", grad: "b" },
            { text: " keep running." },
        ],
        lead: "AWX releases are no longer published. The last one, 24.6.1, came out in July 2024. Run the playbooks and inventories you already have in Kestra.",
        strong: "Open source and self-hosted, with schedules, approvals, retries and a log of every run.",
    },
    tower: {
        title: [
            { text: "Keep your " },
            { text: "playbooks", grad: "a" },
            { text: ". Replace the " },
            { text: "controller", grad: "b" },
            { text: "." },
        ],
        lead: "Same playbooks, same inventories, same Git repos. Kestra runs them in one YAML flow, with schedules, approvals, retries and a log of every run.",
        strong: "Open source and self-hosted.",
    },
    aap: {
        title: [
            { text: "The " },
            { text: "AAP", grad: "a" },
            { text: " alternative that keeps your " },
            { text: "playbooks", grad: "b" },
            { text: "." },
        ],
        lead: "Your Ansible content runs unchanged in Kestra, next to Terraform and your scripts. The open-source edition is free, and Enterprise is not priced per execution.",
        strong: "Self-hosted, on your own machines.",
    },
    compare: {
        title: [
            { text: "AWX", grad: "a" },
            { text: ", Tower or AAP? Keep your " },
            { text: "playbooks", grad: "b" },
            { text: " either way." },
        ],
        lead: "Kestra runs the playbooks you have today and chains them with Terraform, scripts and approvals. One YAML file per workflow, versioned in Git.",
        strong: "Open source and self-hosted.",
    },
    pricing: {
        title: [
            { text: "Run your " },
            { text: "playbooks", grad: "a" },
            { text: " on a " },
            { text: "free", grad: "b" },
            { text: ", open-source controller." },
        ],
        lead: "The open-source edition is free and runs in production on its own. Enterprise is priced on how broadly you deploy and your support tier, not per execution.",
        strong: "Your playbooks run unchanged.",
    },
    orchestrate: {
        title: [
            { text: "Orchestrate " },
            { text: "Ansible", grad: "a" },
            { text: " with Terraform, ServiceNow and " },
            { text: "approvals", grad: "b" },
            { text: "." },
        ],
        lead: "Keep your controller if you want. Kestra runs the chain around it: request, approval, provision, configure, notify, in one YAML file.",
        strong: "Open source and self-hosted.",
    },
    ui: {
        title: [
            { text: "A " },
            { text: "UI", grad: "a" },
            { text: ", schedules and " },
            { text: "logs", grad: "b" },
            { text: " for your playbooks." },
        ],
        lead: "Run your playbooks from Kestra on a schedule, on a webhook or by hand, with a log per host for every run.",
        strong: "Open source and self-hosted. Your first playbook runs in minutes.",
    },
}

/* Each row checked in the docs: Ansible task, Git clone and flow sync,
 * NetBox inventory blueprint, secrets (SECRET_ env vars in open source),
 * inputs, Schedule trigger, Subflow, Pause, containerImage, worker groups. */
const awxRows: TranslationProps["rows"] = [
    {
        from: "Job template",
        to: "A flow whose Ansible task runs your playbook",
    },
    {
        from: "Project synced from Git",
        to: "A Git clone in a working directory, or flows synced from Git",
    },
    {
        from: "Inventory",
        to: "The same inventory file, or one built at run time from NetBox",
    },
    {
        from: "Credentials",
        to: "Secrets: environment variables in open source, Vault and cloud secret managers in Enterprise",
    },
    { from: "Survey", to: "Typed flow inputs" },
    { from: "Schedule", to: "A Schedule trigger" },
    { from: "Workflow template", to: "A flow that calls subflows" },
    { from: "Approval node", to: "A Pause task that waits for approval" },
    { from: "Execution environment", to: "The task's container image" },
    {
        from: "Instance group in an isolated network",
        to: "A worker group (Enterprise)",
    },
]

const awxFaqItems: FaqProps["items"] = [
    {
        question: "Can I keep my playbooks, roles and inventories?",
        answer: "Yes. The Ansible task runs <code>ansible-playbook</code> on the files you give it: from a Git repository, from namespace files, or inline in the flow. Roles and collections listed in <code>requirements.yml</code> are installed before the run.",
    },
    {
        question:
            "AWX releases have stopped. What does that mean for security fixes?",
        answer: 'The last AWX release, 24.6.1, came out on July 2, 2024. On November 16, 2026 the maintainers removed the release pipeline, noting that AWX releases are no longer published. Teams on 24.6.1 get no security patches unless they build their own images from development commits. <a href="/resources/infrastructure/awx-release-status">See the full timeline</a>.',
    },
    {
        question: "Can I import my AWX job templates?",
        answer: "Not automatically today. Each job template maps to one flow, and the table above shows where each AWX object goes. You can move one job template at a time while AWX keeps running.",
    },
    {
        question: "Does it run air-gapped or in isolated networks?",
        answer: "Yes. Kestra is self-hosted, and a worker only needs an outbound route to its controller, so it can run in a restricted subnet or an air-gapped site. The Enterprise Edition adds worker groups and an air-gapped mode for the UI.",
    },
    {
        question: "Does it work with NetBox as the source of truth?",
        answer: 'Yes. A flow can build the inventory from NetBox at run time, then run your playbook against it. See the <a href="/blueprints/ansible-netbox-dynamic-inventory">NetBox dynamic inventory</a> and <a href="/blueprints/netbox-ansible-by-role-site">NetBox by role and site</a> blueprints.',
    },
    {
        question: "Can I keep AAP and orchestrate around it?",
        answer: "Yes. A flow can call the automation controller's API, so AAP keeps running its job templates while Kestra handles the request, the approvals, Terraform and the notifications around them.",
    },
    {
        question: "Is it free like AWX?",
        answer: "The open-source edition is free under Apache 2.0 and runs in production on its own, with one shared login. AWX gives each user a login and permissions. In Kestra that takes the Enterprise Edition, which adds SSO, role-based access and audit logs.",
    },
    ...faqItems.filter((item) =>
        ["Kestra, Semaphore, AWX or Rundeck?", "What does it cost?"].includes(
            item.question,
        ),
    ),
]

/* Runs as pasted: the inventory and the playbook are inline, against
 * localhost, so there is nothing to clone or configure. `dry_run` maps to
 * `--check` through the task's checkMode. */
const playbookFlow = `id: run_my_playbook
namespace: company.team

inputs:
  - id: dry_run
    type: BOOL
    defaults: true

tasks:
  - id: playbook
    type: io.kestra.plugin.ansible.cli.AnsibleCLI
    checkMode: "{{ inputs.dry_run }}"
    inputFiles:
      inventory.ini: |
        localhost ansible_connection=local
      playbook.yml: |
        ---
        - hosts: localhost
          gather_facts: false
          tasks:
            - name: Your playbook, unchanged
              ansible.builtin.debug:
                msg: "Run by Kestra, logged per host"
    commands:
      - ansible-playbook -i inventory.ini playbook.yml`

export const awxContent = {
    heroes: awxHeroes,

    playbookFlow,

    /* The offer: one of their job templates, running in Kestra, on a
     * 30-minute call. The call form books it. */
    heroCard: {
        title: "See your AWX job template run in Kestra",
        sub: "Book 30 minutes and bring one job template or playbook. We run it in Kestra with you, then map the rest of your setup.",
        submitLabel: "Let's talk",
    },

    useCases: {
        headingLines: ["Bring one job template.", "We run it with you."],
        bullets: [
            {
                text: "Pick one AWX job template or playbook, ideally one your team runs every week.",
                strong: true,
            },
            {
                text: "On the call, it runs in Kestra and you read its log per host.",
                strong: false,
            },
            {
                text: "Then we map the rest of your setup: inventories, credentials, schedules and approvals.",
                strong: false,
            },
        ],
    } satisfies Omit<UseCasesProps, "routePath">,

    translation: {
        heading: "What your AWX setup becomes",
        sub: "Each AWX or Tower object has a direct equivalent. Nothing is rewritten up front.",
        fromLabel: "AWX or Tower",
        rows: awxRows,
    } satisfies TranslationProps,

    editionsNote:
        "AWX gives each user a login and permissions at no cost. Kestra's open-source edition has one shared login. Teams that need SSO, role-based access, audit logs or worker groups use Enterprise.",

    faq: { items: awxFaqItems } satisfies FaqProps,

    closingBanner: {
        heading: "Bring one AWX job template",
        sub: "30 minutes, your playbook, running in Kestra.",
        cta: {
            text: "Let's talk",
            href: "#job-template-session",
        },
        event: "lp_infra_offer_click",
        reassurance: "Kestra is open source under Apache 2.0, and self-hosted.",
    } satisfies ClosingBannerProps,
}
