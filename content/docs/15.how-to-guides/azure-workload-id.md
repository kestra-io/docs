---
title: Use Azure Managed Workload on Kestra
icon: /docs/icons/azure-aks.svg
stage: Advanced
topics:
  - Kestra Concepts
  - DevOps
  - Integrations
editions: ["EE", "Cloud"]
---

How to use Azure Workload identity to provide access to resources such as Azure Key Vault in Kestra

::alert{type="info"}
Note that this page is only relevant for the Enterprise Edition of Kestra. Should you require features such as integrations with Cloud-based secret managers, please contact us on sales@kestra.io or chat with us in our Slack community.
::

## Pre-Requisites

To follow this guide you will need the following

1. [Kestra Enterprise Edition](https://kestra.io/docs/enterprise)
2. Account with Azure
3. [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/) installed
4. Kubernetes tools (kubectl & helm)
5. Permissions to provision the following:
  - [AKS Cluster](https://azure.microsoft.com/en-us/products/kubernetes-service/)
  - [Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/)
  - [User-assigned managed identity](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview)

This guide is based on the official Azure documentation on Workload Identity — it's best to read [this Azure guide](https://learn.microsoft.com/en-us/azure/aks/workload-identity-deploy-cluster) first for full context. Here, we'll focus on enabling this feature in Kestra.

## Variables

Define the following variables and update them to match your environment.

```shell
# Managed User Identity Name
ID_NAME="kestra-managed-user"
# Azure Resource Group
RESOURCE_GROUP="demo"
# Physical location you wish to provision resources
LOCATION="eastus"
# The name of your Azure Kubernetes Cluster
AKS_NAME="demo-cluster"
# The name of your Azure Key Vault
KEYVAULT_NAME="my-demo-vault"
# The name you wish to provide to the Kubernetes Service Account linked to the managed identity
SERVICE_ACCOUNT_NAME="kestra-sa"
# The namespace to deploy the service account. Use the same location as your Kestra deployment
SERVICE_ACCOUNT_NAMESPACE="default"
# The Federated ID credential for linking the OIDC issuer to the service account
FEDERATED_IDENTITY_CREDENTIAL_NAME="kestra-fed-cred"
```

## Create the resources

First, create the following main resources:
1. The Key Vault
2. The Managed Identity
3. The AKS cluster.

Once these have been provisioned, there are several identifiers we must capture for later use.

### Azure Key Vault

This creates an Azure Key Vault. By default this will be created with RBAC (role-based access control) enabled which is the recommended configuration.

```shell
az keyvault create \
  --name $KEYVAULT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION
```

### Managed Identity

This creates the user-assigned managed identity we will use to provision access to resources within the Kubernetes cluster.

```shell
az identity create --name $ID_NAME \
 --resource-group $RESOURCE_GROUP
```

### AKS Cluster

```shell
az aks create \
  --resource-group $RESOURCE_GROUP \
  --name $AKS_NAME \
  --enable-oidc-issuer \
  --enable-workload-identity \
  --node-count 1 \
  --generate-ssh-keys
```

### Setting identifiers from new resources

Once all the above have been created, capture the following information in variables for use later on:

```shell
OBJECT_ID=$(az identity show --name $ID_NAME --resource-group $RESOURCE_GROUP --query 'principalId' --output tsv)
MANAGED_CLIENT_ID=$(az identity show --name $ID_NAME --resource-group $RESOURCE_GROUP --query clientId --output tsv)
AKS_OIDC_ISSUER="$(az aks show --name "${AKS_NAME}" --resource-group "${RESOURCE_GROUP}" --query "oidcIssuerProfile.issuerUrl" --output tsv)"
```

## Link Identity Resources

One of the more challenging aspects of this setup is correctly linking together the various resources. This section covers how to tie the managed identities to the resources to allow access by the Kestra application.

### Create role assignment for created user

This is one of the most critical steps as it sets the permission the resource has on the Key Vault. As Kestra needs to read and write secrets to the vault, the "Key Vault Secrets Officer" provides least priviledged access for this operation. Further details on this role can be found [in Azure's RBAC guide](https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide?tabs=azure-cli#azure-built-in-roles-for-key-vault-data-plane-operations).

```shell
az role assignment create \
  --assignee-object-id $OBJECT_ID \
  --role "Key Vault Secrets Officer" \
  --scope $(az keyvault show --name $KEYVAULT_NAME --query id -o tsv)
```


### Create the service account in the AKS Cluster

First, we must switch context to the newly created AKS cluster:

```shell
az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_NAME
```

Next, create a service account in the same namespace where you deploy Kestra.

```shell
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    azure.workload.identity/client-id: "${MANAGED_CLIENT_ID}"
  name: "${SERVICE_ACCOUNT_NAME}"
  namespace: "${SERVICE_ACCOUNT_NAMESPACE}"
EOF
```

Finally, we need to link this service account to the OIDC issuer associated with our managed identity. We do this by creating federated credentials:

```shell
az identity federated-credential create \
  --name ${FEDERATED_IDENTITY_CREDENTIAL_NAME} \
  --identity-name "${ID_NAME}" \
  --resource-group "${RESOURCE_GROUP}" \
  --issuer "${AKS_OIDC_ISSUER}" \
  --subject system:serviceaccount:"${SERVICE_ACCOUNT_NAMESPACE}":"${SERVICE_ACCOUNT_NAME}" \
  --audience api://AzureADTokenExchange
```

## Deploying Kestra

Before we deploy Kestra, we need to modify the `values.yaml` of the helm chart using some of the information above.

### Configure Secrets Manager

```yaml
configuration:
  kestra:
    secret:
      type: azure-key-vault
      azureKeyVault:
        vaultName: ${KEYVAULT_NAME}
        workloadIdentityClientId: ${MANAGED_CLIENT_ID}
```

### Service Account

Make sure to add the service account name to the `values.yaml` file. Since a value is already present, overwrite it with your value defined above.

```yaml
### Global Deployement
nameOverride: ""
serviceAccountName: ${SERVICE_ACCOUNT_NAME}
```

## Deployment

Assuming other properties are populated to your desired values within the `values.yaml` file, deploy Kestra with the `helm install` command:

```shell
helm install -f values.yaml kestra kestra/kestra
```

## Known Issues

On earlier versions of the Kestra helm chart (<=0.19), it was not possible to define custom labels for individual pods. To use managed workload identity, the following label must be defined on the webserver, scheduler, and worker pods:

```yaml
azure.workload.identity/use: "true"
```

Should you be unable to upgrade at this time, here is a workaround:
- Download the `latest` Kestra helm chart from https://helm.kestra.io
- Navigate to file `templates/_helpers.tpl`
- In the section `kestra.selectorsLabels`, add the required label to the list, e.g.:

```
{{- define "kestra.selectorsLabels" -}}
app.kubernetes.io/name: {{ include "kestra.name" . }}
app.kubernetes.io/component: {{ .Component }}
app.kubernetes.io/instance: {{ .Release.Name }}
azure.workload.identity/use: "true"
{{- end -}}
```

Assuming the above chart is stored locally in `~/helm/kestra`, deploy Kestra using the following command:

```shell
helm install -f values.yaml kestra ~/helm/kestra
```

## Next steps

Following the steps above, you can leverage Azure Workload Identity in your Kestra Enterprise Edition instance. If you have any issues replicating this setup, don't hesitate to reach out [via Slack](https://kestra.io/slack) or open a support ticket.
