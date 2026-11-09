import type { Props as HeroProps } from "~/components/lp/shared/Hero.astro"
import type { Props as PlatformProps } from "~/components/lp/shared/Platform.astro"
import type { Props as MigrationProps } from "~/components/lp/shared/Migration.astro"
import type { Props as TranslationProps } from "~/components/lp/shared/Translation.astro"
import type { Props as FeaturesProps } from "~/components/lp/shared/Features.astro"
import type { Props as StackProps } from "~/components/lp/shared/Stack.astro"
import type { Props as ProofProps } from "~/components/lp/shared/Proof.astro"
import type { Props as UseCasesProps } from "~/components/lp/shared/UseCases.astro"
import type { Props as FaqProps } from "~/components/lp/shared/Faq.astro"
import type { Props as ClosingBannerProps } from "~/components/lp/shared/ClosingBanner.astro"

import FinanceIcon from "~/components/lp/shared/assets/stack-business-processes.svg"
import SyncIcon from "~/components/lp/shared/assets/stack-data-pipelines.svg"
import ApiIcon from "~/components/lp/shared/assets/stack-app-microservices.svg"

const GUIDE = "/resources/migration/pipedream"

/** The header CTA and the closing banner both point at the trial form. */
const trialCta = { text: "Start your Cloud trial", href: "#contact-sales" }

const reasons: PlatformProps["cards"] = [
    {
        kicker: "Deadline",
        title: "Pipedream Workflows stops on March 31, 2027.",
        body: "All Workflows data, credentials and OAuth tokens included, is deleted by April 30. Every workflow that matters has to run somewhere else first.",
        icon: "mdi:calendar-alert",
    },
    {
        kicker: "Export",
        title: "The export keeps the structure, not the state.",
        body: "You get each workflow as JSON. Secrets, environment variables, Data Stores and connected accounts stay behind, so save them now.",
        icon: "mdi:archive-arrow-down-outline",
    },
    {
        kicker: "Lock-in",
        title: "Pick a platform that stays yours if the vendor changes course.",
        body: "Kestra flows are YAML in your Git repository, your credentials sit in a secret manager you control, and the engine underneath is Apache 2.0.",
        icon: "mdi:lock-open-variant-outline",
    },
]

// The guide's four stages (section 2).
const stages: MigrationProps["steps"] = [
    {
        number: "01",
        title: "Assess",
        body: "Export every project, then triage: retire what nobody runs, merge near-duplicates, rank the rest.",
    },
    {
        number: "02",
        title: "Trial",
        body: "Convert two or three real workflows on a Kestra Cloud trial, including one hard one, and measure the hours.",
    },
    {
        number: "03",
        title: "Migrate",
        body: "Convert by pattern in waves and reconnect credentials, with Pipedream still serving.",
    },
    {
        number: "04",
        title: "Exit",
        body: "Repoint each trigger, retire the Pipedream workflow, and cancel the subscription before March 31.",
    },
]

// A condensed cut of the guide's concept mapping (section 3.2).
const mapping: TranslationProps["rows"] = [
    {
        from: "Workflow and project",
        to: "A flow, as YAML in a namespace, versioned in Git",
    },
    {
        from: "HTTP / Webhook and Timer triggers",
        to: "Webhook and Schedule triggers, with the same cron syntax",
    },
    {
        from: "Node.js, Python and Bash code steps",
        to: "Script tasks, with the logic copied as is",
    },
    {
        from: "Pre-built actions",
        to: "Plugin tasks, or an HTTP request where no plugin exists",
    },
    {
        from: "steps.name.$return_value",
        to: "{{ outputs.name.vars.key }}, declared explicitly",
    },
    {
        from: "Data Store and File Store",
        to: "KV Store, namespace files and internal storage",
    },
    {
        from: "Secret props and connected accounts",
        to: "The secret manager, re-entered once and owned by you",
    },
    {
        from: "Memory and timeout settings per workflow",
        to: "Task runner size and a timeout per task",
    },
]

// The guide's five conversion patterns (section 5.1) and the work behind the
// case study in section 2.2.
const automations: StackProps["columns"] = [
    {
        Glyph: FinanceIcon,
        title: "Finance and HR processes",
        items: [
            "Invoice and file intake into the ERP",
            "Reimbursement intake with an approval step",
            "Month-end jobs that wait on slow APIs",
        ],
    },
    {
        Glyph: SyncIcon,
        title: "Record syncs",
        items: [
            "Staff and account-code syncs between business apps",
            "Poll an app, then sync the records",
            "Timer, fetch, then load",
        ],
    },
    {
        Glyph: ApiIcon,
        title: "Webhooks and APIs",
        items: [
            "Webhook, code step, then an API call",
            "A file arrives, gets processed, someone is notified",
            "Wrappers: one webhook forwarded to one API",
        ],
    },
]

const cases: ProofProps["cases"] = [
    {
        status: "Migrating, cutover before March 2027",
        title: "A global nonprofit, off Pipedream Workflows",
        stats: [
            { value: "16", label: "Pipedream projects" },
            { value: "62", label: "workflows" },
            { value: "2 weeks", label: "to a running Cloud trial" },
        ],
        body: "Finance file processing into NetSuite, staff and account-code syncs across Workday, Google Workspace and Monday, and reimbursement intake, converting by pattern.",
    },
]

const ctaBullets: UseCasesProps["bullets"] = [
    {
        text: "Start a 14-day Kestra Cloud trial, with no credit card.",
        strong: true,
    },
    {
        text: "Convert two or three of your own workflows, including a hard one.",
        strong: false,
    },
    {
        text: "Leave with measured hours per workflow and a plan that finishes before March 31.",
        strong: false,
    },
]

// The Cloud offer, in the words of kestra.io/cloud (the official source for
// Cloud claims). The shared component's default copy is self-hosted Enterprise.
const cloudFeatures: NonNullable<FeaturesProps["features"]> = [
    {
        icon: "mdi:shield-lock-outline",
        title: "Security & Compliance",
        body: "SSO and audit logs from day one, unlimited users with custom roles, and a managed secret manager scoped by namespace. SOC 2 Type 2 and GDPR.",
    },
    {
        icon: "mdi:hexagon-outline",
        title: "Governance & Productivity",
        body: "Namespaces, Git sync and revision history, and Apps so business teams run flows themselves. The AI Copilot generates flows from plain English.",
    },
    {
        icon: "mdi:cloud-check-outline",
        title: "Fully managed & operated",
        body: "Hosting, scaling, upgrades, backups and uptime handled by the team that builds Kestra. Heavy scripts can run on your own AWS, GCP or Azure task runners, billed by your cloud provider.",
    },
]

const faqItems: FaqProps["items"] = [
    {
        question: "Is Pipedream shutting down?",
        answer: "Pipedream Workflows and String are. Both stop on March 31, 2027. Workflows is in maintenance mode with no new signups, and all Workflows data, credentials and OAuth tokens included, is deleted by April 30, 2027. Pipedream Connect continues.",
    },
    {
        question:
            "Can I import the Pipedream JSON export directly into Kestra?",
        answer: `Not as a one-click import: the two schemas differ in how outputs, conditions and credentials are expressed. The export is the specification you convert from. The AI Copilot in Kestra Cloud turns a workflow's JSON into a first-draft flow that a developer reviews. See the <a href="${GUIDE}#section-5-1">worked conversion</a> in the migration guide.`,
    },
    {
        question: "Do my code steps need rewriting?",
        answer: `No. The logic of a Node.js, Python or Bash step copies into a Script task as is. Two things change: the step reads its input from <code>{{ trigger.body }}</code> or an earlier task's outputs instead of the <code>steps</code> object, and it exports its result with <code>Kestra.outputs()</code> (an <code>::{"outputs":…}::</code> line in Bash) instead of <code>return</code>. Go steps run in a Go Script task.`,
    },
    {
        question: "What happens to my connected accounts?",
        answer: "They do not migrate: the export keeps only an internal <code>authProvisionId</code>. You re-authorize each app with your own OAuth client or API token and store it in Kestra's secret manager, scoped to a namespace. From then on, you own the grant.",
    },
    {
        question: "What about API calls that take minutes?",
        answer: `Calls that take several minutes are fine. Set the timeout on the task to the value the call needs. For an HTTP call, also raise the client's read and idle timeouts, as the <a href="${GUIDE}#section-5-1">worked conversion</a> does.`,
    },
    {
        question: "How is Kestra Cloud priced compared to credits?",
        answer: "By task runs, plus compute time for scripts that run on the Kestra Cloud task runner. There is no 30-second credit slice: a task run is one run of one task, and loops, conditions and triggers are not counted. Tasks you send to your own AWS, GCP or Azure runners still count as task runs, but their compute is billed by your cloud provider, not by Kestra Cloud. Bring your monthly step count and we size the plan with you during the trial.",
    },
    {
        question: "Is there an open-source option?",
        answer: "Yes. Kestra's core is Apache 2.0 and runs with Docker Compose. Your flows are the same YAML on Cloud and self-hosted, so starting on Cloud never locks you in.",
    },
    {
        question: "Is there a step-by-step method?",
        answer: `Yes. The <a href="${GUIDE}">Pipedream migration guide</a> covers the export checklist, the full concept mapping, a worked conversion and the cutover plan, stage by stage.`,
    },
]

/** Copy for /lp/pipedream-migration. Paid traffic only: every ad group lands
 * here and is told apart by its utm_content. The organic page for the topic is
 * the migration guide. The conversion is a Kestra Cloud trial (the /cloud
 * form), not a demo. */
export const pipedreamMigrationContent = {
    title: "Migrate off Pipedream Workflows",
    description:
        "Pipedream Workflows shuts down on March 31, 2027. On Kestra Cloud, your code steps keep their logic, you own the credentials and there is nothing to host.",

    trialCta,

    hero: {
        formTitle: "Start your Kestra Cloud trial",
    } satisfies Omit<HeroProps, "routePath">,

    platform: {
        heading: "What the shutdown means for you",
        cards: reasons,
    } satisfies PlatformProps,

    migration: {
        heading: "Off Pipedream in four stages, before March 31",
        sub: "Pipedream keeps running until each wave is cut over.",
        steps: stages,
    } satisfies MigrationProps,

    translation: {
        heading: "What Pipedream becomes in Kestra",
        sub: "A starting map from the migration guide. Triage first: part of every estate is retired or merged before anything is converted.",
        fromLabel: "Pipedream",
        rows: mapping,
    } satisfies TranslationProps,

    features: {
        heading: "What comes with Kestra Cloud",
        features: cloudFeatures,
    } satisfies FeaturesProps,

    stack: {
        heading: "What Pipedream teams run on Kestra",
        columns: automations,
    } satisfies StackProps,

    proof: {
        heading: "One migration in progress",
        sub: "Converting by pattern, with Pipedream still running.",
        cases,
    } satisfies ProofProps,

    useCases: {
        headingLines: ["Bring your export,", "leave with working flows"],
        bullets: ctaBullets,
    } satisfies Omit<UseCasesProps, "routePath">,

    faq: { items: faqItems } satisfies FaqProps,

    closingBanner: {
        heading: "Export today, convert this week",
        sub: "Start your Cloud trial with your export in hand: your first run takes minutes. Bring your integration list and your monthly step count.",
        cta: trialCta,
        reassurance:
            "Fully managed by the team that builds Kestra. The same flows run self-hosted if you ever need it.",
    } satisfies ClosingBannerProps,
}
