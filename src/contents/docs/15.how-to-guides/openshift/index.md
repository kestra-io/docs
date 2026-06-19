---
title: Deploy to OpenShift with Kestra
h1: Deploy an Application to OpenShift from a Kestra Flow
icon: /src/contents/docs/icons/tutorial.svg
stage: Intermediate
topics:
  - DevOps
editions: ["OSS", "EE"]
description: Use the Kubernetes plugin's kubectl.Apply task to deploy a containerized application to a Red Hat OpenShift cluster, exposing it externally via a TLS-terminated Route.
---

The [`kubectl.Apply`](/plugins/plugin-kubernetes/kubectl/io.kestra.plugin.kubernetes.kubectl.apply) task in the Kubernetes plugin supports OpenShift's OAuth token authentication and OpenShift-specific resource types, so you can deploy to OpenShift the same way you would any standard cluster.

## Prerequisites

- A running OpenShift cluster
- The `oc` CLI installed and authenticated (`oc login`)
- The [Kubernetes plugin](/plugins/plugin-kubernetes) version 1.9.4 or later installed in your Kestra instance:

```bash
kestra plugins install io.kestra.plugin:plugin-kubernetes:1.9.4
```
- Two Kestra secrets:

| Secret | How to obtain |
|---|---|
| `OPENSHIFT_API_URL` | `oc whoami --show-server` — format: `https://api.<cluster-domain>:6443` |
| `OPENSHIFT_TOKEN` | `oc whoami -t` after `oc login`, or a long-lived token from a `ServiceAccount` secret for CI use |

## The flow

The flow below applies three resources to OpenShift in a single `kubectl.Apply` task using multi-document YAML (`---` separators): a `Deployment`, a `Service`, and a `Route`.

The image reference is a flow input, so the same flow can deploy any image without editing the manifest.

```yaml
id: openshift_deploy_python_app
namespace: company.devops

inputs:
  - id: image
    type: STRING
    description: "Full image reference to deploy, e.g. my-registry.example.com/company/python-app:1.0.0"

tasks:
  - id: deploy_to_openshift
    type: io.kestra.plugin.kubernetes.kubectl.Apply
    connection:
      masterUrl: "{{ secret('OPENSHIFT_API_URL') }}"
      oauthToken: "{{ secret('OPENSHIFT_TOKEN') }}"
    namespace: my-project
    spec: |-
      apiVersion: apps/v1
      kind: Deployment
      metadata:
        name: python-app
        labels:
          app: python-app
      spec:
        selector:
          matchLabels:
            app: python-app
        strategy:
          type: RollingUpdate
          rollingUpdate:
            maxSurge: 1
            maxUnavailable: 0
        template:
          metadata:
            labels:
              app: python-app
          spec:
            containers:
              - name: python-app
                image: "{{ inputs.image }}"
                imagePullPolicy: Always
                ports:
                  - name: http
                    containerPort: 8080
                    protocol: TCP
                resources:
                  requests:
                    cpu: "100m"
                    memory: "128Mi"
                  limits:
                    cpu: "500m"
                    memory: "256Mi"
                readinessProbe:
                  httpGet:
                    path: /health
                    port: http
                  initialDelaySeconds: 10
                  periodSeconds: 5
                livenessProbe:
                  httpGet:
                    path: /health
                    port: http
                  initialDelaySeconds: 30
                  periodSeconds: 10
      ---
      apiVersion: v1
      kind: Service
      metadata:
        name: python-app-service
        labels:
          app: python-app
      spec:
        selector:
          app: python-app
        ports:
          - name: http
            port: 8080
            targetPort: http
        type: ClusterIP
      ---
      apiVersion: route.openshift.io/v1
      kind: Route
      metadata:
        name: python-app-route
        labels:
          app: python-app
      spec:
        to:
          kind: Service
          name: python-app-service
          weight: 100
        port:
          targetPort: http
        tls:
          termination: edge
          insecureEdgeTerminationPolicy: Redirect
```

## What to adapt before use

- Replace the `image` input default with the full registry path for your image.
- Set `namespace: my-project` to the target OpenShift project name.
- Adjust the readiness and liveness probe `path` if your application does not expose a `/health` endpoint on port 8080.
- Adjust resource requests and limits to match your workload.

## Design notes

### Route instead of Ingress

OpenShift uses `route.openshift.io/v1 Route` for external access rather than a standard Kubernetes `Ingress`. The Route references the `Service` by name and port. Using the named port `http` consistently across the `Deployment`, `Service`, and `Route` means the port number only needs to change in one place.

### TLS edge termination

`termination: edge` terminates TLS at the OpenShift router, so traffic inside the cluster is plain HTTP. `insecureEdgeTerminationPolicy: Redirect` ensures plain HTTP requests to the Route are redirected to HTTPS — without it, edge-terminated Routes accept both.

### `imagePullPolicy: Always`

When the image tag is dynamic (a git SHA or build number passed from an upstream task), `IfNotPresent` can silently run a stale cached layer if the tag has been reused. `Always` ensures the declared image is what actually runs.

### `spec.replicas` and the Developer Sandbox

The OpenShift Developer Sandbox runs a `member-operator` that takes server-side apply ownership of `spec.replicas` on all Deployments for quota enforcement. Declaring `replicas` in your manifest causes a 409 field manager conflict. Omit it entirely — the Sandbox defaults to 1 replica.

On a production OpenShift cluster without `member-operator`, you can safely declare `replicas`.

### ImageStream

This example pulls the image directly from the registry rather than through an OpenShift `ImageStream`. If you need OpenShift-native image tracking and promotion, create an `ImageStream` with `spec.tags` importing the external image, set `lookupPolicy.local: true`, and reference the short name in the `Deployment` instead of the full registry path.
