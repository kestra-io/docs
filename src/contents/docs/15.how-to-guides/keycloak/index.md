---
title: Configure KeyCloak SSO in Kestra
icon: /src/contents/docs/icons/tutorial.svg
stage: Getting Started
topics:
  - Kestra Concepts
editions: ["EE"]
---

Setup KeyCloak SSO to manage authentication for users.

## Configure KeyCloak SSO in Kestra

If you don't have a KeyCloak server already running, you can use a managed service like [Cloud IAM](https://app.cloud-iam.com).

You can follow the steps described [here](https://documentation.cloud-iam.com/get-started/complete-tutorial.html) to deploy a managed KeyCloak cluster for free.

## Configure KeyCloak client

Once in KeyCloak, you would need to create a client:

![alt text](./client1.png)
![alt text](./client2.png)

Set `https://{{ yourKestraInstanceURL }}/oauth/callback/keycloak` as Valid redirect URIs and `https://{{ yourKestraInstanceURL }}/logout` as Valid post logout redirect URIs.

![alt text](./redirect-uri.png)

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

![alt text](./clientId.png)
![alt text](./clientSecret.png)


Don't forget to set a default role in your [Kestra configuration](../../configuration/index.md) to streamline the process of adding new users.

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
