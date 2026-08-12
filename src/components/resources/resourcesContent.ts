import { ALL_RESOURCES } from "./tags"

type Section = {
    metaTitle: string
    metaDescription: string
    heading: string
    subtitle: string
}

const resourceSections: Record<string, Section> = {
    [ALL_RESOURCES]: {
        metaTitle:
            "Kestra Resources: Guides for Data, AI, Infrastructure & Business Workflows",
        metaDescription:
            "Browse Kestra's orchestration resources — guides, listicles, and playbooks for data engineering, AI workflows, business operations and infrastructure automation.",
        heading: "All Orchestration Resources",
        subtitle:
            "Discover a comprehensive index of in-depth guides, whitepapers, and playbooks spanning data orchestration, AI workflows, business operations and infrastructure automation — built for engineers and platform teams shipping production workflows at every stage.",
    },
    infrastructure: {
        metaTitle:
            "Infrastructure Automation Resources: Terraform, Ansible, IaC",
        metaDescription:
            "Explore practical infrastructure automation resources — Terraform, Ansible, Kubernetes, and IaC orchestration patterns for modern platform engineering teams.",
        heading: "Infrastructure Automation Resources",
        subtitle:
            "Guides and playbooks for automating the infrastructure layer — Terraform, Ansible, Kubernetes and IaC orchestration patterns for platform teams running production estates.",
    },
    data: {
        metaTitle:
            "Data Engineering Resources: ETL, Orchestration & Pipelines",
        metaDescription:
            "Practical data engineering resources on orchestration, ETL/ELT pipelines, dbt, Snowflake, Databricks, and migrating from Airflow to a declarative orchestrator.",
        heading: "Data Engineering Resources",
        subtitle:
            "Everything data teams need to move data reliably — ETL/ELT pipeline design, dbt, Snowflake and Databricks orchestration, and migrating off Airflow without a rewrite.",
    },
    ai: {
        metaTitle:
            "AI Orchestration Resources: LLMOps, RAG & Agentic Workflows",
        metaDescription:
            "AI orchestration resources covering LLMOps, RAG pipelines, agentic workflows, prompt management, and integrating Kestra with LangChain and MCP servers.",
        heading: "AI Orchestration Resources",
        subtitle:
            "Guides for putting AI into production — LLMOps practices, RAG pipelines, agentic workflows, prompt management, and wiring Kestra into LangChain and MCP servers.",
    },
    business: {
        metaTitle:
            "Business Process Orchestration Resources: Automation & Workflows",
        metaDescription:
            "Business process orchestration resources — automate approvals, reporting, and cross-team workflows by connecting your business apps and systems with Kestra.",
        heading: "Business Process Resources",
        subtitle:
            "Playbooks for automating the work that runs between teams — approvals, recurring reporting, onboarding and cross-system processes that connect your business apps without glue code.",
    },
    whitepapers: {
        metaTitle: "Kestra Whitepapers: Orchestration Guides for Engineering Leaders",
        metaDescription:
            "In-depth Kestra whitepapers on orchestration strategy, platform migrations, and production workflow patterns for data, AI, and infrastructure teams.",
        heading: "Kestra Whitepapers",
        subtitle:
            "Long-form reports for engineering leaders — orchestration strategy, platform migrations, and the architecture patterns behind production workflows at scale.",
    },
}

export const getResourceSection = (tag: string | undefined): Section =>
    resourceSections[tag ?? ""] ?? resourceSections[ALL_RESOURCES]
