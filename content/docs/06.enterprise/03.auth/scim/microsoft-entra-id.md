---
title: Microsoft Entra ID SCIM Provisioning
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.18.0"
---

Sync Users and Groups from Microsoft Entra ID to Kestra using SCIM.

## Prerequisites

- **Microsoft Entra ID Account**: an account with administrative privileges to configure SCIM provisioning.
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

![scim1](/docs/enterprise/scim1.png)

The above steps will generate a SCIM endpoint URL and a Secret Token that you will use to authenticate Microsoft Entra ID with the SCIM integration in Kestra. Save those details as we will need them in the next steps.

![scim2](/docs/enterprise/scim2.png)

The endpoint should look as follows:

```
https://your_kestra_host/api/v1/your_tenant/integrations/integration_id/scim/v2
```

The Secret Token will be a long string (ca. 200 characters) that will authenticate requests from Microsoft Entra ID to Kestra.

### Enable or Disable SCIM Integration

Note that you can disable or completely remove the SCIM Integration at any time. When an integration is disabled, all incoming requests for that integration endpoint will be rejected.

![scim3](/docs/enterprise/scim3.png)


::alert{type="info"}
At first, you can disable the integration to configure your Microsoft Entra ID integration in the Azure portal, and then enable it once the configuration is complete.
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

::alert{type="info"}
Why the `SCIMProvisioner` role doesn't have the `DELETE` permission for `USERS`? This is because you cannot delete a user through our SCIM implementation. Users are global and SCIM provisioning is per tenant. When we receive a `DELETE` query for a user, we remove their tenant access but the user itself remains in the system.
::

---

## Microsoft Entra ID SCIM Setup

1. **Register Kestra as an Enterprise Application**:
   - Navigate to Microsoft Entra ID → Enterprise Applications.
   - Click on the `+ New application` button to create a new custom application. You can name the app "KestraSCIM" or any other relevant name.
  ![scim6](/docs/enterprise/scim6.png)

2. **Configure SCIM Provisioning**:
   - Go to the newly created Kestra application.
   - Select "Provisioning" and set the Provisioning Mode to "Automatic".
   - Enter the SCIM endpoint URL and the Secret Token provided by Kestra. Paste kestra's SCIM endpoint URL into the Tenant URL field and the Secret Token into the Secret Token field.
   - Finally, click on `Test Connection` and on the `Save` button.
  ![scim7](/docs/enterprise/scim7.png)

3. **Map User and Group Attributes**:
   - Configure attribute mappings for users and groups to match Kestra’s schema requirements.
   - Test the configuration and ensure that users and groups are synchronized correctly.

4. **Enable Provisioning**:
   - Now that everything is configured, you can enable the provisioning integration toggle in the Kestra UI to start syncing users and groups from Microsoft Entra ID to Kestra.

## Additional Resources

- [Microsoft Entra ID SCIM Documentation](https://docs.microsoft.com/en-us/azure/active-directory/app-provisioning/)
