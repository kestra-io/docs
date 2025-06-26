---
title: Configure KeyCloak SSO
icon: /docs/icons/tutorial.svg
editions: ["EE", "Cloud"]
---

Setup KeyCloak SSO to manage authentication for users.

In conjunction with SSO, check out the [KeyCloak SCIM provisioning guide](../scim/keycloak.md).

## Start a KeyCloak service

If you don't have a KeyCloak server already running, you can use a managed service like [Cloud IAM](https://app.cloud-iam.com).

You can follow the steps described [here](https://documentation.cloud-iam.com/get-started/complete-tutorial.html) to deploy a managed KeyCloak cluster for free.

## Configure KeyCloak client

Once in KeyCloak, you would need to create a client:

![alt text](/docs/how-to-guides/keycloak/client1.png)
![alt text](/docs/how-to-guides/keycloak/client2.png)

Set `https://{{ yourKestraInstanceURL }}/oauth/callback/keycloak` as Valid redirect URIs and `https://{{ yourKestraInstanceURL }}/logout` as Valid post logout redirect URIs.

![alt text](/docs/how-to-guides/keycloak/redirect-uri.png)

## Kestra Configuration

```yaml
micronaut:
  security:
    oauth2:
      enabled: true
      clients:
        keycloak:
          client-id: "{{clientId}}"
          client-secret: "{{clientSecret}}"
          openid:
            issuer: "https://{{keyCloakServer}}/realms/{{yourRealm}}"
    endpoints:
      logout:
        get-allowed: true
```

You can retrieve `clientId` and `clientSecret` via KeyCloak user interface

![alt text](/docs/how-to-guides/keycloak/clientId.png)
![alt text](/docs/how-to-guides/keycloak/clientSecret.png)


Don't forget to set a default role in your Kestra configuration to streamline the process of adding new users.

```yaml
kestra:
  security:
    defaultRole:
      name: Editor
      description: Default Editor role
      permissions:
        FLOW: ["CREATE", "READ", "UPDATE", "DELETE"]
        EXECUTION:
          - CREATE
          - READ
          - UPDATE
          - DELETE
```

> Note: depending of the KeyCloak configuration you might want to tune the issuer url.

For more configuration details, refer to the [Keycloak OIDC configuration guide](https://guides.micronaut.io/latest/micronaut-oauth2-keycloak-gradle-java.html).

## Manage Groups via OIDC Claims

If unable to use [SCIM with Keycloak](../scim/keycloak.md), you can use oauth claims to source user roles. This method uses the OIDC provider as the single source of truth for user membership and roles. Keycloak has an existing `roles` claim that can be used to source roles.

To get started, you must first add the `roles` claim to the ID Token—Kestra uses the ID Token so this must be enabled. This can be done in Keycloak by taking the following steps:

1. Select **Client Scopes**
2. Click on the **roles** scope
3. Select **Mappers**
4. Click on **client roles**
5. Enable **Add to ID Token**

In case the interface changes to Keycloak, check out their documentation for [managing resources and scopes](https://www.keycloak.org/docs/latest/authorization_services/#_resource_overview).

### Configure Kestra

After adding or updating your roles, configure Kestra to fetch the `roles` scope like in following Micronaut configuration; make note of the added `scopes` parameter where the information must be added:

```yaml
micronaut:
  security:
    oauth2:
      enabled: true
      clients:
        keycloak:
          client-id: "kestra"
          client-secret: "my-secret"
          openid:
            issuer: "http://localhost:8088/realms/kestra"
          scopes: ["openid", "profile", "email", "roles"] # <-- needs to be added
      endpoints:
        logout:
          get-allowed: true
```

With this configured, you then need to update the `kestra` property in your configuration file to synchronize groups from this claim with the `groups-claim-path`:

```yaml
kestra:
  security:    
    oidc:
      groups-claim-path: "resource_access.kestra.roles"
```

Once the synchronization connection is made, you are now able to use oauth claims to source user roles with Keycloak as the single source of truth
