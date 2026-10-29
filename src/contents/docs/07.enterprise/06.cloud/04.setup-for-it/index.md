---
title: "Kestra Cloud Setup Guide for IT and Platform Admins"
h1: Set Up Kestra Cloud for Your Team
description: What IT, security and platform admins need to do so a team can use Kestra Cloud, from network access and SSO to cloud credentials and the security review.
sidebarTitle: Setup for IT Admins
icon: /src/contents/docs/icons/admin.svg
editions: ["Cloud"]
---

This guide is for the IT, security or platform admin asked to set up Kestra Cloud for a team at your company. It lists what you may need to do, when, and where to find the details. Most teams need two or three of the steps below. Start them early: access requests usually take longer than building the first workflow.

Kestra Cloud is Kestra Enterprise, run by Kestra on Google Cloud. Your team builds and runs workflows in its own instance, and Kestra handles hosting, upgrades and scaling. By default, nothing is installed on your infrastructure.

## Checklist

| What | When you need it | Who usually does it |
| --- | --- | --- |
| [Let sign-in emails through](#let-sign-in-emails-through) | Recommended if your email filter holds mail from new senders | Email or security admin |
| [Let your network reach Kestra Cloud](#let-your-network-reach-kestra-cloud) | If your network restricts outbound web traffic | Network or proxy admin |
| [Allow Kestra Cloud to reach your systems](#allow-kestra-cloud-to-reach-your-systems) | When a workflow reads from or writes to a system behind a firewall: a database, a warehouse, an SFTP server | Network, database or cloud platform team |
| [Give access to your cloud account](#give-access-to-your-cloud-account) | When a workflow uses AWS, Azure or Google Cloud | Cloud platform or IAM team |
| [Set up single sign-on](#set-up-single-sign-on) | When your team should sign in with your identity provider | Identity or DevOps team |
| [Connect your git repositories](#connect-your-git-repositories) | When workflows are deployed from git | Git or platform admin |
| [Review Kestra's security](#review-kestras-security) | Before workflows touch production data | Security, legal or procurement |

## Let sign-in emails through

Sign-in to Kestra Cloud is passwordless: each user receives a login code by email from `noreply@kestra.io`.

**What you do:** if your email filter is strict, allowlist `noreply@kestra.io`. When codes don't arrive, a filter is the usual cause.

## Let your network reach Kestra Cloud

Your team opens Kestra Cloud in a browser, and your own services may call it too: a CI pipeline deploying workflows, or a system sending webhooks to start a workflow.

**What you do:** if your network or proxy restricts outbound traffic, allow HTTPS (port 443) to your instance URL (`<your-instance>.kestra.cloud`) and to the Kestra Cloud Console (`console.kestra.io`).

## Allow Kestra Cloud to reach your systems

Workflows run in Kestra Cloud and connect out to your systems: a query to your database, a file to your SFTP server, a call to an internal API. Those connections leave Kestra Cloud from a fixed set of IP addresses for your region. Kestra Cloud does not need any access into your network to receive webhooks or API calls.

**What you do:**

1. Contact [Kestra support](mailto:support@kestra.io) to obtain the current egress IP list for your region.
2. Add them to the allowlist of each system your workflows use: for example a Snowflake network policy, a Redshift or RDS security group, or your SFTP server's firewall. Database tasks connect directly to the host and port you give them, and support TLS. The same addresses apply to every task, including scripts and dbt runs.

If a system must not be reachable from the internet, run the tasks that use it inside your own cloud account with a [task runner](../02.cloud-compute/index.md#bringing-your-own-runner) such as AWS Batch, Azure Batch or Google Batch. The work then runs in your network, and Kestra Cloud only calls your cloud provider's API to start it. If neither option fits, contact [Kestra support](mailto:support@kestra.io) to discuss your setup.

## Give access to your cloud account

Kestra Cloud runs outside your cloud account, so it has no ambient identity there (no instance profile, IRSA or workload identity). Workflows authenticate with credentials that your team stores as [secrets](../../../06.concepts/04.secret/index.md) in Kestra, and can apply to every matching task with a tenant-wide [policy](../../02.governance/policies/index.md).

**AWS:**

1. Create an IAM user whose only permission is `sts:AssumeRole`, and a role with the permissions the workflows need.
2. Give your team the user's access key. They store it as a secret and set `stsRoleArn` and an external ID on the tasks, so each task run gets short-lived credentials for that role.
3. Optionally, restrict the role to Kestra Cloud's IP addresses.

Keyless access through OIDC federation is not available today. Details: [Running from Kestra Cloud](../../../task-runners/04.types/04.aws-batch-task-runner/index.md#running-from-kestra-cloud) and the [AWS plugin](https://kestra.io/plugins/plugin-aws).

**Google Cloud:** create a service account with the roles the workflows need, and give your team a JSON key for it. They store the key as a secret and set it as `serviceAccount` on the tasks. To act as another service account, they can also set `impersonatedServiceAccount`. Details: the [Google Cloud plugin](https://kestra.io/plugins/plugin-gcp).

**Azure:** register an application (service principal) with the roles the workflows need, and give your team its tenant ID, client ID and a client secret or PEM certificate. They store these as secrets. Managed identities are not available, because Kestra Cloud runs outside your Azure tenant. Details: the [Azure plugin](https://kestra.io/plugins/plugin-azure).

## Set up single sign-on

Kestra Cloud supports single sign-on over OpenID Connect with Google, Microsoft Entra ID, Okta and Keycloak. Other OpenID Connect providers are available on request.

**What you do:** contact [Kestra support](mailto:support@kestra.io) to set up single sign-on. Today it is set up together with the Kestra team in a short call. Before the call:

1. Create an OpenID Connect application in your identity provider. Kestra gives you the redirect URL for your instance.
2. Have the client ID, the client secret and the issuer URL ready.

**Users and roles.** Admins invite users to the instance and give each one a role per tenant, for example Developer for people who build workflows. See [invitations](../../03.auth/invitations/index.md) and [role-based access control](../../03.auth/rbac/index.md). The Kestra Cloud Console, where you manage instances and billing, has its own separate users.

**Available on request:** automatic user and group provisioning with SCIM, access scoped per namespace, and custom roles. Contact [Kestra support](mailto:support@kestra.io).

For CI/CD and other machine access, use a [service account](../../03.auth/service-accounts/index.md) with an [API token](../../03.auth/api-tokens/index.md) rather than a personal account.

## Keep credentials in secrets

Kestra Cloud includes a secret store. Secrets are encrypted, scoped to a namespace, and referenced by name in workflows, so credentials never appear in workflow code. See [secrets](../../../06.concepts/04.secret/index.md).

**Available on request:** read secrets from your own secrets manager, such as AWS Secrets Manager, Azure Key Vault, Google Secret Manager, HashiCorp Vault, 1Password, Doppler, Bitwarden or CyberArk. Contact [Kestra support](mailto:support@kestra.io).

## Connect your git repositories

Kestra Cloud can pull workflows from git with [Git Sync](../../../version-control-cicd/04.git/index.md), and accept deploys from your CI through its API ([CI/CD](../../../version-control-cicd/cicd/index.md)).

**What you do:**

- **Git access:** give your team a git token or SSH key with read access to the repository. A GitHub App also works for the GitHub tasks.
- **CI access:** give your team a service account API token for CI.
- **Shared settings:** your team can set these once for the whole tenant with a [policy](../../02.governance/policies/index.md), for example the API token used by Kestra tasks (`io.kestra.plugin.kestra.*`) and the git credentials, so individual workflows don't repeat them.
- **Firewall:** if your git server is behind a firewall, allowlist Kestra Cloud's IP addresses as described [above](#allow-kestra-cloud-to-reach-your-systems).

## Review Kestra's security

**Compliance.** Kestra Technologies holds a SOC 2 Type 2 report covering Security, Availability and Confidentiality, with GDPR Article 5 audited in the same report. Kestra Cloud is in scope. Request the report, read Kestra's policies and see the current list of sub-processors on the [Trust Center](https://kestra.io/trust).

**Where your data lives.** You choose the region when the instance is created: EU (Google Cloud `europe-west1`, Belgium) or US (Google Cloud `us-central1`, Iowa). Your instance runs in that region. Where each kind of data is processed, and by which sub-processor, is set out in the [Data Processing Agreement](https://kestra.io/dpa).

**How your data is protected.** Each customer instance is isolated from the others. Traffic to the UI and API is encrypted with TLS, and secret values are encrypted at rest. Every change made by users and service accounts is recorded in [audit logs](../../02.governance/06.audit-logs/index.md).

**Available on request:** export audit logs and logs to your SIEM or observability tool. Contact [Kestra support](mailto:support@kestra.io).

**Documents for your review:**
- [Kestra Cloud Terms of Service](https://kestra.io/kestra-cloud-terms-of-service)
- [Kestra Cloud Privacy Policy](https://kestra.io/kestra-cloud-privacy-policy)
- [Data Processing Agreement](https://kestra.io/dpa)
- [Security overview](https://hs.kestra.io/hubfs/kestra-security-overview-enterprise-edition.pdf) (2-page PDF)
- [Kestra security](https://kestra.io/security)

To report a vulnerability, email [security@kestra.io](mailto:security@kestra.io).

## Questions

Email [support@kestra.io](mailto:support@kestra.io), or reply to the onboarding email your team received. If your security team prefers to talk it through, ask for a call with the Kestra team.
