export const TRUST_CENTER_URL = "/trust"
export const SECURITY_OVERVIEW_PDF_URL =
    "https://hs.kestra.io/hubfs/kestra-security-overview-enterprise-edition.pdf"
export const SECURITY_EMAIL = "security@kestra.io"
export const ADVISORIES_URL = "https://github.com/kestra-io/kestra/security/advisories"
export const HARDENING_GUIDE_URL = "/docs/administrator-guide/security-hardening"
export const DEPLOYMENT_ARCHITECTURE_URL = "/docs/architecture/deployment-architecture"
export const SECURITY_AND_SECRETS_URL = "/docs/configuration/security-and-secrets"

export const TRUST_CENTER_POLICIES = [
    "Information Security",
    "Vulnerability Management",
    "System Access Control",
    "Risk Assessment",
    "Incident Response Plan",
    "Encryption",
    "Data Protection",
    "Data Classification",
    "Privacy",
    "Data Retention",
    "Asset Management",
    "Business Continuity Plan",
    "Software Development Life Cycle",
    "Code of Conduct",
]

export interface Deployment {
    name: string
    mode: string
    facts: { label: string; value: string }[]
}

export const DEPLOYMENTS: Deployment[] = [
    {
        name: "Open source",
        mode: "Self-managed",
        facts: [
            {
                label: "Where it runs",
                value: "Your infrastructure. Docker, Kubernetes or directly on a VM.",
            },
            {
                label: "Who operates it",
                value: "You. Patching, upgrades and infrastructure hardening are yours.",
            },
            {
                label: "Where your data sits",
                value: "Your database, your object storage, your network.",
            },
            {
                label: "SOC 2 coverage",
                value: "Covers how the software is built, not your deployment.",
            },
        ],
    },
    {
        name: "Enterprise Edition",
        mode: "Self-managed · air-gap capable",
        facts: [
            {
                label: "Where it runs",
                value: "Your infrastructure, including on-prem and fully air-gapped environments.",
            },
            {
                label: "Who operates it",
                value: "You, with Kestra support. Patching and upgrades are yours.",
            },
            {
                label: "Where your data sits",
                value: "Your database, your object storage, your network. Kestra has no access.",
            },
            {
                label: "SOC 2 coverage",
                value: "Covers how the software is built, not your deployment.",
            },
        ],
    },
    {
        name: "Kestra Cloud",
        mode: "Fully managed",
        facts: [
            { label: "Where it runs", value: "Managed by Kestra on Google Cloud." },
            { label: "Who operates it", value: "Kestra." },
            {
                label: "Where your data sits",
                value: "Your workflow data stays in the EU or US region you choose.",
            },
            { label: "SOC 2 coverage", value: "Covers the service end to end." },
        ],
    },
]

export const EDITIONS = ["OSS", "Enterprise", "Cloud"] as const

export interface SecurityControl {
    name: string
    description: string
    /** Availability per edition, in the order of `EDITIONS`. */
    availability: [boolean, boolean, boolean]
}

export const SECURITY_CONTROLS: SecurityControl[] = [
    {
        name: "SSO",
        description: "OIDC with Google, Microsoft Entra ID, Okta, Keycloak and authentik, plus LDAP.",
        availability: [false, true, true],
    },
    {
        name: "SCIM directory sync",
        description:
            "SCIM 2.0 provisioning, deprovisioning and group sync from Okta, Entra ID, Keycloak and authentik.",
        availability: [false, true, false],
    },
    {
        name: "RBAC",
        description:
            "Roles bound to users, groups and service accounts, scoped per namespace and inherited by child namespaces.",
        availability: [false, true, true],
    },
    {
        name: "Service accounts and API tokens",
        description: "Machine-to-machine access, separate from user accounts.",
        availability: [false, true, true],
    },
    {
        name: "Failed login lockout",
        description:
            "Accounts lock after repeated failed attempts. Configurable threshold, window and duration. Applies to basic auth and LDAP users.",
        availability: [false, true, true],
    },
    {
        name: "Built-in secrets management",
        description:
            "Credentials never sit in flow definitions. Flows reference a key and the value resolves at runtime.",
        availability: [false, true, true],
    },
    {
        name: "External secrets managers",
        description:
            "HashiCorp Vault, CyberArk, Delinea, BeyondTrust, AWS Secrets Manager, AWS SSM Parameter Store, Azure Key Vault, Google Secret Manager, 1Password, Bitwarden and Doppler.",
        availability: [false, true, false],
    },
    {
        name: "Read-only vault access",
        description:
            "Your vault stays the source of truth. Kestra reads but cannot create, edit or delete. Set globally, per tenant or per namespace.",
        availability: [false, true, false],
    },
    {
        name: "Encryption at rest (secret inputs and outputs)",
        description:
            "Secret-typed inputs and outputs are encrypted at rest with a key you configure.",
        availability: [true, true, true],
    },
    {
        name: "Encryption in transit (UI and API)",
        description: "TLS on the UI and API.",
        availability: [true, true, true],
    },
    {
        name: "Encryption in transit (workers)",
        description: "One-way or mutual TLS between the control plane and workers.",
        availability: [false, true, true],
    },
    {
        name: "Audit logs",
        description:
            "Every create, update and delete by users and service accounts, with actor, timestamp and a before-and-after diff.",
        availability: [false, true, true],
    },
    {
        name: "SIEM export",
        description:
            "Ship audit logs to Datadog, Elastic, New Relic, OpenTelemetry, AWS CloudWatch, Google Operations, Azure Monitor or Syslog CEF.",
        availability: [false, true, true],
    },
    {
        name: "Tenant and namespace isolation",
        description: "Separation of flows, secrets, files and access between teams and tenants.",
        availability: [false, true, true],
    },
    {
        name: "Worker isolation",
        description:
            "Forbidden file-system paths and a per-plugin allow-list for thread creation, so teams sharing a worker cannot read each other’s temporary files.",
        availability: [false, true, false],
    },
    {
        name: "Script execution isolation",
        description:
            "Policies force script tasks into container isolation across every tenant, with no namespace override.",
        availability: [false, true, true],
    },
    {
        name: "Allowed and restricted plugins",
        description: "Allow-list or block-list plugins by prefix or regex.",
        availability: [false, true, false],
    },
    {
        name: "Version control",
        description:
            "Every flow is versioned YAML with Git as the source of truth, plus full execution history with inputs, outputs and logs.",
        availability: [true, true, true],
    },
    {
        name: "Outbound request controls",
        description:
            "Allow-lists and deny-lists on HTTP tasks, to block reach into cloud metadata endpoints or private services.",
        availability: [true, true, true],
    },
]

export const BUILD_PRACTICES = [
    "Source code in version control with a documented code review process, covered by our SOC 2 Type 2 audit.",
    "Vulnerability scanning across code and container images with GitHub Security, SonarCloud and Trivy.",
    `A documented vulnerability management policy that defines how vulnerabilities are identified from external sources, risk-ranked, and resolved. Downloadable from the <a href="${TRUST_CENTER_URL}" target="_blank" rel="noopener">Trust Center</a>.`,
    "Continuous control monitoring through Drata, with live status published on the Trust Center.",
]

export interface TrustLink {
    label: string
    text: string
    href: string
}

export const TRUST_LINKS: TrustLink[][] = [
    [
        { label: "Trust Center", text: "kestra.io/trust", href: TRUST_CENTER_URL },
        {
            label: "Security hardening guide",
            text: "kestra.io/docs/administrator-guide/security-hardening",
            href: HARDENING_GUIDE_URL,
        },
        {
            label: "Security and secrets configuration",
            text: "kestra.io/docs/configuration/security-and-secrets",
            href: SECURITY_AND_SECRETS_URL,
        },
        {
            label: "Kestra Cloud Terms of Service",
            text: "kestra.io/kestra-cloud-terms-of-service",
            href: "/kestra-cloud-terms-of-service",
        },
        {
            label: "Report a vulnerability",
            text: SECURITY_EMAIL,
            href: `mailto:${SECURITY_EMAIL}`,
        },
    ],
    [
        {
            label: "Security overview (2-page PDF)",
            text: "Download",
            href: SECURITY_OVERVIEW_PDF_URL,
        },
        {
            label: "Deployment architecture",
            text: "kestra.io/docs/architecture/deployment-architecture",
            href: DEPLOYMENT_ARCHITECTURE_URL,
        },
        {
            label: "GitHub security advisories",
            text: "github.com/kestra-io/kestra/security/advisories",
            href: ADVISORIES_URL,
        },
        {
            label: "Kestra Cloud Privacy Policy",
            text: "kestra.io/kestra-cloud-privacy-policy",
            href: "/kestra-cloud-privacy-policy",
        },
    ],
]

// Answers from the approved Notion draft "Security Page Draft: kestra.io/security".
export const FAQ_ITEMS = [
    {
        question: "Is Kestra SOC 2 certified, and what is in scope?",
        answer: `Yes. Kestra Technologies holds a SOC 2 Type 2 report covering the Security, Availability and Confidentiality trust services criteria, together with GDPR Article 5. The audit examines how we build the software and how we operate our managed service. If you self-host, your own deployment is outside the audit scope and under your control. Request the report from the <a href="${TRUST_CENTER_URL}" target="_blank" rel="noopener">Trust Center</a>.`,
    },
    {
        question: "Does Kestra store my workflow data?",
        answer: "For self-hosted deployments, no. Workflow definitions, execution history, logs and secrets stay in your database, your object storage and your network, and Kestra has no access to them. For Kestra Cloud, data is stored in Kestra Cloud infrastructure on Google Cloud.",
    },
    {
        question: "Can Kestra run air-gapped, with no outbound internet access?",
        answer: "Yes. Enterprise Edition installs offline from a private registry, and an air-gapped configuration mode removes external dependencies from the UI. The Enterprise license is validated locally at startup and does not call out to a license server. Anonymous usage reporting, in-product documentation and hosted blueprints are the only components that reach the internet by default, and air-gapped mode disables them.",
    },
    {
        question: "Can I get a copy of your SOC 2 report?",
        answer: `Yes. Request it from the <a href="${TRUST_CENTER_URL}" target="_blank" rel="noopener">Trust Center</a>. Each copy is issued to the requester.`,
    },
    {
        question: "Is Kestra GDPR compliant, and do you offer a DPA?",
        answer: "Yes. GDPR Article 5 requirements are audited within the same report as our SOC 2. A Data Processing Agreement is available on request.",
    },
    {
        question: "Does Kestra support SSO and SCIM?",
        answer: "Yes, on Enterprise Edition. SSO runs over OIDC with Google, Microsoft Entra ID, Okta, Keycloak and authentik, and LDAP is also supported. SCIM 2.0 handles provisioning, deprovisioning and group sync from Okta, Entra ID, Keycloak and authentik.",
    },
    {
        question: "Which secrets managers does Kestra support?",
        answer: "Enterprise Edition connects to HashiCorp Vault, CyberArk, Delinea Secret Server, BeyondTrust, AWS Secrets Manager, AWS SSM Parameter Store, Azure Key Vault, Google Secret Manager, 1Password, Bitwarden and Doppler. Read-only mode keeps your vault as the source of truth, so Kestra can read secrets but cannot create, edit or delete them. Enterprise Edition and Kestra Cloud also include a built-in secrets manager.",
    },
    {
        question: "Which Kestra versions receive security fixes?",
        answer: "The <code>latest</code> release and all active LTS versions. A new LTS ships every six months and is supported for one year, with at most two active at any time. Fixes for known CVEs are backported to all active LTS versions.",
    },
    {
        question: "How do I report a security vulnerability?",
        answer: `Email <a href="mailto:${SECURITY_EMAIL}">${SECURITY_EMAIL}</a>. See the <a href="#report-title">Reporting a vulnerability</a> section above for what to include and what happens next.`,
    },
]
