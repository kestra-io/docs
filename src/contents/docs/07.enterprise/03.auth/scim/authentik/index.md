---
title: authentik SCIM Provisioning
description: Configure SCIM provisioning with authentik. Learn how to automatically sync users and groups from authentik to your Kestra Enterprise instance.
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.18.0"
---

Sync Users and Groups from authentik to Kestra using SCIM.

## authentik SCIM provisioning

## Prerequisites

- **authentik Account**: An account with administrative privileges to configure SCIM provisioning.
- **Enable multi-tenancy in Kestra**: Tenants must be enabled in Kestra to support SCIM provisioning. You can enable tenants by setting the `kestra.ee.tenants.enabled` configuration property to `true`:

```yaml
kestra:
  ee:
    tenants:
      enabled: true
```

:::alert{type="info"}
Tenants are enabled by default. Please refer to the [Migration Guide](../../../../11.migration-guide/v0.23.0/tenant-migration-ee/index.md) to assist with upgrading.
:::

## Kestra SCIM setup: create a new provisioning integration

1. In the Kestra UI, navigate to the `Tenant` → `IAM` → `SCIM Provisioning` page.
2. Click on the `Create` button in the top right corner of the page.
3. Fill in the following fields:
   - **Name**: Enter a name for the provisioning integration.
   - **Description**: Provide a brief description of the integration.
   - **Provisioning Type**: Currently, only SCIM 2.0 is supported — leave the default selection and click `Save`.

![scim1](./scim_authentik.png)

The above steps will generate a SCIM endpoint URL and a Secret Token that you will use to authenticate authentik with the SCIM integration in Kestra. Save those details, as they will be needed in the next steps.

![scim2](./scim_authentik2.png)

The endpoint should look as follows:

```
https://<your_kestra_host>/api/v1/<your_tenantID>/integrations/integration_id/scim/v2
```

The Secret Token will be a long string (approximately 200 characters) used to authenticate requests from authentik to Kestra.

### Enable or disable SCIM integration

Note that you can disable or completely remove the SCIM Integration at any time. When an integration is disabled, all incoming requests to that integration endpoint will be rejected.

![scim3](../okta/scim3.png)

:::alert{type="info"}
At first, you can disable the integration to configure your authentik SCIM integration, and then enable it once the configuration is complete.
:::

### IAM role and service account

When creating a new Provisioning Integration, Kestra will automatically create two additional objects:

1. Role `SCIMProvisioner` with the following permissions:
   - `GROUPS`: `CREATE`, `READ` `UPDATE`, `DELETE`
   - `USERS`: `CREATE`, `READ`, `UPDATE`
   - `BINDINGS`: `CREATE`, `READ`, `UPDATE`, `DELETE`
  ![scim4](../okta/scim4.png)

2. Service Account with an API Token which was previously displayed as a Secret Token for the integration:
  ![scim5](../okta/scim5.png)

:::alert{type="info"}
Why the `SCIMProvisioner` role doesn't have the `DELETE` permission for `USERS`? This is because you cannot delete a user through our SCIM implementation. Users are global and SCIM provisioning is per tenant. When we receive a `DELETE` query for a user, we remove their tenant access but the user itself remains in the system.
:::

---

## authentik SCIM 2.0 setup

Configuring SCIM 2.0 follows a process similar to SSO — you'll need to create a new `Application`. Then, in the second step, select `SCIM` as the Provider Type.

![scim-for-authentik-7](./authentik7.png)

In the `Protocol settings` section, enter the `URL` and `Secret Token` obtained from Kestra.

:::alert{type="info"}
If you are running authentik on a Mac machine with [docker-compose installer](https://docs.goauthentik.io/docs/installation/docker-compose), make sure to replace `localhost` in your Kestra's SCIM endpoint with `host.docker.internal` since otherwise the sync won't work. Your URL should look as follows: `http://host.docker.internal:8080/api/v1/dev/integrations/zIRjRAMGvkammpeLVuyJl/scim/v2`.
:::

![scim-for-authentik-8](./authentik8.png)


## Test both SSO and SCIM by adding users and groups

First, create `Users` and `Groups` in the `Directory` settings.

![scim-for-authentik-9](./authentik9.png)

Then assign your user(s) to an existing group.

![scim-for-authentik-10](./authentik10.png)

You can set a password for each authentik user to allow them to log in directly to Kestra with their username/email and password.

![scim-for-authentik-11](./authentik11.png)

Once groups and users are created, they should be visible in the Kestra UI under the `IAM` → `Users` and `Groups` sections. It’s best to log in as the default admin user and attach the desired `Role` to each group to ensure that the users have the necessary permissions.

![scim-for-authentik-12](./authentik12.png)

Then, to verify access, log in as one of those new authentik users in a separate browser or incognito mode and verify that the user has the permissions you expect.

---

## Additional resources

- [SCIM for authentik Documentation](https://docs.goauthentik.io/docs/providers/scim/)
- [Manage applications in authentik Documentation](https://docs.goauthentik.io/docs/applications/manage_apps)
