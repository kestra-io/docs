---
title: Renamed Plugins
icon: /docs/icons/migration-guide.svg
release: 0.17.0
---

Many core plugins have been renamed in Kestra 0.17.0, and `taskDefaults` are now `pluginDefaults`. While these are non-breaking changes, we recommend updating your flows to use the new names.

## Why the Change?
Multiple plugin types have been moved to a new package structure under `io.kestra.plugin.core` to make the plugin system more consistent and intuitive.

::alert{type="warning"}
We've also renamed `taskDefaults` to `pluginDefaults` to highlight that you can set default values for all plugins (_including triggers, task runners and more_), not just tasks.
::

All of these are non-breaking changes as we leverage **aliases** for backward compatibility. You will see a friendly warning in the UI code editor if you use the old names.

![renamed-core-plugins](/docs/migration-guide/renamed-plugins.png)

It's worth taking a couple of minutes to rename those in your flows to future-proof your code.

## Renamed Core Plugins

Here is the schema showing how the core abstractions have been renamed:

- `io.kestra.core.models.conditions.types.*` → `io.kestra.plugin.core.condition.*`
- `io.kestra.core.models.triggers.types.*` → `io.kestra.plugin.core.trigger.*`
- `io.kestra.core.models.tasks.runners.types.*` → `io.kestra.plugin.core.runner.*`
- `io.kestra.core.tasks.storages.*` → `io.kestra.plugin.core.storage.*`
- `io.kestra.core.tasks.*.*` → `io.kestra.plugin.core.*.*`
- `io.kestra.plugin.fs.http.*` → `io.kestra.plugin.core.http.*`



Below you can see the full list of renamed plugins:

| Old Name Before Kestra 0.17.0                                        | New Name After Kestra 0.17.0                                  |
|----------------------------------------------------------------------|---------------------------------------------------------------|
| `io.kestra.core.models.conditions.types.DateTimeBetweenCondition`    | `io.kestra.plugin.core.condition.DateTimeBetweenCondition`    |
| `io.kestra.core.models.conditions.types.DayWeekCondition`            | `io.kestra.plugin.core.condition.DayWeekCondition`            |
| `io.kestra.core.models.conditions.types.DayWeekInMonthCondition`     | `io.kestra.plugin.core.condition.DayWeekInMonthCondition`     |
| `io.kestra.core.models.conditions.types.ExecutionFlowCondition`      | `io.kestra.plugin.core.condition.ExecutionFlowCondition`      |
| `io.kestra.core.models.conditions.types.ExecutionLabelsCondition`    | `io.kestra.plugin.core.condition.ExecutionLabelsCondition`    |
| `io.kestra.core.models.conditions.types.ExecutionNamespaceCondition` | `io.kestra.plugin.core.condition.ExecutionNamespaceCondition` |
| `io.kestra.core.models.conditions.types.ExecutionStatusCondition`    | `io.kestra.plugin.core.condition.ExecutionStatusCondition`    |
| `io.kestra.core.models.conditions.types.FlowCondition`               | `io.kestra.plugin.core.condition.FlowCondition`               |
| `io.kestra.core.models.conditions.types.FlowNamespaceCondition`      | `io.kestra.plugin.core.condition.FlowNamespaceCondition`      |
| `io.kestra.core.models.conditions.types.HasRetryAttemptCondition`    | `io.kestra.plugin.core.condition.HasRetryAttemptCondition`    |
| `io.kestra.core.models.conditions.types.MultipleCondition`           | `io.kestra.plugin.core.condition.MultipleCondition`           |
| `io.kestra.core.models.conditions.types.NotCondition`                | `io.kestra.plugin.core.condition.NotCondition`                |
| `io.kestra.core.models.conditions.types.OrCondition`                 | `io.kestra.plugin.core.condition.OrCondition`                 |
| `io.kestra.core.models.conditions.types.PublicHolidayCondition`      | `io.kestra.plugin.core.condition.PublicHolidayCondition`      |
| `io.kestra.core.models.conditions.types.TimeBetweenCondition`        | `io.kestra.plugin.core.condition.TimeBetweenCondition`        |
| `io.kestra.core.models.conditions.types.VariableCondition`           | `io.kestra.plugin.core.condition.ExpressionCondition`         |
| `io.kestra.core.models.conditions.types.WeekendCondition`            | `io.kestra.plugin.core.condition.WeekendCondition`            |
| `io.kestra.core.models.tasks.runners.types.ProcessTaskRunner`        | `io.kestra.plugin.core.runner.Process`                        |
| `io.kestra.core.models.triggers.types.Flow`                          | `io.kestra.plugin.core.trigger.Flow`                          |
| `io.kestra.core.models.triggers.types.Schedule`                      | `io.kestra.plugin.core.trigger.Schedule`                      |
| `io.kestra.core.models.triggers.types.Webhook`                       | `io.kestra.plugin.core.trigger.Webhook`                       |
| `io.kestra.core.tasks.debugs.Echo`                                   | `io.kestra.plugin.core.debug.Echo`                            |
| `io.kestra.core.tasks.debugs.Return`                                 | `io.kestra.plugin.core.debug.Return`                          |
| `io.kestra.core.tasks.executions.Counts`                             | `io.kestra.plugin.core.execution.Count`                       |
| `io.kestra.core.tasks.executions.Fail`                               | `io.kestra.plugin.core.execution.Fail`                        |
| `io.kestra.core.tasks.executions.Labels`                             | `io.kestra.plugin.core.execution.Labels`                      |
| `io.kestra.core.tasks.flows.AllowFailure`                            | `io.kestra.plugin.core.flow.AllowFailure`                     |
| `io.kestra.core.tasks.flows.Dag`                                     | `io.kestra.plugin.core.flow.Dag`                              |
| `io.kestra.core.tasks.flows.EachParallel`                            | `io.kestra.plugin.core.flow.EachParallel`                     |
| `io.kestra.core.tasks.flows.EachSequential`                          | `io.kestra.plugin.core.flow.EachSequential`                   |
| `io.kestra.core.tasks.flows.Flow`                                    | `io.kestra.plugin.core.flow.Flow`                             |
| `io.kestra.core.tasks.flows.ForEachItem`                             | `io.kestra.plugin.core.flow.ForEachItem`                      |
| `io.kestra.core.tasks.flows.If`                                      | `io.kestra.plugin.core.flow.If`                               |
| `io.kestra.core.tasks.flows.Parallel`                                | `io.kestra.plugin.core.flow.Parallel`                         |
| `io.kestra.core.tasks.flows.Pause`                                   | `io.kestra.plugin.core.flow.Pause`                            |
| `io.kestra.core.tasks.flows.Sequential`                              | `io.kestra.plugin.core.flow.Sequential`                       |
| `io.kestra.core.tasks.flows.Subflow`                                 | `io.kestra.plugin.core.flow.Subflow`                          |
| `io.kestra.core.tasks.flows.Switch`                                  | `io.kestra.plugin.core.flow.Switch`                           |
| `io.kestra.core.tasks.flows.Template`                                | `io.kestra.plugin.core.flow.Template`                         |
| `io.kestra.core.tasks.flows.WorkingDirectory`                        | `io.kestra.plugin.core.flow.WorkingDirectory`                 |
| `io.kestra.core.tasks.log.Fetch`                                     | `io.kestra.plugin.core.log.Fetch`                             |
| `io.kestra.core.tasks.log.Log`                                       | `io.kestra.plugin.core.log.Log`                               |
| `io.kestra.core.tasks.states.Delete`                                 | `io.kestra.plugin.core.state.Delete`                          |
| `io.kestra.core.tasks.states.Get`                                    | `io.kestra.plugin.core.state.Get`                             |
| `io.kestra.core.tasks.states.Set`                                    | `io.kestra.plugin.core.state.Set`                             |
| `io.kestra.core.tasks.storages.Concat`                               | `io.kestra.plugin.core.storage.Concat`                        |
| `io.kestra.core.tasks.storages.DeduplicateItems`                     | `io.kestra.plugin.core.storage.DeduplicateItems`              |
| `io.kestra.core.tasks.storages.Delete`                               | `io.kestra.plugin.core.storage.Delete`                        |
| `io.kestra.core.tasks.storages.FilterItems`                          | `io.kestra.plugin.core.storage.FilterItems`                   |
| `io.kestra.core.tasks.storages.LocalFiles`                           | `io.kestra.plugin.core.storage.LocalFiles`                    |
| `io.kestra.core.tasks.storages.Purge`                                | `io.kestra.plugin.core.storage.Purge`                         |
| `io.kestra.core.tasks.storages.PurgeExecution`                       | `io.kestra.plugin.core.storage.PurgeExecution`                |
| `io.kestra.core.tasks.storages.Reverse`                              | `io.kestra.plugin.core.storage.Reverse`                       |
| `io.kestra.core.tasks.storages.Size`                                 | `io.kestra.plugin.core.storage.Size`                          |
| `io.kestra.core.tasks.storages.Split`                                | `io.kestra.plugin.core.storage.Split`                         |
| `io.kestra.core.tasks.templating.TemplatedTask`                      | `io.kestra.plugin.core.templating.TemplatedTask`              |
| `io.kestra.core.tasks.trigger.Toggle`                                | `io.kestra.plugin.core.trigger.Toggle`                        |
| `io.kestra.plugin.fs.http.Download`                                  | `io.kestra.plugin.core.http.Download`                         |
| `io.kestra.plugin.fs.http.Request`                                   | `io.kestra.plugin.core.http.Request`                          |
| `io.kestra.plugin.fs.http.Trigger`                                   | `io.kestra.plugin.core.http.Trigger`                          |


## Renamed Serdes Plugins

We've also renamed [serialization tasks](https://github.com/kestra-io/kestra/issues/2298) from `Readers` and `Writers` to explicit conversion tasks to make it more explicit that these tasks are intended to either convert from or to [Ion](https://amazon-ion.github.io/ion-docs/) — the primary data format used in Kestra to serialize data between tasks and storage systems. For example, `CsvReader` is now `CsvToIon` and the `CsvWriter` is now `IonToCsv`.

A full list of the renamed serialization tasks:
- `CsvReader` → `CsvToIon`
- `CsvWriter` → `IonToCsv`
- `JsonReader` → `JsonToIon`
- `JsonWriter` → `IonToJson`
- `AvroReader` → `AvroToIon`
- `AvroWriter` → `IonToAvro`
- `XmlReader` → `XmlToIon`
- `XmlWriter` → `IonToXml`
- `ParquetReader` → `ParquetToIon`
- `ParquetWriter` → `IonToParquet`

---

The table shows full paths of the renamed serialization tasks:

| Old Path Before Kestra 0.17.0                   | New Path After Kestra 0.17.0                   |
|-------------------------------------------------|------------------------------------------------|
| `io.kestra.plugin.serdes.csv.CsvReader`         | `io.kestra.plugin.serdes.csv.CsvToIon`         |
| `io.kestra.plugin.serdes.csv.CsvWriter`         | `io.kestra.plugin.serdes.csv.IonToCsv`         |
| `io.kestra.plugin.serdes.json.JsonReader`       | `io.kestra.plugin.serdes.json.JsonToIon`       |
| `io.kestra.plugin.serdes.json.JsonWriter`       | `io.kestra.plugin.serdes.json.IonToJson`       |
| `io.kestra.plugin.serdes.avro.AvroReader`       | `io.kestra.plugin.serdes.avro.AvroToIon`       |
| `io.kestra.plugin.serdes.avro.AvroWriter`       | `io.kestra.plugin.serdes.avro.IonToAvro`       |
| `io.kestra.plugin.serdes.xml.XmlReader`         | `io.kestra.plugin.serdes.xml.XmlToIon`         |
| `io.kestra.plugin.serdes.xml.XmlWriter`         | `io.kestra.plugin.serdes.xml.IonToXml`         |
| `io.kestra.plugin.serdes.parquet.ParquetReader` | `io.kestra.plugin.serdes.parquet.ParquetToIon` |
| `io.kestra.plugin.serdes.parquet.ParquetWriter` | `io.kestra.plugin.serdes.parquet.IonToParquet` |


## Renamed Task Runners

We've also renamed the task runners to make them more readable and easier to use. For example, `io.kestra.plugin.aws.runner.AwsBatchTaskRunner` is now `io.kestra.plugin.ee.aws.runner.Batch`. The updated names are as follows:

| Old Path Before Kestra 0.17.0                                 | New Path After Kestra 0.17.0                    |
|---------------------------------------------------------------|-------------------------------------------------|
| `io.kestra.core.models.tasks.runners.types.ProcessTaskRunner` | `io.kestra.plugin.core.runner.Process`          |
| `io.kestra.plugin.scripts.runner.docker.DockerTaskRunner`     | `io.kestra.plugin.scripts.runner.docker.Docker` |
| `io.kestra.plugin.ee.kubernetes.runner.KubernetesTaskRunner`  | `io.kestra.plugin.ee.kubernetes.runner.Kubernetes` |
| `io.kestra.plugin.ee.aws.runner.AwsBatchTaskRunner`           | `io.kestra.plugin.ee.aws.runner.Batch`             |
| `io.kestra.plugin.ee.azure.runner.AzureBatchTaskRunner`       | `io.kestra.plugin.ee.azure.runner.Batch`           |
| `io.kestra.plugin.ee.gcp.runner.GcpBatchTaskRunner`           | `io.kestra.plugin.ee.gcp.runner.Batch`             |
| `io.kestra.plugin.ee.gcp.runner.GcpCloudRunTaskRunner`        | `io.kestra.plugin.ee.gcp.runner.CloudRun`          |

## Renamed Redis Triggers and Tasks

The Redis plugin has been updated to make it easier to extend and maintain. The following classes have been renamed:

| Old Path Before Kestra 0.17.0        | New Path After Kestra 0.17.0                  |
|--------------------------------------|-----------------------------------------------|
| `io.kestra.plugin.redis.ListPop`     | `io.kestra.plugin.redis.list.ListPop`         |
| `io.kestra.plugin.redis.ListPush`    | `io.kestra.plugin.redis.list.ListPush`        |
| `io.kestra.plugin.redis.TriggerList` | `io.kestra.plugin.redis.list.Trigger`         |
| -                                    | `io.kestra.plugin.redis.list.RealtimeTrigger` |
| `io.kestra.plugin.redis.Publish`     | `io.kestra.plugin.redis.pubsub.Publish`       |
| `io.kestra.plugin.redis.Get`         | `io.kestra.plugin.redis.string.Get`           |
| `io.kestra.plugin.redis.Set`         | `io.kestra.plugin.redis.string.Set`           |
| `io.kestra.plugin.redis.Delete`      | `io.kestra.plugin.redis.string.Delete`        |


