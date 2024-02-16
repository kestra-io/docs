---
title: Database Migrations
icon: /docs/icons/admin.svg
---

This page describes how to perform database migrations in Kestra.

## Automatic database migration

Kestra uses [Flyway](https://flywaydb.org/) to automatically perform database migrations when Kestra server is started. Flyway is a tool that allows version controlling changes to a database (such as Kestra's database) so that you can migrate it to a new version easily. Kestra stores the current version of the database in a table called `flyway_schema_history`. When Flyway runs, it compares the current version of the database with the version that it should be at. If the versions do not match, Flyway will run the necessary migrations to bring the database up to date. This process is automatic when Kestra server starts, therefore no manual intervention is required.

## Manual database migration

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
