---
title: Deploy on AWS EKS with RDS and S3 in Kestra
h1: AWS EKS Setup with RDS PostgreSQL and S3
sidebarTitle: Kubernetes on AWS EKS with Amazon RDS and S3
icon: /src/contents/docs/icons/aws-eks.svg
description: Deploy Kestra on Amazon EKS with RDS PostgreSQL and S3 for a scalable, cloud-native orchestration platform.
---

Deploy Kestra to AWS EKS with a PostgreSQL RDS database and an S3 internal storage backend.

## Prerequisites

- Basic command-line interface (CLI) skills.
- Familiarity with AWS EKS, RDS, S3, and Kubernetes.

## Launch an EKS Cluster

First, install [eksctl](https://eksctl.io/) and [kubectl](https://kubernetes.io/docs/tasks/tools/). After installing both, you can create the EKS cluster. There are plenty of configuration options available with `eksctl`, but the default settings are sufficient for this guide. Run the following command to create a cluster named `my-kestra-cluster`:

```shell
eksctl create cluster --name my-kestra-cluster --region us-east-1
```

Wait for the cluster to be created. Once it is confirmed that the cluster is up and that your kubecontext points to the cluster, run the following command:

```shell
kubectl get svc
```

## Launch AWS RDS for PostgreSQL
Navigate to the RDS console to create a PostgreSQL database. Once your database is created, configure the settings, ensuring the database is accessible from your EKS cluster. Make note of the database endpoint and port after creation for later use.

## Prepare an AWS S3 Bucket
Create a private S3 bucket (i.e., with public access blocked). Keep a record of the bucket name as this is needed for the [Kestra runtime and storage configuration](../../configuration/02.runtime-and-storage/index.md).


## Install Kestra on AWS EKS
Add the Kestra Helm chart repository and install Kestra:

```bash file=src/contents/docs/_snippets/install/helm-install-kestra.sh
```

In the deployment configuration, integrate RDS and S3 as the database and storage backends, respectively. Set the database connection under `datasources` and S3 details under `storage` in your Helm values.

Here is how you can configure RDS in the [Helm chart's values](https://github.com/kestra-io/kestra/blob/develop/charts/kestra/values.yaml):

```yaml
configurations:
  application:
    kestra:
      queue:
        type: postgres
      repository:
        type: postgres
    datasources:
      postgres:
        url: jdbc:postgresql://<your-rds-url-endpoint>:5432/kestra
        driver-class-name: org.postgresql.Driver
        username: <your_username>
        password: <your_password>
```

Add the S3 configuration in the [Helm chart's values](https://github.com/kestra-io/kestra/blob/develop/charts/kestra/values.yaml) like in the following example:

```yaml
configurations:
  application:
    kestra:
      storage:
        type: s3
        s3:
          access-key: "<your-aws-access-key-id>"
          secret-key: "<your-aws-secret-access-key>"
          region: "<your-aws-region>"
          bucket: "<your-s3-bucket-name>"
```

To apply these configurations, use the following command:

```bash
helm upgrade my-kestra kestra/kestra -f values.yaml
```

## Access Kestra UI
To access the Kestra UI, implement an ingress controller. You can install the AWS Load Balancer (ALB) Controller via Helm:

```shell
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
-n kube-system \
--set clusterName=my-kestra-cluster \
--set serviceAccount.create=false \
--set serviceAccount.name=aws-load-balancer-controller
```

Once the ALB is configured and deployed, access the Kestra UI using the ALB endpoint.

## Next steps

::snippet{name="install/deployment-support"}
