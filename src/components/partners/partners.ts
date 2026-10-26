import ntico from "./assets/ntico.svg"
import conapi from "./assets/conapi.svg"
import ashisuto from "./assets/ashisuto.svg"
import dremio from "./assets/dremio.svg"
import dlthub from "./assets/dlthub.svg"
import airbyte from "./assets/airbyte.svg"
import davidson from "./assets/davidson.svg"
import snowflake from "./assets/snowflake.svg"
import converteo from "./assets/converteo.svg"
import hashicorp from "./assets/hashicorp.svg"
import databricks from "./assets/databricks.svg"
import hanalytics from "./assets/hanalytics.svg"
import motherduck from "./assets/motherduck.svg"
import bitovi from "./assets/bitovi.svg"
import jlcp from "./assets/jlcp.svg"
import landeranalytics from "./assets/landeranalytics.avif"
import digitalocean from "./assets/digitalocean.svg"
import modeo from "./assets/modeo.svg"

export type PartnerType = "Technology" | "Services"

export const EXPERTISE = [
    "Data",
    "Infrastructure & DevOps",
    "Cloud & Kubernetes",
    "AI & ML",
    "Business automation",
    "Legacy migration",
] as const

export type Expertise = (typeof EXPERTISE)[number]

export interface Partner {
    name: string
    logo: ImageMetadata
    type: PartnerType
    country: string
    region: string
    expertise: Expertise[]
    description: string
    href: string
}

export type ListPartner = Omit<Partner, "logo"> & { logo: string }

export const listPartners = (type?: PartnerType): ListPartner[] =>
    PARTNERS.filter((p) => !type || p.type === type).map(
        ({ logo, ...rest }) => ({
            ...rest,
            logo: logo.src,
        }),
    )

export const PARTNERS: Partner[] = [
    {
        name: "DigitalOcean",
        country: "United States",
        region: "North America",
        expertise: ["Cloud & Kubernetes"],
        logo: digitalocean,
        type: "Technology",
        description:
            "DigitalOcean is the developer cloud, offering droplets, managed databases, and Kubernetes. With Kestra's dedicated plugin, teams orchestrate the whole account with event-driven flows.",
        href: "/partners/digitalocean",
    },
    {
        name: "Conapi",
        country: "Austria",
        region: "Europe",
        expertise: ["Business automation", "Legacy migration"],
        logo: conapi,
        type: "Services",
        description:
            "Conapi specializes in system integration, connecting legacy systems with modern tools through enterprise integration and API management.",
        href: "/partners/conapi",
    },
    {
        name: "Snowflake",
        country: "United States",
        region: "North America",
        expertise: ["Data"],
        logo: snowflake,
        type: "Technology",
        description:
            "Snowflake's platform enables a wide range of workloads including data warehousing, data lakes, and data engineering.",
        href: "/partners/snowflake",
    },
    {
        name: "Modeo",
        country: "France",
        region: "Europe",
        expertise: ["Data", "Legacy migration"],
        logo: modeo,
        type: "Services",
        description:
            "Independent data and AI consultancy in Paris that designs and industrializes modern, sovereign Data Platforms and DataOps with Kestra.",
        href: "/partners/modeo",
    },
    {
        name: "Converteo",
        country: "France",
        region: "Europe",
        expertise: ["Data"],
        logo: converteo,
        type: "Services",
        description:
            "Converteo is a leading consulting firm specializing in data strategy and digital transformation.",
        href: "/partners/converteo",
    },
    {
        name: "HashiCorp",
        country: "United States",
        region: "North America",
        expertise: ["Infrastructure & DevOps"],
        logo: hashicorp,
        type: "Technology",
        description:
            "Manage Kestra with the official Terraform provider, run Terraform plan and apply as governed steps in a flow, and read secrets from HashiCorp Vault.",
        href: "/partners/hashicorp",
    },
    {
        name: "Databricks",
        country: "United States",
        region: "North America",
        expertise: ["Data", "AI & ML"],
        logo: databricks,
        type: "Technology",
        description:
            "Databricks provides a unified analytics platform for data engineering, data science, and machine learning.",
        href: "/partners/databricks",
    },
    {
        name: "Dremio",
        country: "United States",
        region: "North America",
        expertise: ["Data"],
        logo: dremio,
        type: "Technology",
        description:
            "Dremio is the easy and open data lakehouse platform that delivers self-service analytics and data management.",
        href: "/partners/dremio",
    },
    {
        name: "Davidson",
        country: "France",
        region: "Europe",
        expertise: ["Data", "Infrastructure & DevOps", "AI & ML"],
        logo: davidson,
        type: "Services",
        description:
            "Davidson is a technology and management consulting firm focused on innovation and digital solutions.",
        href: "/partners/davidson",
    },
    {
        name: "Airbyte",
        country: "United States",
        region: "North America",
        expertise: ["Data"],
        logo: airbyte,
        type: "Technology",
        description:
            "Airbyte is an open-source data integration platform that helps you move data from any source to any destination.",
        href: "/partners/airbyte",
    },
    {
        name: "Hanalytics",
        country: "France",
        region: "Europe",
        expertise: ["Data"],
        logo: hanalytics,
        type: "Services",
        description:
            "Hanalytics specializes in data analytics and business intelligence solutions for modern organizations.",
        href: "/partners/hanalytics",
    },
    {
        name: "dltHub",
        country: "Germany",
        region: "Europe",
        expertise: ["Data"],
        logo: dlthub,
        type: "Technology",
        description:
            "dlthub provides declarative data loading tools to build robust and scalable data pipelines.",
        href: "/partners/dlthub",
    },
    {
        name: "MotherDuck",
        country: "United States",
        region: "North America",
        expertise: ["Data"],
        logo: motherduck,
        type: "Technology",
        description:
            "MotherDuck is a serverless data platform built on DuckDB, designed for performant and simple data analytics.",
        href: "/partners/motherduck",
    },
    {
        name: "Ntico",
        country: "France",
        region: "Europe",
        expertise: ["Data", "Business automation"],
        logo: ntico,
        type: "Services",
        description:
            "Ntico is a data consulting partner focused on delivering high-impact data solutions and insights.",
        href: "/partners/ntico",
    },
    {
        name: "Ashisuto",
        country: "Japan",
        region: "Asia-Pacific",
        expertise: ["Data", "Legacy migration"],
        logo: ashisuto,
        type: "Services",
        description:
            "Ashisuto is a leading Japanese bridge partner connecting enterprises with Kestra for strategic adoption and local support.",
        href: "/partners/ashisuto",
    },
    {
        name: "Bitovi",
        country: "United States",
        region: "North America",
        expertise: ["Infrastructure & DevOps", "Data"],
        logo: bitovi,
        type: "Services",
        description:
            "Bitovi is a digital product consultancy helping teams design, build, and scale web apps, DevOps, and data infrastructure.",
        href: "/partners/bitovi",
    },
    {
        name: "JLCP",
        country: "Brazil",
        region: "Latin America",
        expertise: ["Data", "Business automation"],
        logo: jlcp,
        type: "Services",
        description:
            "JLCP is a Brazilian systems integration consultancy delivering data engineering and automation solutions for enterprises.",
        href: "/partners/jlcp",
    },
    {
        name: "Lander Analytics",
        country: "United States",
        region: "North America",
        expertise: ["Data", "AI & ML"],
        logo: landeranalytics,
        type: "Services",
        description:
            "Lander Analytics is a systems integration and data consultancy specializing in analytics, machine learning, and data engineering.",
        href: "/partners/lander-analytics",
    },
]
