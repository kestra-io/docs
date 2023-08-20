---
title: "Introducing new Kestra light architecture for open source data orchestration."
description: "A new very light architecture for Kestra, open-source orchestration and scheduling platform."
date: 2022-06-21T07:00:00
category: News & Products Updates
author:
  name: Ludovic Dehon
  image: "ldehon"
  twitter: "@tchiotludo"
image: /blogs/2022-06-21-kestra-light.jpg
---

When we have launch [Kestra](https://github.com/kestra-io/kestra) [officially](../blogs/2022-02-01-kestra-opensource.md) few month ago, we wanted to have the most **complete, reliable, scalable** product to show you. We are really proud to have the **first cloud native orchestration & scheduling platform** running only with technologies like Kafka and ElasticSearch. Theses bring an architecture with no single point of failure and high throughput in order to scale to millions of executions without the pain.

Since this is pretty cool, not everyone is Uber, LinkedIn, (add any another big tech startup) that need to have these hard requirements of scalability, and we [see some comments](https://news.ycombinator.com/item?id=30790047) about the product that ElasticSearch or Kafka can be a pain to manage. In fact, we already know that, but we don't even think that this one can a stopper.

We have interview many people on our slack community, twitter, ... also that **confirm us** that the stack can be a real blocker for small company as they are afraid of managing a full cluster.

## We have heard you all!

For now, we continue to think a high-availability solution is a **must-have**, a solution that can ensure you that if your needs increase, you will have a solution to scale without having to do without the features. So we decide to create a new version of Kestra (in Beta for now) that will work for a Medium-sized environment.

![Kestra Architecture](/docs/architecture/architecture-sql.svg)


The solution is to **remove the dependencies of Kafka & ElasticSearch** and to allow to replace them with a **simple MySQL of Postgres** database for the both of them.

Since MySQL or Postgres are largely common, people are not feared of hosting these services. In general, multiple instances are already running on your company. Moreover, the most cloud provider can offer you this as managed service, or you can easily find one provider handling that.

The new version is possible since Kestra thought since its inception as **pluggable architecture**, and we only need to implement a new repository and a new queue.

## Tradeoff using a Database

![Tradeoff using a Database](/blogs/2022-06-21-light-architecture/warning.jpg)

We have worked harder to be able to have the **more fluent change** using a database, but we have made some tradeoffs for now (maybe you can go deeper depending on your feedback for a certain point).

Here is some tradeoff now:
- The Task Runs page is not available for database implementation.
- We are not able to detect dead workers (for example, when you restart Kestra and there is still a task running or other unexpected failures): in the Kafka implementation, we detect dead workers and resubmit the task currently running. This is possible since Kafka has a heartbeat mechanism to detect this kind of failure, that is not the case for the database version (ping us if this one is really important).
- You can't scale the scheduler at more than one instance, dispatching a list of flow between multiple instances is hard since we need a heartbeat feature for dead workers.
- The database is often the single point of failure of the most common architecture.

All the other features are the same!

## This is not the end

Since we have implemented MySQL and Postgres, and java has a strong abstraction of database (with JDBC and JOOQ), we are also able to bring you the last version with **no database at all**.

This implementation relies on an H2 database that is an in-memory database or file-based one. To illustrate this, just [grab the executable from Kestra](https://github.com/kestra-io/kestra/releases/tag/v0.5.0-BETA), install java 11+ and start the server with:

```shell
# unix or macos
./kestra server local

## windows
rename kestra-0.5.0 kestra-0.5.0.cmd
kestra.cmd server local
```

Go to the UI on `http://localhost:8080`, you are up and running. This one is suitable for the development environment and will allow all your developer to have a running version of Kestra without any painful setup.

Please [go here](../docs/09.administrator-guide/04.servers.md#kestra-local-development-server-with-no-dependencies) for the full getting started for local server.

For this implementation, just note that you will need to have a docker daemon running to be able to use [Bash](../plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Bash.md) or [Python](../plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Python.md) with `runner: DOCKER`. A special warning for Windows users, since Kestra was thought to be deployed on a Linux server, but our primer test seems to be nice and functional.


## Conclusion

This feature needs a [large refactoring of Kestra](https://github.com/kestra-io/kestra/pull/368) to remove some assumptions (for example, we used Lucene query of ElasticSearch on the whole UI). So we have released a new **BETA** version `0.5.0-BETA` to gather the much feedback as possible and to be sure to avoid bugs introduce by this major version. Please go ahead, test it and send as much feedback as possible.

We hope that will enjoy this new feature and that you will imagine more use cases with Kestra, stay connected and follow us on [GitHub](https://github.com/kestra-io/kestra), [Twitter](https://twitter.com/kestra_io), or [Slack](https://kestra.io/slack).
