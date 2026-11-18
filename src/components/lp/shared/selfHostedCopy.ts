import type { Props as FeaturesProps } from "./Features.astro"

export const selfHostedFeatures: FeaturesProps["features"] = [
    {
        icon: "mdi:shield-lock-outline",
        title: "Security & Compliance",
        body: "SSO and SCIM, role-based access control, internal or external secrets managers, and full audit logs, on infrastructure you control, air-gapped included.",
    },
    {
        icon: "mdi:hexagon-outline",
        title: "Governance & Productivity",
        body: "Namespaces and multi-tenancy, Git integration and versioning with revision history, human-in-the-loop approvals, custom blueprints, and built-in observability across every run.",
    },
    {
        icon: "mdi:view-grid-outline",
        title: "Scalability & Infrastructure",
        body: "Worker groups, high availability, and unlimited executions, deployed with Docker, Kubernetes, a single VM, or managed Cloud, with backup, restore, and cluster health monitoring.",
    },
]

export const selfHostedReassurance =
    "Self-managed or air-gapped. Your data never leaves your network."
