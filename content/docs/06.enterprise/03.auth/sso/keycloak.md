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
            issuer: "https://{{keyCloakServer}}/auth/realms/{{yourRealm}}"
    endpoints:
      logout:
        get-allowed: true
```

You can retrieve `clientId` and `clientSecret` via KeyCloak user interface

![alt text](/docs/how-to-guides/keycloak/clientId.png)
![alt text](/docs/how-to-guides/keycloak/clientSecret.png)


Don't forget to set a default role in your Kestra configuration to streamline the process of adding new users.

```
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
