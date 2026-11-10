---
title: "Kestra as an OIDC Issuer: Keyless AWS and GCP Access"
h1: Access AWS and Google Cloud Without Static Credentials
description: Configure Kestra Enterprise as an OIDC identity provider so executions exchange short-lived tokens for AWS and Google Cloud credentials instead of stored keys.
sidebarTitle: OIDC Issuer
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 2.1.0"
docId: oidc-issuer
---

Kestra Enterprise can act as an OpenID Connect (OIDC) identity provider, so your flows get temporary AWS and Google Cloud credentials without any access key or service account key stored in Kestra.

## How it works

A task calls the [`oidcToken()`](../../../expressions/04.functions/02.data-access/index.mdx#oidctoken) function, and Kestra signs a short-lived JSON Web Token (JWT) that identifies the running execution. The task's plugin sends that token to the cloud provider, which checks the signature against the public keys Kestra publishes and returns temporary credentials for a role or service account you have configured to trust Kestra. This is the same model GitHub Actions uses to reach AWS and Google Cloud.

The cloud provider trusts a token based on its subject, which Kestra builds from the execution and never from the flow's code:

```text
tenant:<tenant>:namespace:<namespace>:flow:<flow>
```

The segments go from broad to narrow, so a trust policy can match one flow, or every flow in a namespace with a wildcard such as `tenant:prod:namespace:team.data:*`.

## Prerequisites

- Kestra Enterprise reachable from the internet over HTTPS. AWS and Google Cloud download the discovery document and the public keys from Kestra's URL to verify each token, so the URL must have a certificate they trust.
- An RSA private key in PEM format (PKCS#8 or PKCS#1) for Kestra to sign tokens with. For example, generate a 2048-bit key with `openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out kestra-oidc.pem`.
- For remote workers, [worker authentication](../../04.scalability/worker-group/index.md#worker-authentication) enabled on the controller and the workers.

## Configure the issuer

<!-- VERIFY: on Kestra Cloud, who enables the issuer and what is the issuer URL (instance URL or a per-tenant dedicated issuer)? Cloud users can't edit the server configuration below. -->

Enable the issuer and give it a signing key in the Kestra configuration:

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
            private-key: |
              -----BEGIN PRIVATE KEY-----
              ...
              -----END PRIVATE KEY-----
```

Kestra checks the configuration at startup and doesn't start if there is no key, no active key or more than one, a duplicate `kid`, a malformed key, or a URL that isn't HTTPS. The issuer runs on the controller, webserver, and standalone servers only, so you don't need to give the private key to your workers. Workers request their tokens from the controller.

Once Kestra restarts, it serves two public documents that the cloud provider reads, with no authentication:

| Path | Content |
|---|---|
| `/.well-known/openid-configuration` | The discovery document: the issuer URL and the location of the public keys. |
| `/oidc/jwks.json` | The public keys (JWKS) of every configured key. |

Check that the issuer is up by opening `https://kestra.acme.com/.well-known/openid-configuration`. The `issuer` value is the URL that you register with the cloud provider.

The issuer accepts the following properties under `kestra.security.oidc.issuer`:

| Property | Default | Description |
|---|---|---|
| `enabled` | `false` | Turn on the issuer. |
| `url` | `kestra.url` | The issuer URL, used as the `iss` claim of every token. |
| `allow-insecure-url` | `false` | Allow an `http` URL. Use it for local testing only, since AWS and Google Cloud require HTTPS. |
| `token-ttl` | `PT5M` | Lifetime of a token. A token only has to last until the cloud provider exchanges it, so keep it short. Kestra logs a warning above 15 minutes. |
| `cache-max-age` | `PT10M` | How long the cloud provider may cache the discovery document and the public keys. |
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

## Dedicated issuers per tenant or namespace

With a single instance issuer, the cloud provider trusts tokens from every tenant and relies on the subject condition alone to keep them apart. A dedicated issuer gives a tenant, or a namespace and its children, its own issuer URL and keys, so a provider registered for one tenant can't verify a token from another.

```yaml
kestra:
  security:
    oidc:
      issuer:
        enabled: true
        issuers:
          - tenant: prod
            keys:
              - active: true
                private-key: |
                  -----BEGIN PRIVATE KEY-----
                  ...
          - tenant: prod
            namespace: finance
            token-ttl: PT3M
            allowed-audiences:
              - sts.amazonaws.com
            keys:
              - active: true
                private-key: |
                  -----BEGIN PRIVATE KEY-----
                  ...
```

Kestra signs each token with the closest issuer: the namespace's issuer, then the tenant's, then the instance issuer. A namespace issuer also covers its child namespaces, so the `finance` issuer above signs for `finance.payroll`. Each dedicated issuer can set its own `url`, `token-ttl`, and `allowed-audiences`, which replace the instance values, and needs its own keys.

Each dedicated issuer has its own URL and documents:

| Scope | Issuer URL | Public keys |
|---|---|---|
| Tenant | `<url>/oidc/tenants/<tenant>` | `<url>/oidc/tenants/<tenant>/jwks.json` |
| Namespace | `<url>/oidc/tenants/<tenant>/namespaces/<namespace>` | `<url>/oidc/tenants/<tenant>/namespaces/<namespace>/jwks.json` |

The discovery document is at the issuer URL followed by `/.well-known/openid-configuration`. Register that issuer URL with the cloud provider, for example `aws iam create-open-id-connect-provider --url https://kestra.acme.com/oidc/tenants/prod`. A child namespace has no documents of its own, and a scope with no dedicated issuer returns 404.

Instance `keys` are optional when you declare dedicated issuers. Without them, there is no instance issuer: `/.well-known/openid-configuration` returns 404, and `oidcToken()` fails in any namespace that no dedicated issuer covers.

## Rotate signing keys

Kestra publishes every configured key, active or not, and signs only with the active one. To rotate a key without breaking token verification:

1. Add the new key with `active: true`, set the old key's `active` to `false`, and restart Kestra.
2. Wait at least `cache-max-age`, so the cloud provider picks up the new public key and tokens signed with the old key have expired.
3. Remove the old key and restart Kestra.

## Troubleshooting

| Error | Cause |
|---|---|
| `The 'oidcToken' function expects an 'audience' argument ...` | Pass `audience`, for example `oidcToken(audience='sts.amazonaws.com')`. |
| `The 'oidcToken' function is not available on this server type, or the OIDC issuer is not enabled.` | `enabled` isn't `true` on the server that renders the expression. |
| `The audience '<audience>' is not allowed by 'allowed-audiences' of the OIDC issuer for the <scope>.` | Add the audience to `allowed-audiences` of the issuer that covers the namespace. |
| `No OIDC issuer covers tenant '<tenant>' namespace '<namespace>' ...` | There are no instance keys and no dedicated issuer for this tenant or namespace. |
| `OIDC tokens are only minted for authenticated workers ...` | A remote worker requested a token without [worker authentication](../../04.scalability/worker-group/index.md#worker-authentication). Enable it on the controller and its workers. |
| `webIdentityToken is set but stsRoleArn is empty ...` | Set `stsRoleArn` to the role to assume with the token. |
