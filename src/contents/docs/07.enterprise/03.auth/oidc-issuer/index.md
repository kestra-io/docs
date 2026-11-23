---
title: "Kestra as an OIDC Issuer: Keyless AWS, GCP, and JFrog Access"
h1: Access AWS, Google Cloud, and JFrog Without Static Credentials
description: Configure Kestra Enterprise as an OIDC issuer so flows exchange short-lived tokens for AWS, Google Cloud, or JFrog credentials instead of stored keys.
sidebarTitle: OIDC Issuer
icon: /src/contents/docs/icons/admin.svg
editions: ["EE"]
version: ">= 2.1.0"
docId: oidc-issuer
---

Kestra Enterprise can act as an OpenID Connect (OIDC) identity provider, so your flows get temporary AWS, Google Cloud, and JFrog credentials without any access key or service account key stored in Kestra.

This matters most when Kestra runs outside the cloud it needs to reach, for example on-premises or on another cloud provider. There is no instance role or workload identity to fall back on, so the usual alternative is a long-lived access key stored as a secret. When Kestra already runs on AWS or Google Cloud, the worker's own identity gives keyless access too, and the issuer adds a separate identity per tenant, namespace, or flow.

The issuer identifies tenants, namespaces, and flows to other services. It doesn't sign users in to Kestra: for that, see [Single Sign-On](../sso/index.md).

:::alert{type="info"}
The OIDC issuer isn't available on Kestra Cloud yet. If you'd like to use it, contact your Kestra account team.
:::

## How it works

A task calls the [`oidcToken()`](../../../expressions/04.functions/02.data-access/index.mdx#oidctoken) function, and Kestra signs a short-lived JSON Web Token (JWT) that identifies the running execution. The task's plugin sends that token to the cloud provider, which checks the signature against the public keys Kestra publishes and returns temporary credentials for a role or service account you have configured to trust Kestra. This is the same model GitHub Actions uses to reach AWS and Google Cloud.

The cloud provider trusts a token based on its subject, which Kestra builds from the execution and never from the flow's code:

```text
tenant:<tenant>:namespace:<namespace>:flow:<flow>
```

The segments go from broad to narrow, so a trust policy can match one flow, or every flow in a namespace with a wildcard such as `tenant:prod:namespace:team.data:*`.

## Prerequisites

:::alert{type="warning"}
The issuer URL must be reachable from the public internet over HTTPS, with a certificate the service trusts. AWS, Google Cloud, and other services download the discovery document and the public keys from that URL, without credentials, to verify each token. An instance that is only reachable on a private network can't use the issuer.
:::

- An RSA private key in PEM format (PKCS#8 or PKCS#1) for each issuer you declare. For example, generate a 2048-bit key with `openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out kestra-oidc.pem`. Anyone who holds the key can create tokens that your cloud accounts trust, so store it like a secret and pass it to Kestra through an environment variable or your secret manager, never in a committed file.
- For remote workers, [worker authentication](../../04.scalability/worker-group/index.md#worker-authentication) enabled on the controller and the workers.

## Configure the issuer

Enable the issuer and give it a signing key in the Kestra configuration. This example reads the key from the `OIDC_KEY_INSTANCE` environment variable:

```yaml
kestra:
  url: https://kestra.acme.com
  security:
    oidc:
      issuer:
        enabled: true
        allowed-audiences:
          - sts.amazonaws.com
        keys:
          - kid: 2026-11
            active: true
            private-key: ${OIDC_KEY_INSTANCE}
```

Kestra checks the configuration at startup and doesn't start if there is no key, no active key or more than one, a duplicate `kid`, a malformed key, or a URL that isn't HTTPS. The error names the property at fault, for example `kestra.security.oidc.issuer.issuers[1].keys`. The issuer runs on the controller, webserver, and standalone servers only, so you don't need to give the private key to your workers. Workers request their tokens from the controller.

Once Kestra restarts, it serves two public documents that the cloud provider reads, with no authentication:

| Path | Content |
|---|---|
| `/.well-known/openid-configuration` | The discovery document: the issuer URL and the location of the public keys. |
| `/oidc/jwks.json` | The public keys (JWKS) of every configured key. |

Check that the issuer is up by opening `https://kestra.acme.com/.well-known/openid-configuration`. The `issuer` value is the URL that you register with the cloud provider.

The issuer accepts the following properties under `kestra.security.oidc.issuer`:

| Property | Default | Description |
|---|---|---|
| `enabled` | `false` | Turn on the issuer. Applies to every issuer. |
| `url` | `kestra.url` | The issuer URL, used as the `iss` claim of the instance issuer's tokens. [Dedicated issuer](#dedicated-issuers-per-tenant-or-namespace) URLs are built from it. |
| `allow-insecure-url` | `false` | Allow an `http` URL. Use it for local testing only, since AWS and Google Cloud require HTTPS. Applies to every issuer. |
| `token-ttl` | `PT5M` | Lifetime of a token. A token only has to last until the cloud provider exchanges it, so keep it short. Kestra logs a warning above 15 minutes. |
| `cache-max-age` | `PT10M` | How long the cloud provider may cache the discovery document and the public keys. Applies to every issuer. |
| `allowed-audiences` | Any | The audiences tokens may be issued for. `oidcToken()` fails for any other audience. |
| `keys` | | The signing keys, each with an optional `kid`, `active`, and `private-key`. Exactly one key is active. Without `kid`, Kestra uses the key's RFC 7638 thumbprint. |
| `issuers` | | [Dedicated issuers](#dedicated-issuers-per-tenant-or-namespace) for a tenant or a namespace. |

## Use the token in a flow

The `oidcToken()` function returns a token for the running execution. Its required `audience` argument names the service the token is for, and becomes the token's `aud` claim:

```twig
{{ oidcToken(audience='sts.amazonaws.com') }}
{{ oidcToken(audience='//iam.googleapis.com/projects/123456789/locations/global/workloadIdentityPools/kestra/providers/kestra') }}
```

Kestra masks the token in execution logs, the same way it masks [secrets](../../../06.concepts/04.secret/index.md). Pass it to the task's identity property rather than storing it: the AWS and Google Cloud plugins render the expression again each time they refresh their credentials, so a task that runs longer than the token's lifetime keeps working.

Each token carries these claims:

| Claim | Value |
|---|---|
| `iss` | The issuer URL. |
| `sub` | `tenant:<tenant>:namespace:<namespace>:flow:<flow>` |
| `aud` | The `audience` argument. |
| `iat`, `nbf`, `exp` | Issued at, not before, and expiry. `exp` is `token-ttl` after `iat`. |
| `jti` | A unique token ID. |
| `tenant`, `namespace`, `flow`, `execution_id` | The execution's identity, as separate claims for providers that map claims to attributes. |
| `task_id` | The task that requested the token. |

## Connect AWS

AWS exchanges the token for a role's temporary credentials through `sts:AssumeRoleWithWebIdentity`.

1. Register Kestra as an OIDC identity provider in AWS IAM, with `sts.amazonaws.com` as the audience:

    ```bash
    aws iam create-open-id-connect-provider \
      --url https://kestra.acme.com \
      --client-id-list sts.amazonaws.com
    ```

2. Create an IAM role whose trust policy allows that provider to assume it, with conditions on the token's audience and subject. This policy lets every flow in the `team.data` namespace of the `prod` tenant assume the role:

    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "Federated": "arn:aws:iam::123456789012:oidc-provider/kestra.acme.com"
          },
          "Action": "sts:AssumeRoleWithWebIdentity",
          "Condition": {
            "StringEquals": {
              "kestra.acme.com:aud": "sts.amazonaws.com"
            },
            "StringLike": {
              "kestra.acme.com:sub": "tenant:prod:namespace:team.data:*"
            }
          }
        }
      ]
    }
    ```

    Use `StringEquals` with a full subject to allow a single flow.

3. In the flow, set `stsRoleArn` to the role and `webIdentityToken` to a token from `oidcToken()`:

    ```yaml
    id: list_bucket
    namespace: team.data

    tasks:
      - id: list
        type: io.kestra.plugin.aws.s3.List
        region: eu-west-1
        bucket: my-bucket
        stsRoleArn: arn:aws:iam::123456789012:role/kestra-team-data
        webIdentityToken: "{{ oidcToken(audience='sts.amazonaws.com') }}"
    ```

The task needs no `accessKeyId` or `secretKeyId`. The role session lasts `stsRoleSessionDuration`. If `webIdentityToken` is set without `stsRoleArn`, the task fails instead of falling back to the worker's own AWS identity.

`webIdentityToken` is available on the tasks of the AWS plugin. The [AWS Batch task runner](../../../task-runners/04.types/04.aws-batch-task-runner/index.md) doesn't support it yet.

## Connect Google Cloud

Google Cloud exchanges the token through Workload Identity Federation. A flow then acts as a service account that the workload identity pool can impersonate.

1. Create a workload identity pool and an OIDC provider that trusts Kestra. Map `google.subject` from the token's `sub`, and map the claims you want to write conditions on, such as `namespace`:

    ```bash
    gcloud iam workload-identity-pools create kestra \
      --location=global

    gcloud iam workload-identity-pools providers create-oidc kestra \
      --location=global \
      --workload-identity-pool=kestra \
      --issuer-uri=https://kestra.acme.com \
      --attribute-mapping="google.subject=assertion.sub,attribute.namespace=assertion.namespace"
    ```

2. Let identities from the pool impersonate a service account. This binding allows every flow in the `team.data` namespace:

    ```bash
    gcloud iam service-accounts add-iam-policy-binding kestra-team-data@my-project.iam.gserviceaccount.com \
      --role=roles/iam.workloadIdentityUser \
      --member="principalSet://iam.googleapis.com/projects/123456789/locations/global/workloadIdentityPools/kestra/attribute.namespace/team.data"
    ```

3. In the flow, set `workloadIdentityAudience` to the provider's full resource name, pass the same value as the token's audience, and set the service account to impersonate:

    ```yaml
    id: list_bucket
    namespace: team.data

    tasks:
      - id: list
        type: io.kestra.plugin.gcp.gcs.List
        projectId: my-project
        from: gs://my-bucket/
        workloadIdentityAudience: "//iam.googleapis.com/projects/123456789/locations/global/workloadIdentityPools/kestra/providers/kestra"
        workloadIdentityToken: "{{ oidcToken(audience='//iam.googleapis.com/projects/123456789/locations/global/workloadIdentityPools/kestra/providers/kestra') }}"
        impersonatedServiceAccount: kestra-team-data@my-project.iam.gserviceaccount.com
    ```

Set `projectId` explicitly: without a service account key, the task has nothing to read the project from. `workloadIdentityToken` requires `workloadIdentityAudience` and can't be combined with `serviceAccount`. If you set `allowed-audiences` on the issuer, add the provider's resource name to it.

## Connect JFrog

<!-- Live-tested 2026-11-23 against a JFrog trial (instance and tenant issuers, sub wildcard mapping, FORBIDDEN on mismatch). -->

The JFrog Platform exchanges the token for a short-lived JFrog access token through its OIDC integration. Any service that accepts tokens from a generic OIDC provider works the same way: register the issuer URL, then exchange the token in your flow.

1. In the JFrog Platform, go to **Administration > General Management > Manage Integrations**, open the **OpenID Connect** tab, and click **New Integration** to add an integration:
    - **Provider Name**: `kestra`. The flow sends this name with each exchange.
    - **Provider Type**: **Generic OpenID Connect**.
    - **Provider URL**: the issuer URL, for example `https://kestra.acme.com`.
    - **Audience**: `jfrog`. The flow passes the same value to `oidcToken()`.

    Each issuer needs its own integration. To trust a [dedicated issuer](#dedicated-issuers-per-tenant-or-namespace), use its URL as the provider URL, for example `https://kestra.acme.com/oidc/tenants/prod`.

2. Add an identity mapping to the integration. Its claims decide which tokens it accepts, and its token scope decides what the resulting access token can do. This mapping accepts every flow in the `team.data` namespace of the `prod` tenant:

    ```json
    {
      "sub": "tenant:prod:namespace:team.data:*"
    }
    ```

    Always set claims: without them, any token from the issuer gets the mapping's scope. For the token scope, pick a group that can read the repositories the flow needs, and keep the expiration short, for example 10 minutes.

    To script this step and the previous one, use JFrog's REST API: `POST /access/api/v1/oidc` creates the integration, and `POST /access/api/v1/oidc/<provider-name>/identity_mappings` adds the mapping.

3. In the flow, exchange the token and use the access token within the same task, so it never appears in the execution's outputs:

    ```yaml
    id: download_artifact
    namespace: team.data

    tasks:
      - id: download
        type: io.kestra.plugin.scripts.shell.Commands
        taskRunner:
          type: io.kestra.plugin.core.runner.Process
        env:
          OIDC_TOKEN: "{{ oidcToken(audience='jfrog') }}"
        outputFiles:
          - app.tar.gz
        commands:
          - |
            ACCESS_TOKEN=$(curl -sf -X POST https://acme.jfrog.io/access/api/v1/oidc/token \
              -H "Content-Type: application/json" \
              -d "{\"grant_type\": \"urn:ietf:params:oauth:grant-type:token-exchange\", \"subject_token_type\": \"urn:ietf:params:oauth:token-type:id_token\", \"subject_token\": \"$OIDC_TOKEN\", \"provider_name\": \"kestra\"}" \
              | jq -r .access_token)
            curl -sf -H "Authorization: Bearer $ACCESS_TOKEN" -o app.tar.gz \
              https://acme.jfrog.io/artifactory/releases/app/1.0/app.tar.gz
    ```

    This example runs on the worker with the `Process` task runner, so the worker needs `curl` and `jq`. If you set `allowed-audiences` on the issuer, add `jfrog` to it.

## Dedicated issuers per tenant or namespace

With a single instance issuer, every token carries the same issuer URL and verifies against the same keys, whatever tenant it comes from. A cloud account that trusts the instance issuer trusts every tenant, and only the subject condition in its trust policy keeps the other tenants out.

A dedicated issuer gives a tenant, or a namespace and its children, its own issuer URL and keys. A cloud account registered on a dedicated issuer can't verify a token from anywhere else, whatever its subject says. Use one when a cloud account must trust a single tenant or team, or when tenants must not share a signing key.

```yaml
kestra:
  url: https://kestra.acme.com
  security:
    oidc:
      issuer:
        enabled: true
        issuers:
          - tenant: prod
            keys:
              - kid: prod-2026-11
                active: true
                private-key: ${OIDC_KEY_PROD}
          - tenant: prod
            namespace: finance
            token-ttl: PT3M
            allowed-audiences:
              - sts.amazonaws.com
            keys:
              - kid: finance-2026-11
                active: true
                private-key: ${OIDC_KEY_FINANCE}
```

Each entry under `issuers` accepts the following properties:

| Property | Default | Description |
|---|---|---|
| `tenant` | | The tenant the issuer signs for. Required. |
| `namespace` | Every namespace of the tenant | Restrict the issuer to this namespace and its child namespaces. |
| `url` | Built from the instance `url` | The issuer's `iss`. The discovery document and the public keys stay on their default paths, so a custom URL needs a proxy that maps it onto them. |
| `token-ttl` | The instance `token-ttl` | Lifetime of the issuer's tokens. |
| `allowed-audiences` | The instance `allowed-audiences` | Replaces the instance list for this issuer. |
| `keys` | | The issuer's signing keys, with the same rules as the instance keys. A `kid` only has to be unique within one issuer. |

Two issuers can't share a scope or an issuer URL: Kestra doesn't start if they do. A tenant with namespace issuers but no tenant issuer only logs a warning, and its other namespaces use the instance issuer.

### Which issuer signs a token

Kestra signs each token with the most specific issuer that covers the execution:

1. The issuer of the namespace, or of its closest parent namespace that has one. The `finance` issuer covers `finance`, `finance.ap`, and `finance.ap.eu`.
2. Otherwise, the tenant's issuer.
3. Otherwise, the instance issuer, if it has keys.

With the configuration above:

| Execution | Issuer | `iss` |
|---|---|---|
| Tenant `prod`, namespace `finance.ap` | Namespace `finance` | `https://kestra.acme.com/oidc/tenants/prod/namespaces/finance` |
| Tenant `prod`, namespace `sales` | Tenant `prod` | `https://kestra.acme.com/oidc/tenants/prod` |
| Tenant `dev`, any namespace | Instance | `https://kestra.acme.com` |

The `sub` claim is the same whichever issuer signs the token. Flows need no change either: `oidcToken()` picks the issuer from the execution's tenant and namespace.

Instance `keys` are optional when you declare dedicated issuers. Without them, there is no instance issuer: `/.well-known/openid-configuration` and `/oidc/jwks.json` return 404, and `oidcToken()` fails in any namespace that no dedicated issuer covers. Leave them out when only some tenants use the issuer and no key should sign for all of them.

### Dedicated issuer URLs

Each dedicated issuer has its own URL and documents:

| Scope | Issuer URL | Public keys |
|---|---|---|
| Tenant | `<url>/oidc/tenants/<tenant>` | `<url>/oidc/tenants/<tenant>/jwks.json` |
| Namespace | `<url>/oidc/tenants/<tenant>/namespaces/<namespace>` | `<url>/oidc/tenants/<tenant>/namespaces/<namespace>/jwks.json` |

The discovery document is at the issuer URL followed by `/.well-known/openid-configuration`. A child namespace has no documents of its own, because its tokens carry the parent issuer's URL. A scope with no dedicated issuer returns 404, whether the tenant exists or not.

:::alert{type="warning"}
Dedicated issuer URLs are built from the instance `url`, which defaults to `kestra.url`. Changing it changes the URL of every dedicated issuer and breaks their registrations with cloud providers. Set the issuer's `url` when its URL must survive such a change.
:::

### Register a dedicated issuer

Register the dedicated issuer's URL wherever the examples above use `https://kestra.acme.com`.

On AWS, the provider ARN and the condition keys of the trust policy include the URL's path:

```bash
aws iam create-open-id-connect-provider \
  --url https://kestra.acme.com/oidc/tenants/prod \
  --client-id-list sts.amazonaws.com
```

```json
{
  "Effect": "Allow",
  "Principal": {
    "Federated": "arn:aws:iam::123456789012:oidc-provider/kestra.acme.com/oidc/tenants/prod"
  },
  "Action": "sts:AssumeRoleWithWebIdentity",
  "Condition": {
    "StringEquals": {
      "kestra.acme.com/oidc/tenants/prod:aud": "sts.amazonaws.com"
    },
    "StringLike": {
      "kestra.acme.com/oidc/tenants/prod:sub": "tenant:prod:namespace:finance:*"
    }
  }
}
```

AWS rejects tokens from other tenants before it evaluates any condition, because they carry another issuer URL and another signature. Keep the `sub` condition anyway: it limits the role to specific namespaces or flows within the tenant.

On Google Cloud, pass the dedicated issuer's URL to `--issuer-uri` when you create the pool's provider. If the issuer sets `allowed-audiences`, add the provider's resource name to it.

## Rotate signing keys

Kestra publishes every configured key, active or not, and signs only with the active one. Each issuer rotates its keys separately, and only the services registered on that issuer are affected. To rotate a key without breaking token verification:

1. Add the new key to the issuer's `keys` with `active: false`, and restart Kestra. Kestra now publishes the new public key alongside the old one.
2. Wait at least `cache-max-age`, so cloud providers pick up the new public key. Then set `active: true` on the new key and `active: false` on the old one, and restart Kestra.
3. Once every token signed with the old key has expired, after `token-ttl`, remove the old key and restart Kestra.

## Troubleshooting

| Error | Cause |
|---|---|
| `The 'oidcToken' function expects an 'audience' argument ...` | Pass `audience`, for example `oidcToken(audience='sts.amazonaws.com')`. |
| `The 'oidcToken' function is not available on this server type, or the OIDC issuer is not enabled.` | `enabled` isn't `true` on the server that renders the expression. |
| `The audience '<audience>' is not allowed by 'allowed-audiences' of the OIDC issuer for the <scope>.` | Add the audience to `allowed-audiences` of the issuer that covers the namespace. |
| `No OIDC issuer covers tenant '<tenant>' namespace '<namespace>' ...` | There are no instance keys and no dedicated issuer for this tenant or namespace. |
| `OIDC tokens are only minted for authenticated workers ...` | A remote worker requested a token without [worker authentication](../../04.scalability/worker-group/index.md#worker-authentication). Enable it on the controller and its workers. |
| `webIdentityToken is set but stsRoleArn is empty ...` | Set `stsRoleArn` to the role to assume with the token. |
| AWS returns `InvalidIdentityToken` | The token's `iss` differs from the registered provider URL. Check which issuer covers the execution: a namespace issuer takes precedence over the tenant issuer. |
| 404 on a dedicated issuer's discovery document | No issuer is configured for exactly that scope, for example because you requested a child namespace's URL. Register the parent namespace's issuer URL, or add an issuer for that scope. |
| 404 on `/.well-known/openid-configuration` | There are no instance keys. This is expected when you only declare dedicated issuers: register a dedicated issuer's URL instead. |
