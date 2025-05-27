---
title: Okta SCIM Provisioning
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.18.0"
---

Sync Users and Groups from Okta to Kestra using SCIM.

## Prerequisites

- **Okta Account**: an account with administrative privileges to configure SCIM provisioning.
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

![scim1](/docs/enterprise/scim1_okta.png)

The above steps will generate a SCIM endpoint URL and a Secret Token that you will use to authenticate Okta with the SCIM integration in Kestra. Save those details as we will need them in the next steps.

![scim2](/docs/enterprise/scim2.png)

The endpoint should look as follows:

```
https://your_kestra_host/api/v1/your_tenant/integrations/integration_id/scim/v2
```

The Secret Token will be a long string (ca. 200 characters) that will authenticate requests from Okta to Kestra.

### Enable or Disable SCIM Integration

Note that you can disable or completely remove the SCIM Integration at any time. When an integration is disabled, all incoming requests for that integration endpoint will be rejected.

![scim3](/docs/enterprise/scim3.png)


::alert{type="info"}
At first, you can disable the integration to configure your Okta SCIM integration, and then enable it once the configuration is complete.
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

## Okta SCIM Setup

1. **Create an App Integration**:
   - Navigate to Okta Admin Console → Applications → Applications.
   - Click on "Create App Integration" and then select:
     - Sign-in Method: OIDC - OpenID Connect
     - Application Type: Web Application
   - Then on the next page:
       - Give your application a name, e.g. `Kestra`
       - Grant Type: Client Acting on behalf of itself → Client Credentials → True
       - Login
         - Sign-in redirect URIs → http://<kestra-hostname>/oauth/callback/okta
         - Sign-out redirect URIs → http://<kestra-hostname>/logout
   - Once application is created, select it in the Applications view and take note of the client ID and client secret.
   ![okta1](/docs/enterprise/okta1.png)

2. **Configure Okta in Kestra**:
   - With the above client ID and secret, add the following in your Kestra Micronaut configuration:
    ```yaml
            micronaut:
              security:
                oauth2:
                  enabled: true
                  clients:
                    okta:
                      client-id: "CLIENT_ID"
                      client-secret: "CLIENT-SECRET"
                      openid:
                        issuer: "https://{okta-account}.okta.com/"
    ```
   - Enter the SCIM endpoint URL and API token provided by Kestra.

3. **Configure SCIM 2.0 in Okta**:
   - In Okta, navigate to Applications → Applications → Browse App Catalog
   - Search for SCIM 2.0
   - Select SCIM 2.0 Test App (OAuth Bearer Token)
   - in Sign-in options select Secure Web Authentication → user sets username/password
   - Click Done
   - Select the integration you have just created, then enter the `Provisioning` tab.
   - Fill in the Endpoint URL you obtained from Kestra into the `SCIM 2.0 Base Url` field. Enter the Secret Token generated in Kestra into the `OAuth Bearer Token` field.
   - Finally, click on the `Test API Credentials` to verify the connection.
    ![okta2](/docs/enterprise/okta2.png)

4. **Map Attributes**:
   - Select “Push Groups” and choose the Groups you wish to push to Kestra.
   - Perform a test to ensure the mappings are correct and data is syncing properly.

5. **Enable Provisioning**:
   - Enable the provisioning integration toggle in the Kestra UI to begin automatic synchronization of users and groups from Okta to Kestra.

## Additional Resources

- [Okta SCIM Documentation](https://developer.okta.com/docs/reference/scim/)
