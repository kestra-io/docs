---
title: Managing Upgrades
---

Kestra is a fast-evolving project, and we are continuously improving it. This section will guide you through the process of upgrading your Kestra installation.

## Where you can find the release changelog

You can find the release changelog on the main repository's [Releases](https://github.com/kestra-io/kestra/releases) page. The changelog includes a full list of changes, new features, and bug fixes for each release, as well as any breaking changes that may require your attention. For a high-level eplanation of the changes, you can also check release [blog posts](https://kestra.io/blogs).

## How to identify breaking changes in a release

Next to all bug fixes and enhancements, you can find a dedicated section called `Breaking Changes` in the release notes. This section lists changes that may require some adjustments in your code or Kestra configuration, along with links to the documentation showing how to migrate.

::alert{type="warning"}
⚠️ Note that `Breaking Changes` are **always** included as the last section of the [release notes](https://github.com/kestra-io/kestra/releases). Make sure to inspect that part of the release notes before upgrading to a new version.
::

## How to stick to a specific Kestra version

If you want to stick to a specific Kestra version, you can pin the [Docker image tag](https://hub.docker.com/r/kestra/kestra/tags) to a specific release. Here are some examples:

- `kestra/kestra:v0.14.4` includes the 0.14.4 release with the fourth patch version
- `kestra/kestra:v0.14.4-full` includes the 0.14.4 release with all plugins
- `kestra/kestra:v0.15.0` includes the 0.15 release without any plugins
- `kestra/kestra:v0.15.0-full` includes the 0.15 release with all plugins.

Note that you can always create a custom image with your own plugins and package dependencies, as explained in the [Docker installation](../02.installation/02.docker.md).

## How to migrate to a specific Kestra version

### Standalone Installation
If you use a manual standalone installation with Java, you can download the Kestra binary for a specific version from the Assets menu of a specific [Release](https://github.com/kestra-io/kestra/releases) page. The image below shows how you can download the binary for the 0.14.1 release.

![download_kestra_binary](/docs/administrator-guide/download_kestra_binary.png)

Once you downloaded the binary, you can start kestra from that binary using the following command:

```bash
./kestra-VERSION server standalone
```

### Installation with Docker

If you use Docker, you can change the [Docker image tag](https://hub.docker.com/r/kestra/kestra/tags) to the desired version and restart the container(s) or Kubernetes pod(s).


### Docker Compose

If you use Docker compose, adjust your Docker Compose file to use the desired [Docker image tag](https://hub.docker.com/r/kestra/kestra/tags) and run `docker-compose up -d` to restart the container(s).

### Helm Chart

If you use Helm, adjust the [Helm chart `tag` value](https://github.com/kestra-io/helm-charts/blob/master/charts/kestra/values.yaml#L4) to point the installation to the desired version. For example, you can run the following command to upgrade the installation to the desired version:

```bash
helm upgrade kestra kestra/kestra --set image.tag=v0.15.0-full
```

For more complex configurations that include multiple changes, consider using a custom values file:
1. First, create a `values.yaml` file that contains the settings you want to adjust.
2. Then, use the `helm upgrade` command with the `-f` flag to specify your custom values file:

```sh
helm upgrade kestra kestra/kestra -f values.yaml
```

## Where can I find migration guides

The [Migrations section](https://kestra.io/docs) includes detailed information about deprecated features and provides guidance on how to migrate from the deprecated to a new behavior.

For all breaking changes, the migration guides are linked in the [release notes](https://github.com/kestra-io/kestra/releases).

## How to stay informed about new releases

You can get notified about new releases in the following ways:
1. Subscribe to notifications in the `#announcements` channel in the [Slack](https://kestra.io/slack) community.
2. Follow us on [Twitter](https://twitter.com/kestra_io)
3. Follow us on [LinkedIn](https://www.linkedin.com/company/kestra/)
4. Subscribe to the [Kestra newsletter](https://kestra.io/blog)
5. Subscribe to Release notifications on the [main GitHub repository](https://github.com/kestra-io/kestra), as shown in the image below:

![release_notification_github](/docs/administrator-guide/release_notifications_github.png)

## Getting help

If you have any questions about the upgrade process:
- if you are a [Kestra Enterprise](https://kestra.io/enterprise) customer, please submit a [Support Ticket](https://support.kestra.io/)
- reach out to us [via Slack](https://kestra.io/slack).

We understand that upgrades can be difficult. If you need more help, [reach out to us](https://kestra.io/contact-us) and we'll help you with the migration based on your specific environment and use case.
