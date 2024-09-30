---
title: Managing Upgrades
icon: /docs/icons/admin.svg
---

Kestra is a fast-evolving project. This section will guide you through the process of upgrading your Kestra installation.

## Where you can find the release changelog

You can find the release changelog on the main repository's [Releases](https://github.com/kestra-io/kestra/releases) page. The changelog includes a full list of changes, new features, and bug fixes for each release, as well as any breaking changes that may require your attention. For a high-level eplanation of the changes, you can also check release [blog posts](/blogs).

## How to identify breaking changes in a release

Next to all bug fixes and enhancements, you can find a dedicated section called `Breaking Changes` in the release notes. This section lists changes that may require some adjustments in your code or Kestra configuration, along with links to the documentation showing how to migrate.

::alert{type="warning"}
⚠️ Note that `Breaking Changes` are **always** included as the last section of the [release notes](https://github.com/kestra-io/kestra/releases). Make sure to inspect that part of the release notes before upgrading to a new version.
::

## How to minimise downtime when updating Kestra

If running Kestra in separate components you should:
- Stop the executors and the scheduler
- Stop the workers - there is a graceful shutdown (which can be configured but I'm not sure we already document how to configure this) and automatic task resubmission.
- Stop the webserver (and the indexer using EE and Kafka)

Normally, there is a graceful shutdown on all components so you will not lose anything. Once this is done, you can update and restart everything in the opposite order (or any order as all components are independent).

::alert{type="info"}
The webserver host the API so it's the one that must be stopped then started immediately to avoid potential downtime. Once this has been done, you can restart the other components so flow executions can start again.
::

## How to stick to a specific Kestra version

If you want to stick to a specific Kestra version, you can pin the [Docker image tag](https://hub.docker.com/r/kestra/kestra/tags) to a specific release. Here are some examples:

- `kestra/kestra:v0.14.4` includes the 0.14.4 release with the fourth patch version
- `kestra/kestra:v0.14.4-full` includes the 0.14.4 release with all plugins
- `kestra/kestra:v0.15.0` includes the 0.15 release without any plugins
- `kestra/kestra:v0.15.0-full` includes the 0.15 release with all plugins.

Note that you can always create a custom image with your own plugins and package dependencies, as explained in the [Docker installation](../02.installation/02.docker.md).

## Migrating a Standalone Installation
If you use a manual standalone installation with Java, you can download the Kestra binary for a specific version from the Assets menu of a specific [Release](https://github.com/kestra-io/kestra/releases) page. The image below shows how you can download the binary for the 0.14.1 release.

![download_kestra_binary](/docs/administrator-guide/download_kestra_binary.png)

Once you downloaded the binary, you can start kestra from that binary using the following command:

```bash
./kestra-VERSION server standalone
```

## Migrating an installation with Docker

If you use Docker, you can change the [Docker image tag](https://hub.docker.com/r/kestra/kestra/tags) to the desired version and restart the container(s) or Kubernetes pod(s).


### Docker Compose

If you use Docker compose, adjust your Docker Compose file to use the desired [Docker image tag](https://hub.docker.com/r/kestra/kestra/tags) and run `docker-compose up -d` to restart the container(s).

## Migration in Kubernetes using Helm

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

## Rolling upgrades in Kubernetes

Upgrading Kestra on a Kubernetes cluster depends on a deployment rollout strategy.

Every service can be rolled out without any downtime except for a worker that needs a special attention.

Each standard component during the rollout will create a pod with a new version (_keeping the old one running_). When the new pod is up and running (passing all health checks), Kubernetes will shutdown the previous one leading to a zero-downtime migration.

Upgrading workers is more involved since workers handle data processing tasks which can range from a few seconds to many hours. You need to define the behavior for these tasks.

By default, Kestra worker process will wait until the completion of all task runs before shutting down during a migration. However, you can overwrite that default behavior if you wish. Kestra [Helm charts](https://github.com/kestra-io/helm-charts/blob/1f9a97331ff0c160a32ceba3f255a58e01f5ff95/charts/kestra/values.yaml#L80) provide a configuration of a `terminationGracePeriodSeconds` (set to 60 seconds by default) that allows you to define the amount of time you want to wait before force-killing the worker.

If the worker has no workers or is able to terminate all tasks before the grace period, it will be shutdown directly. If the pod is not able to finish the tasks affected before `terminationGracePeriodSeconds`, Kubernetes will kill the pod, leading to some tasks being resubmitted and handled by another worker.

In Kestra, every worker that died unexpectedly will be detected by the executor, and all unfinished task runs will be resubmitted and will be picked up by a new worker. In case of rollout with `terminationGracePeriodSeconds`, we are in the case of unexpected failure and the task will also be resubmitted.


## Where can I find migration guides

The [Migrations section](../11.migration-guide/index.md) includes detailed information about deprecated features and provides guidance on how to migrate from the deprecated to a new behavior.

For all breaking changes, the migration guides are linked in the [release notes](https://github.com/kestra-io/kestra/releases).

## How to stay informed about new releases

You can get notified about new releases in the following ways:
1. Subscribe to notifications in the `#announcements` channel in the [Slack](/slack) community.
2. Follow us on [Twitter](https://twitter.com/kestra_io)
3. Follow us on [LinkedIn](https://www.linkedin.com/company/kestra/)
4. Subscribe to the [Kestra newsletter](/blogs)
5. Subscribe to Release notifications on the [main GitHub repository](https://github.com/kestra-io/kestra), as shown in the image below:

![release_notification_github](/docs/administrator-guide/release_notifications_github.png)


## Database Migrations

There are two types of database migrations: automatic and manual.

### Automatic database migration

Kestra uses [Flyway](https://flywaydb.org/) to automatically perform database migrations when Kestra server is started. Flyway is a tool that allows version controlling changes to a database (such as Kestra's database) so that you can migrate it to a new version easily. Kestra stores the current version of the database in a table called `flyway_schema_history`. When Flyway runs, it compares the current version of the database with the version that it should be at. If the versions do not match, Flyway will run the necessary migrations to bring the database up to date. This process is automatic when Kestra server starts, therefore no manual intervention is required.

### Manual database migration

Sometimes a manual database migration is useful, especially when you have a large database and you want to perform the migration before upgrading Kestra to avoid a long downtime.

For example, when migrating from Kestra v0.12.0 to v0.13.0, all indexes will be rebuilt due to addition of the multi-tenancy feature (the `tenant_id` column is added on almost every table). When using the JDBC runner with a large database, database migration can take multiple hours. In such use cases, we recommend performing the migration manually before starting Kestra by using the `kestra sys database migrate` command.

This command should use the same configuration as configured on your Kestra instance. Depending on whether you deploy Kestra using Docker or Kubernetes, this command can be launched via a `docker exec` or a `kubectl exec` command.

There are two ways to initiate the manual database migration:
1. Keep Kestra running in an old version. Then, stop Kestra and launch the command on the new version.
2. Start Kestra on the new version with automatic schema migration disabled via `flyway.datasources.postgres.enabled=false` (in case you're database is not postgres replace postgres with the type of your database) and launch the command: `kestra sys database migrate`.


Here is an example of how to launch the command via a `docker exec` command:

```bash
docker exec your_container_id bash ./kestra sys database migrate --help
```

Here is the output of that `--help` command:

```bash
Usage: kestra sys database migrate [-hVv] [--internal-log] [-c=<config>]
                                   [-l=<logLevel>] [-p=<pluginsPath>]
Force database schema migration.
Kestra uses Flyway to manage database schema evolution, this command will run
Flyway then exit.
  -c, --config=<config>   Path to a configuration file, default: /root/.
                            kestra/config.yml)
  -h, --help              Show this help message and exit.
      --internal-log      Change also log level for internal log, default:
                            false)
  -l, --log-level=<logLevel>
                          Change log level (values: TRACE, DEBUG, INFO, WARN,
                            ERROR; default: INFO)
  -p, --plugins=<pluginsPath>
                          Path to plugins directory , default: ./plugins)
  -v, --verbose           Change log level. Multiple -v options increase the
                            verbosity.
  -V, --version           Print version information and exit.
```


## Getting help

If you have any questions about the upgrade process:
- if you are a [Kestra Enterprise](/enterprise) customer, please submit a [Support Ticket](https://support.kestra.io/)
- reach out to us [via Slack](/slack).

We understand that upgrades can be difficult. If you need more help, [reach out to us](/contact-us) and we'll help you with the migration based on your specific environment and use case.
