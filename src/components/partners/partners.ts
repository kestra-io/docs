import ntico from "./assets/ntico.svg"
import conapi from "./assets/conapi.svg"
import ashisuto from "./assets/ashisuto.svg"
import dremio from "./assets/dremio.svg"
import dlthub from "./assets/dlthub.svg"
import airbyte from "./assets/airbyte.svg"
import davidson from "./assets/davidson.svg"
import snowflake from "./assets/snowflake.svg"
import converteo from "./assets/converteo.svg"
import terraform from "./assets/terraform.svg"
import databricks from "./assets/databricks.svg"
import hanalytics from "./assets/hanalytics.svg"
import motherduck from "./assets/motherduck.svg"
import bitovi from "./assets/bitovi.svg"
import jlcp from "./assets/jlcp.svg"
import landeranalytics from "./assets/landeranalytics.avif"
import digitalocean from "./assets/digitalocean.svg"

export type PartnerType = "Technology" | "Consulting"

export interface Partner {
    name: string
    logo: ImageMetadata
    type: PartnerType
    kind: string
    country: string
    region: string
    services: string[]
    description: string
    href: string
}

export const PARTNERS: Partner[] = [
    {
        name: "DigitalOcean",
        kind: "Cloud",
        country: "United States",
        region: "North America",
        services: ["Compute & Kubernetes", "Managed databases"],
        logo: digitalocean,
        type: "Technology",
        description:
            "DigitalOcean is the developer cloud, offering droplets, managed databases, and Kubernetes. With Kestra's dedicated plugin, teams orchestrate the whole account with event-driven flows.",
        href: "/partners/digitalocean",
    },
    {
        name: "Conapi",
        kind: "Systems integrator",
        country: "Austria",
        region: "Europe",
        services: ["System integration", "Legacy modernization"],
        logo: conapi,
        type: "Consulting",
        description:
            "Conapi specializes in system integration, connecting legacy systems with modern tools through enterprise integration and API management.",
        href: "/partners/conapi",
    },
    {
        name: "Snowflake",
        kind: "Data platform",
        country: "United States",
        region: "North America",
        services: ["Data warehouse", "Data engineering"],
        logo: snowflake,
        type: "Technology",
        description:
            "Snowflake's platform enables a wide range of workloads including data warehousing, data lakes, and data engineering.",
        href: "https://www.snowflake.com/",
    },
    {
        name: "Converteo",
        kind: "Consulting firm",
        country: "France",
        region: "Europe",
        services: ["Data strategy", "Digital transformation"],
        logo: converteo,
        type: "Consulting",
        description:
            "Converteo is a leading consulting firm specializing in data strategy and digital transformation.",
        href: "https://www.converteo.com/",
    },
    {
        name: "Terraform",
        kind: "Infrastructure",
        country: "United States",
        region: "North America",
        services: ["Infrastructure as code"],
        logo: terraform,
        type: "Technology",
        description:
            "Terraform lets you provision and version infrastructure as code. With Kestra, you can orchestrate Terraform runs reliably in automated workflows.",
        href: "https://www.terraform.io/",
    },
    {
        name: "Databricks",
        kind: "Data platform",
        country: "United States",
        region: "North America",
        services: ["Analytics & BI", "Machine learning"],
        logo: databricks,
        type: "Technology",
        description:
            "Databricks provides a unified analytics platform for data engineering, data science, and machine learning.",
        href: "https://www.databricks.com/",
    },
    {
        name: "Dremio",
        kind: "Data platform",
        country: "United States",
        region: "North America",
        services: ["Lakehouse", "Analytics & BI"],
        logo: dremio,
        type: "Technology",
        description:
            "Dremio is the easy and open data lakehouse platform that delivers self-service analytics and data management.",
        href: "https://www.dremio.com/",
    },
    {
        name: "Davidson",
        kind: "Consulting firm",
        country: "France",
        region: "Europe",
        services: ["Digital transformation", "Technology consulting"],
        logo: davidson,
        type: "Consulting",
        description:
            "Davidson is a technology and management consulting firm focused on innovation and digital solutions.",
        href: "https://www.davidson.fr/",
    },
    {
        name: "Airbyte",
        kind: "Data integration",
        country: "United States",
        region: "North America",
        services: ["Data integration"],
        logo: airbyte,
        type: "Technology",
        description:
            "Airbyte is an open-source data integration platform that helps you move data from any source to any destination.",
        href: "https://airbyte.com/",
    },
    {
        name: "Hanalytics",
        kind: "Consulting firm",
        country: "France",
        region: "Europe",
        services: ["Analytics & BI", "Data strategy"],
        logo: hanalytics,
        type: "Consulting",
        description:
            "Hanalytics specializes in data analytics and business intelligence solutions for modern organizations.",
        href: "https://hanalytics.io/",
    },
    {
        name: "dlthub",
        kind: "Data integration",
        country: "Germany",
        region: "Europe",
        services: ["Data integration"],
        logo: dlthub,
        type: "Technology",
        description:
            "dlthub provides declarative data loading tools to build robust and scalable data pipelines.",
        href: "https://dlthub.com/",
    },
    {
        name: "MotherDuck",
        kind: "Data platform",
        country: "United States",
        region: "North America",
        services: ["Data warehouse", "Analytics & BI"],
        logo: motherduck,
        type: "Technology",
        description:
            "MotherDuck is a serverless data platform built on DuckDB, designed for performant and simple data analytics.",
        href: "https://motherduck.com/",
    },
    {
        name: "Ntico",
        kind: "Systems integrator",
        country: "France",
        region: "Europe",
        services: ["Data engineering", "Automation"],
        logo: ntico,
        type: "Consulting",
        description:
            "Ntico is a data consulting partner focused on delivering high-impact data solutions and insights.",
        href: "/partners/ntico",
    },
    {
        name: "Ashisuto",
        kind: "Systems integrator",
        country: "Japan",
        region: "Asia-Pacific",
        services: ["Local support", "Enterprise adoption"],
        logo: ashisuto,
        type: "Consulting",
        description:
            "Ashisuto is a leading Japanese bridge partner connecting enterprises with Kestra for strategic adoption and local support.",
        href: "/partners/ashisuto",
    },
    {
        name: "Bitovi",
        kind: "Consulting firm",
        country: "United States",
        region: "North America",
        services: ["DevOps & infrastructure", "Data engineering"],
        logo: bitovi,
        type: "Consulting",
        description:
            "Bitovi is a digital product consultancy helping teams design, build, and scale web apps, DevOps, and data infrastructure.",
        href: "https://www.bitovi.com/",
    },
    {
        name: "JLCP",
        kind: "Systems integrator",
        country: "Brazil",
        region: "Latin America",
        services: ["System integration", "Data engineering", "Automation"],
        logo: jlcp,
        type: "Consulting",
        description:
            "JLCP is a Brazilian systems integration consultancy delivering data engineering and automation solutions for enterprises.",
        href: "https://jlcp.com.br/",
    },
    {
        name: "Lander Analytics",
        kind: "Systems integrator",
        country: "United States",
        region: "North America",
        services: ["Analytics & BI", "Data engineering", "Machine learning"],
        logo: landeranalytics,
        type: "Consulting",
        description:
            "Lander Analytics is a systems integration and data consultancy specializing in analytics, machine learning, and data engineering.",
        href: "https://www.landeranalytics.com/",
    },
]
