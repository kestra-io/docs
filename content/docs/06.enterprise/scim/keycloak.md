---
title: Keycloak SCIM Provisioning
icon: /docs/icons/admin.svg
editions: ["EE"]
version: ">= 0.18.0"
---

Sync Users and Groups from Keycloak to Kestra using SCIM.

## Prerequisites

- **Keycloak Account**: an account with administrative privileges to configure SCIM provisioning.
- **Enable multi-tenancy in Kestra**: tenants MUST be enabled in Kestra to support SCIM provisioning. You can enable tenants by setting the `kestra.ee.tenants.enabled` configuration property to `true`:

```yaml
kestra:
  ee:
    tenants:
      enabled: true
```

## Kestra SCIM Setup: Create a New Provisioning Integration

1. In the Kestra UI, navigate to the `Administration` → `IAM` → `Provisioning` page.
2. Click on the `Create` button in the top right corner of the page.
3. Fill in the following fields:
   - **Name**: Enter a name for the provisioning integration.
   - **Description**: Provide a brief description of the integration.
   - **Provisioning Type**: currently, we only support SCIM 2.0 — leave the default selection and click `Save`.

![scim1](/docs/enterprise/scim1_keycloak.png)

The above steps will generate a SCIM endpoint URL and a Secret Token that you will use to authenticate Keycloak with the SCIM integration in Kestra. Save those details as we will need them in the next steps.

![scim2](/docs/enterprise/scim2.png)

The endpoint should look as follows:

```
https://your_kestra_host/api/v1/your_tenant/integrations/integration_id/scim/v2
```

The Secret Token will be a long string (ca. 200 characters) that will authenticate requests from Keycloak to Kestra.

### Enable or Disable SCIM Integration

Note that you can disable or completely remove the SCIM Integration at any time. When an integration is disabled, all incoming requests for that integration endpoint will be rejected.

![scim3](/docs/enterprise/scim3.png)


::alert{type="info"}
At first, you can disable the integration to configure your Keycloak SCIM integration, and then enable it once the configuration is complete.
::

### IAM Role and Service Account

When creating a new Provisioning Integration, Kestra will automatically create two additional objects:

1. Role `SCIMProvisioner` with the following permissions:
   - `GROUPS`: `CREATE`, `READ` `UPDATE`, `DELETE`
   - `USERS`: `CREATE`, `READ`, `UPDATE`
   - `BINDINGS`: `CREATE`, `READ`, `UPDATE`, `DELETE`
  ![scim4](/docs/enterprise/scim4.png)

2. Service Account with an API Token which was previously displayed as a Secret Token for the integration:
  ![scim5](/docs/enterprise/scim5.png)

---

## Keycloak SCIM Setup

WIP

## Additional Resources

- [SCIM for Keycloak Documentation](https://scim-for-keycloak.de/documentation/introduction)
