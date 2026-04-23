import { ALL_RESOURCES } from "./tags"

type Section = {
    metaTitle: string
    metaDescription: string
}

const resourceSections: Record<string, Section> = {
    [ALL_RESOURCES]: {
        metaTitle: "Kestra Resources: Guides for Data, AI & Infrastructure",
        metaDescription:
            "Browse Kestra's orchestration resources — hands-on guides, listicles, and playbooks for data engineering, AI workflows, and infrastructure automation.",
    },
    infrastructure: {
        metaTitle:
            "Infrastructure Automation Resources: Terraform, Ansible & IaC Playbooks",
        metaDescription:
            "Explore practical infrastructure automation resources — Terraform, Ansible, Kubernetes, and IaC orchestration patterns for modern platform engineering teams.",
    },
    data: {
        metaTitle:
            "Data Engineering Resources: ETL, Orchestration & Pipeline Playbooks",
        metaDescription:
            "Practical data engineering resources on orchestration, ETL/ELT pipelines, dbt, Snowflake, BigQuery, Databricks, and migrating from Airflow to a declarative orchestrator.",
    },
    ai: {
        metaTitle:
            "AI Orchestration Resources: LLMOps, RAG & Agentic Workflow Guides",
        metaDescription:
            "AI orchestration resources covering LLMOps, RAG pipelines, agentic workflows, prompt management, and integrating Kestra with LangChain, LlamaIndex, and MCP servers.",
    },
    whitepapers: {
        metaTitle: "Kestra Whitepapers: Orchestration Guides for Engineering Leaders",
        metaDescription:
            "In-depth Kestra whitepapers on orchestration strategy, platform migrations, and production workflow patterns for data, AI, and infrastructure teams.",
    },
}

export const getResourceSection = (tag: string | undefined): Section =>
    resourceSections[tag ?? ""] ?? resourceSections[ALL_RESOURCES]
