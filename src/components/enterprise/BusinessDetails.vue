<template>
    <div class="container" data-usal="fade-l">
        <LayoutTabContent :navLinks="businessDetails.navLinks" />
    </div>
</template>

<script setup>
    const businessDetails = {
        navLinks: [
            {
                id: 1,
                active: false,
                text: "Securely store sensitive information, such as passwords and API keys",
                tabText: "Vault Integration & Secret Management",
                imgHref: "/landing/ee/company-stories/secrets.svg",
                imgAlt: "Secrets",
            },
            {
                id: 2,
                active: true,
                text: "Allow users to access multiple applications with one set of login credentials",
                tabText: "SSO Support",
                imgHref: "/landing/ee/company-stories/sso-support.svg",
                imgAlt: "SSO",
            },
            {
                id: 3,
                active: false,
                text: "Track platform activities for compliance and security",
                tabText: "Detailed Audit Logs",
                imgHref: "/landing/ee/company-stories/audit-log.svg",
                imgAlt: "Audit Log",
            },
            {
                id: 4,
                active: false,
                text: "Manage multiple teams or projects with isolated workspaces and centralized administration",
                tabText: "Multi-Tenant Architecture",
                imgHref: "/landing/ee/company-stories/tenants.svg",
                imgAlt: "Tenants",
            },
        ],
    }
</script>