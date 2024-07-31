---
title: authentik SCIM Provisioning
icon: /docs/icons/admin.svg
editions: ["EE"]
version: ">= 0.18.0"
---

Sync Users and Groups from authentik to Kestra using SCIM.

## Prerequisites

- **authentik Account**: an account with administrative privileges to configure SCIM provisioning.
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

![scim1](/docs/enterprise/scim/authentik/scim_authentik.png)

The above steps will generate a SCIM endpoint URL and a Secret Token that you will use to authenticate authentik with the SCIM integration in Kestra. Save those details as we will need them in the next steps.

![scim2](/docs/enterprise/scim/authentik/scim_authentik2.png)

The endpoint should look as follows:

```
https://your_kestra_host/api/v1/your_tenant/integrations/integration_id/scim/v2
```

The Secret Token will be a long string (ca. 200 characters) that will authenticate requests from authentik to Kestra.

### Enable or Disable SCIM Integration

Note that you can disable or completely remove the SCIM Integration at any time. When an integration is disabled, all incoming requests for that integration endpoint will be rejected.

![scim3](/docs/enterprise/scim/authentik/scim3.png)


::alert{type="info"}
At first, you can disable the integration to configure your authentik SCIM integration, and then enable it once the configuration is complete.
::

### IAM Role and Service Account

When creating a new Provisioning Integration, Kestra will automatically create two additional objects:

1. Role `SCIMProvisioner` with the following permissions:
   - `GROUPS`: `CREATE`, `READ` `UPDATE`, `DELETE`
   - `USERS`: `CREATE`, `READ`, `UPDATE`
   - `BINDINGS`: `CREATE`, `READ`, `UPDATE`, `DELETE`
  ![scim4](/docs/enterprise/scim/authentik/scim4.png)

2. Service Account with an API Token which was previously displayed as a Secret Token for the integration:
  ![scim5](/docs/enterprise/scim/authentik/scim5.png)

::alert{type="info"}
Why the `SCIMProvisioner` role doesn't have the `DELETE` permission for `USERS`? This is because you cannot delete a user through our SCIM implementation. Users are global and SCIM provisioning is per tenant. When we receive a `DELETE` query for a user, we remove their tenant access but the user itself remains in the system.
::

---

## authentik SSO Setup

### Install authentik

Authentik provides a simple docker-compose installer for testing purposes. Follow [the instructions](https://docs.goauthentik.io/docs/installation/docker-compose) and click on the initial setup URL http://docker.for.mac.localhost:9000/if/flow/initial-setup/ to create your first user.

![scim-for-authentik-user](/docs/enterprise/scim/authentik/authentik1.png)

### Create Application and SSO Provider in authentik

On the left-hand side select `Applications` → `Applications`. For simplicity we’ll use the `Create with Wizard` button as this will create both an application and a provider.

![scim-for-authentik-2](/docs/enterprise/scim/authentik/authentik2.png)

On the `Application Details` screen, fill in the application `name` and `slug`. Set both here to `kestra` and click `Next`.

![scim-for-authentik-3](/docs/enterprise/scim/authentik/authentik3.png)

On the `Provider Type` screen, select `OAuth2/OIDC` and click `Next`.

![scim-for-authentik-4](/docs/enterprise/scim/authentik/authentik4.png)

On the `Provider Configuration` screen:
1. In the `Authentication flow` field, select “default-authentication-flow (Welcome to authentik!)”
2. In the `Authorization flow` field, select “default-provider-authorization-explicit-consent (Authorize Application)”
![scim-for-authentik-5](/docs/enterprise/scim/authentik/authentik5.png)
3. Keep the Client type as `Confidential` and under the `Redirect URIs/Origins (RegEx)`, enter your Kestra host's `/oauth/callback/authentik` endpoint in the format `http://<kestra_host>:<kestra_port>/oauth/callback/authentik` e.g. http://localhost:28080/oauth/callback/authentik and then Submit the Application:
![scim-for-authentik-6](/docs/enterprise/scim/authentik/authentik6.png)

Note the `Client ID` and `Client Secret` as you will need these to configure Kestra in the next step.

### Configure Authentik SSO in Kestra Settings

With the above Client ID and Secret, add the following in the `micronaut` configuration section:

```yaml
        micronaut:
          security:
            oauth2:
              enabled: true
              clients:
                authentik:
                  client-id: "CLIENT_ID"
                  client-secret: "CLIENT_SECRET"
                  openid:
                    issuer: "http://localhost:9000/application/o/kestra/"
```

Note the above `issuer` URL - if you named your application something other than `kestra`, you will need to update this accordingly: `http://localhost:9000/application/o/<application_name>/`.

To ensure that your SSO users have some initial permissions within Kestra UI, it's useful to set up a default role for them. You can do this by adding the following configuration under the `kestra.security` section:

```yaml
kestra:
  security:
    default-role:
      name: default_admin_role
      description: "Default Admin Role"
      permissions:
        NAMESPACE: ["CREATE", "READ", "UPDATE", "DELETE"]
        ROLE: ["CREATE", "READ", "UPDATE", "DELETE"]
        GROUP: ["CREATE", "READ", "UPDATE", "DELETE"]
        EXECUTION: ["CREATE", "READ", "UPDATE", "DELETE"]
        AUDITLOG: ["CREATE", "READ", "UPDATE", "DELETE"]
        USER: ["CREATE", "READ", "UPDATE", "DELETE"]
        BINDING: ["CREATE", "READ", "UPDATE", "DELETE"]
        FLOW: ["CREATE", "READ", "UPDATE", "DELETE"]
        SECRET: ["CREATE", "READ", "UPDATE", "DELETE"]
        BLUEPRINT: ["CREATE", "READ", "UPDATE", "DELETE"]
        INFRASTRUCTURE: ["CREATE", "READ", "UPDATE", "DELETE"]
        KVSTORE: ["CREATE", "READ", "UPDATE", "DELETE"]
  ee:
    tenants:
      enabled: true
      default-tenant: false
```

::alert{type="info"}
⚠️ Make sure that your `default-role` is added under the `kestra.security` section, not under `micronaut.security`! Also, make sure that the `default-role` has the necessary permissions for your users to interact with Kestra. The above configuration is just an example and you might want to restrict the permissions boundaries for production use.
::

## authentik SCIM 2.0 Setup

Configuring SCIM 2.0 requires a similar process to SSO — you'll need to create a new `Application`. Then, in Step 2, select `SCIM` as the Provider Type.

![scim-for-authentik-7](/docs/enterprise/scim/authentik/authentik7.png)

In the Protocol settings, use the `URL` and `Secret Token` obtained from Kestra. If you are running authentik on a Mac with the [docker-compose setup](https://docs.goauthentik.io/docs/installation/docker-compose) setup, make sure to replace `localhost` in your Kestra's SCIM endpoint with `docker.for.mac.localhost` since otherwise the sync won't work. So your URL should look like `http://docker.for.mac.localhost:8080/api/v1/dev/integrations/zIRjRAMGvkammpeLVuyJl/scim/v2`.

![scim-for-authentik-8](/docs/enterprise/scim/authentik/authentik8.png)

## Test both SSO and SCIM

Create some new `users` and `groups` in the `Directory` settings. It's best if you use an email not tied to the default user at this stage.

![scim-for-authentik-9](/docs/enterprise/scim/authentik/authentik9.png)

It's best if you first create a group and then a user and assign the user to an existing group:

![scim-for-authentik-10](/docs/enterprise/scim/authentik/authentik10.png)

Once groups and users are created, they should be visible in the Kestra UI under the `IAM` → `Users` and `Groups` sections. It's best if you log in as the default admin user and attach a desired `Role` to each group to ensure that the users have the necessary permissions.

Then, to verify that, log in as one of those new authentik users in a separate browser or incognito mode and verify that the user has the permissions you expect.

---

## Additional Resources

- [SCIM for authentik Documentation](https://docs.goauthentik.io/docs/providers/scim/)
- [Manage applications in authentik Documentation](https://docs.goauthentik.io/docs/applications/manage_apps)
