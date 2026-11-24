import type { Props as HeroProps } from "~/components/lp/shared/Hero.astro"

const GUIDE = "/resources/migration/pipedream"

const trialCta = {
    text: "Start your Cloud trial",
    label: "Start your Cloud trial",
    href: "#contact-sales",
}

const faq = [
    {
        question: "Can I import the Pipedream JSON export directly into Kestra?",
        answer: `No. The export is the specification you convert from. A coding agent with the Kestra agent skills, or the AI Copilot in Kestra Cloud, turns each workflow file into a draft flow that you review. The guide has <a href="${GUIDE}#step-convert">the prompt</a>.`,
    },
    {
        question: "Do my code steps need rewriting?",
        answer: `The logic copies into a Script task in the same language. Two lines change: the step reads its input from <code>{{ trigger.body }}</code> or an earlier task's outputs instead of <code>pd.steps</code>, and it exports its result with <code>Kestra.outputs()</code> instead of <code>return</code> (an <code>::{"outputs":…}::</code> line in Bash).`,
    },
    {
        question: "What happens to my connected accounts?",
        answer: "They do not migrate. The export keeps only an internal <code>authProvisionId</code>. Register your own OAuth client or API token for each app and store it in Kestra's secret manager, scoped to a namespace. From then on, you own the grant.",
    },
    {
        question: "What about API calls that take minutes?",
        answer: "Set <code>timeout</code> on the task to the value the call needs. For an HTTP call, also raise <code>options.timeout.readIdleTimeout</code>, as the worked conversion above does.",
    },
    {
        question: "How is Kestra Cloud priced compared to credits?",
        answer: "By task runs, plus compute time for scripts that run on the Kestra Cloud task runner. A task run is one run of one task; loops, conditions and triggers are not counted. Scripts sent to your own AWS, GCP or Azure runners still count as task runs, but your cloud provider bills their compute. Bring your monthly step count and we size the plan with you during the trial.",
    },
    {
        question: "Is there an open-source option?",
        answer: "Yes. Kestra's core is Apache 2.0 and runs with Docker Compose. Your flows are the same YAML on Cloud and self-hosted.",
    },
    {
        question: "Is Pipedream Connect affected?",
        answer: "No. Only Workflows and String shut down. If you only use Pipedream Connect, its API, MCP servers or API proxy, nothing changes.",
    },
]

export const pipedreamMigrationContent = {
    title: "Migrate off Pipedream Workflows",
    description:
        "Pipedream Workflows shuts down on March 31, 2027. Convert your export to Kestra flows with your coding agent, keep your code steps, and own your credentials.",
    guide: GUIDE,
    trialCta,
    hero: {
        formTitle: "Start your Kestra Cloud trial",
    } satisfies Omit<HeroProps, "routePath">,
    faq,
}
