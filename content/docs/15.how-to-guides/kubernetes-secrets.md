---
title: Secrets from a Helm Chart
icon: /docs/icons/helm.svg
editions: ["OSS"]
---

This page describes how you can add Kestra Secrets to your Helm Chart deployment.

::alert{type="info"}
Note that this page is only relevant for the Open-Source edition of Kestra. For the Enterprise Edition, you can use the built-in [Secrets](../06.enterprise/secrets.md) functionality allowing you to securely store your secrets in an [external secret manager](../06.enterprise/secrets-manager.md) of your choice.
::

## Pass environment variables directly

The simplest way to pass secrets to Kestra is to use environment variables referenced using the `extraEnv` property. Make sure that each environment variable's key starts with `SECRET_` and that the value of the secret is base64 encoded.

Let's assume you want to add two secrets to your Helm Chart:
1. `DB_USERNAME` with the value `admin`
2. `DB_PASSWORD` with the value `password`

First, let's encode the values:

```shell
echo -n "admin" | base64 # it should give you YWRtaW4=
echo -n "password" | base64 # it should give you cGFzc3dvcmQ=
```

You can set them directly in your Helm Chart `values.yaml` as follows:

```yaml
deployment:
  standalone:
    enabled: true
extraEnv:
  - name: SECRET_DB_USERNAME
    value: "YWRtaW4="
  - name: SECRET_DB_PASSWORD
    value: "cGFzc3dvcmQ="
```

::alert{type="info"}
Note how each environment variable's key starts with `SECRET_`. This is important for Kestra to recognize them as secrets.
::

Now, all that's left is to install or upgrade your Helm Chart:

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

If you want to define your secrets in a Kubernetes Secret, you can use the `extraSecretEnvFrom` property in your Helm Chart. This property allows you to reference an existing Kubernetes Secret and pass its values as environment variables to Kestra.

::alert{type="info"}
Since Kubernetes Secrets values need to be base64 encoded, you need to double encode them. Taking the same example as above, you would need to encode the values `admin` and `password` twice.

```shell
echo -n "admin" | base64 | base64 # it should give you WVdSdGFXNEsK
echo -n "password" | base64 | base64 # it should give you YzBGemMzZHZjbVFLCg==
```
::

Here is an example of a Kubernetes Secret definition:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-creds
type: Opaque
data: # base64 encoded twice
  SECRET_DB_USERNAME: WVdSdGFXNEsK
  SECRET_DB_PASSWORD: Y0dGemMzZHZjbVFLCg==
```

First, make sure to create the Secret in your Kubernetes cluster:

```shell
kubectl apply -f secret.yaml
```

Then, you can reference this secret in your Helm Chart `values.yaml` as follows:

```yaml
deployment:
  standalone:
    enabled: true
extraSecretEnvFrom:
  - name: db-creds
```

Redeploy your Helm Chart:

```shell
helm upgrade kestra kestra/kestra -f values.yaml
```

And test the secrets in a flow as described in the previous section.

Note that in this method, the Kubernetes Secret's keys must start with `SECRET_` to be recognized as Kestra Secrets and they need to be base64 encoded twice due to the additional encoding used by Kubernetes Secrets.

## Use Kubernetes Secrets as Kestra Secrets

An alternative to the `extraSecretEnvFrom` property is to create an environment variables referencing the Kubernetes Secret values. The benefit of this method is that you can use arbitrary keys in your Kubernetes Secret without the need to prefix them with `SECRET_`.

Kubernetes Secret definition (again, keep in mind that the Secret values still need to be base64 encoded twice to account for the additional encoding used by Kubernetes Secrets on top of the base64 encoding required by Kestra):

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-creds
type: Opaque
data: # base64 encoded twice
  username: WVdSdGFXNEsK
  password: Y0dGemMzZHZjbVFLCg==
```

Then, you can reference this secret in your Helm Chart `values.yaml` as follows:

```yaml
deployment:
  standalone:
    enabled: true
extraEnv:
  - name: SECRET_DB_USERNAME
    valueFrom:
      secretKeyRef:
        name: db-creds
        key: username
  - name: SECRET_DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: db-creds
        key: password
```

The benefit of this approach is that you can define the Kestra-specific secret names in your Kestra's Helm Chart deployment rather than in the Kubernetes Secret itself.
