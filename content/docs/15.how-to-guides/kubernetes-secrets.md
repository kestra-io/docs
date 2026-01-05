---
title: Set Up Secrets from a Helm Chart
icon: /docs/icons/helm.svg
stage: Getting Started
topics:
  - Kestra Concepts
  - DevOps
editions: ["OSS"]
---

How to add Kestra Secrets to your Helm Chart deployment.

:::alert{type="info"}
Note that this page is only relevant for the Open-Source edition of Kestra. For the Enterprise Edition, you can use the built-in [Secrets](../07.enterprise/02.governance/secrets.md) functionality allowing you to securely store your secrets in an [external secret manager](../07.enterprise/02.governance/secrets-manager.md) of your choice.
:::

## Pass environment variables directly

The simplest way to pass secrets to Kestra is to use environment variables referenced using the `common.extraEnv` property. Make sure that each environment variable's key starts with `SECRET_`.

Let's assume you want to add two secrets to your Helm Chart:
1. `DB_USERNAME` with the value `admin`
2. `DB_PASSWORD` with the value `password`

You can set them directly in your Helm Chart `values.yaml` as follows:

```yaml
deployments:
  standalone:
    enabled: true
common:
  extraEnv:
    - name: SECRET_DB_USERNAME
      value: "admin"
    - name: SECRET_DB_PASSWORD
      value: "password"
```

:::alert{type="info"}
Note how each environment variable's key starts with `SECRET_`. This is important for Kestra to recognize them as secrets.
:::

Now, install or upgrade your Helm Chart:

```shell
helm repo add kestra https://helm.kestra.io/
helm install kestra kestra/kestra -f values.yaml
# or if you already have Kestra installed:
helm upgrade kestra kestra/kestra -f values.yaml

export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=kestra,app.kubernetes.io/instance=kestra,app.kubernetes.io/component=standalone" -o jsonpath="{.items[0].metadata.name}")
kubectl port-forward $POD_NAME 8080:8080
```

To test that the secrets have been correctly set, go to the UI e.g. http://localhost:8080 and create a new flow:

```yaml
id: secret_test
namespace: company.team
tasks:
  - id: hello
    type: io.kestra.plugin.core.output.OutputValues
    values:
      username: "{{ secret('DB_USERNAME') }}"
      password: "{{ secret('DB_PASSWORD') }}"
```

Execute the flow and check the output values in the Outputs tab in the UI. You should see the values `admin` and `password`.

---

## Pass environment variables from a Kubernetes Secret

If you want to define your secrets in a Kubernetes Secret, you can use the `common.extraEnvFrom` property in your Helm Chart. This property allows you to reference an existing Kubernetes Secret and pass its values as environment variables to Kestra.

Here is an example of a Kubernetes Secret definition:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-creds
type: Opaque
stringData:
  SECRET_DB_USERNAME: admin
  SECRET_DB_PASSWORD: password
```

First, create the Secret in your Kubernetes cluster:

```shell
kubectl apply -f secret.yaml
```

Then, reference this secret in your Helm Chart `values.yaml`:

```yaml
deployments:
  standalone:
    enabled: true
common:
  extraEnvFrom:
    - secretRef:
        name: db-creds
```

Redeploy your Helm Chart:

```shell
helm upgrade kestra kestra/kestra -f values.yaml
```

And test the secrets in a flow as described in the previous section.

Note that in this method, the Kubernetes Secret's keys must start with `SECRET_` to be recognized as Kestra Secrets.

---

## Use Kubernetes Secrets as Kestra Secrets with `configurations.secrets`

An alternative is to mount an entire Kubernetes Secret as a [Kestra configuration](../configuration/index.md) file using the `configurations.secrets` property.

For example, in `values.yaml`:

```yaml
configurations:
  secrets:
    - name: db-creds
      key: db.yml
```

And in your Helm chart, define the secret in `extraManifests`:

```yaml
extraManifests:
  - apiVersion: v1
    kind: Secret
    metadata:
      name: db-creds
    stringData:
      db.yml: |
        kestra:
          datasources:
            postgres:
              url: jdbc:postgresql://postgres:5432/kestra
              username: admin
              password: password
```

This method avoids the need for encoding and allows you to configure secrets in YAML format directly.

---

## Summary

- Use `common.extraEnv` for simple inline secrets.
- Use `common.extraEnvFrom` to load secrets from existing Kubernetes Secret objects.
- Use `configurations.secrets` when you want to mount YAML-based secrets as part of Kestra's configuration.

Choose the method that best fits your security and deployment requirements.
