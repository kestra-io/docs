---
title: SCIM Directory Sync
icon: /docs/icons/admin.svg
editions: ["EE"]
version: ">= 0.18.0"
---

Sync users and groups from your Identity Provider to Kestra using SCIM.

## What is SCIM

SCIM (System for Cross-domain Identity Management) is an open standard protocol designed to facilitate user identity management across multiple systems.

 It simplifies user provisioning, de-provisioning, and group synchronization between identity providers (IdPs) such as Microsoft Entra ID or Okta, and service providers (SPs) such as Kestra. In Layman's terms, SCIM allows you to automatically keep your users and groups in sync between your IdP and Kestra.

Kestra relies explicitly on the SCIM 2.0 protocol for directory synchronization.

![scim.jpeg](/docs/enterprise/scim.jpeg)

### Benefits of a Directory Sync with SCIM

1. **Automated provisioning and de-provisioning**: SCIM allows you to automate provisioning and de-provisioning of users, creating a single source of truth (SSOT) of the user identity data. Instead of manually creating and managing users in Kestra, you can sync them from your IdP.
2. **Consistency and compliance**: with SCIM, you can ensure consistency of identity information across systems and stay compliant with security and regulatory requirements.
3. **Governance at scale**: managing users at scale across many applications can be difficult without a standardized method for identity synchronization. SCIM provides a scalable solution for managing user identities.

---

## How to Sync Users and Groups from Microsoft Entra ID

### Prerequisites

- **Microsoft Entra ID Account**: you need an Microsoft Entra ID account with administrative privileges to configure SCIM provisioning.
- **Enable multi-tenancy in Kestra**: tenants MUST be enabled in Kestra to support SCIM provisioning. You can enable tenants by setting the `kestra.ee.tenants.enabled` configuration property to `true`:

```yaml
kestra:
  ee:
    tenants:
      enabled: true
```

### Kestra SCIM setup: create a new provisioning integration

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

::alert{type="info"}
Note that you can disable or completely remove the SCIM Integration at any time. When an integration is disabled, all incoming requests for that integration endpoint will be rejected.

At first, you can disable the integration to configure your Microsoft Entra ID integration in the Azure portal, and then enable it once the configuration is complete.
![scim3](/docs/enterprise/scim3.png)
::

Note that when creating a new SCIM integration, Kestra will automatically create two additional objects:

1. Role `SCIMProvisioner` with the following permissions:
   - `GROUPS`: `CREATE`, `READ` `UPDATE`, `DELETE`
   - `USERS`: `CREATE`, `READ`, `UPDATE`
   - `BINDINGS`: `CREATE`, `READ`, `UPDATE`, `DELETE`
  ![scim4](/docs/enterprise/scim4.png)

2. Service Account with an API Token which was previously displayed as a Secret Token for the integration:
  ![scim5](/docs/enterprise/scim5.png)


### Microsoft Entra ID SCIM setup

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
   - Now that everything is configured, you can enable the provisioning integration in the Kestra UI to start syncing users and groups from Microsoft Entra ID to Kestra.

---

## How to Sync Users and Groups from Okta

### Prerequisites

- **Okta Account**: you need an Okta account with administrative privileges to configure SCIM provisioning.
- **Enable multi-tenancy in Kestra**: tenants MUST be enabled in Kestra to support SCIM provisioning. You can enable tenants by setting the `kestra.ee.tenants.enabled` configuration property to `true`:

```yaml
kestra:
  ee:
    tenants:
      enabled: true
```

### Kestra SCIM setup: create a new provisioning integration

1. In the Kestra UI, navigate to the `Administration` → `IAM` → `Provisioning` page.
2. Click on the `Create` button in the top right corner of the page.
3. Fill in the following fields:
   - **Name**: Enter a name for the provisioning integration.
   - **Description**: Provide a brief description of the integration.
   - **Provisioning Type**: currently, we only support SCIM 2.0 — leave the default selection and click `Save`.

![scim1](/docs/enterprise/scim1.png)

The above steps will generate a SCIM endpoint URL and a Secret Token that you will use to authenticate Okta with the SCIM integration in Kestra. Save those details as we will need them in the next steps.

![scim2](/docs/enterprise/scim2.png)

The endpoint should look as follows:

```
https://your_kestra_host/api/v1/your_tenant/integrations/integration_id/scim/v2
```

The Secret Token will be a long string (ca. 200 characters) that will authenticate requests from Okta to Kestra.

::alert{type="info"}
Note that you can disable or completely remove the SCIM Integration at any time. When an integration is disabled, all incoming requests for that integration endpoint will be rejected.

At first, disable the integration to configure your Okta SCIM integration, and then enable it once the configuration is complete.
![scim3](/docs/enterprise/scim3.png)
::

Note that when creating a new SCIM integration, Kestra will automatically create two additional objects:

1. Role `SCIMProvisioner` with the following permissions:
   - `GROUPS`: `CREATE`, `READ` `UPDATE`, `DELETE`
   - `USERS`: `CREATE`, `READ`, `UPDATE`
   - `BINDINGS`: `CREATE`, `READ`, `UPDATE`, `DELETE`
  ![scim4](/docs/enterprise/scim4.png)

2. Service Account with an API Token which you have seen displayed as a Secret Token for the integration:
  ![scim5](/docs/enterprise/scim5.png)

### Okta setup: create application in Okta dashboard

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
   - Select the integration you have just created, then enter the `Provisioning` tab. Fill in the Endpoint URL you obtained from Kestra into the `SCIM 2.0 Base Url` field. Enter the Secret Token generated in Kestra into the `OAuth Bearer Token` field.
   - Finally, click on the `Test API Credentials` to verify the connection.
    ![okta2](/docs/enterprise/okta2.png)

4. **Map Attributes**:
   - Select “Push Groups” and choose the Groups you wish to push to Kestra.
   - Perform a test to ensure the mappings are correct and data is syncing properly.

5. **Activate Provisioning**:
   - Enable the provisioning integration in the Kestra UI to begin automatic synchronization of users and groups from Okta to Kestra.

### Additional Resources

- [Microsoft Entra ID SCIM Documentation](https://docs.microsoft.com/en-us/azure/active-directory/app-provisioning/)
- [Okta SCIM Documentation](https://developer.okta.com/docs/reference/scim/)
