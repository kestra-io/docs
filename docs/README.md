---
order: 0
---

# What’s Kestra?
Kestra is an orchestration & scheduler platform that helps you to build, run, schedule, and monitor complex pipelines.


![Flow Topology](/ui.gif)

Kestra makes it simple to [create a flow](https://kestra.io/docs/developer-guide/), requiring only a few lines of yaml. All other complexities are handled by Kestra, including:
- Deploying
- Scaling
- Monitoring
- Handling errors
- ...

> Simply define the flow with a simple succession of tasks, decide when and how the flow should be launched, and monitor execution in real time.


## Principles
- **Simple**: Kestra workflows are defined as yaml, no code here, just a simple declarative syntax allowing even [complex](developer-guide/flowable) workflows.
- **Extensible**: The entire foundation of Kestra is built upon plugins. Find an existing [plugin](../plugins) or build your [own](plugin-developer-guide) to fit your business needs.
- **Real time**: Kestra is built by thinking in real time. Simply create a flow, run it and see all the logs in realtime.
- **Scalable**: Kestra users enjoy its almost infinite scalability. It is built with top technologies like Kafka & Elasticsearch, and can scale to millions of executions without any difficulty.
- **Cloud Native**: Built with the cloud in mind, Kestra uses top cloud native technologies and allows to [deploy everywhere](administrator-guide/deployment), whether in the cloud or on-premise.
- **Open source**: Kestra is built with the Apache 2 license, [contribute](https://github.com/kestra-io/kestra) to our core or plugins as you can.


## Usages
Kestra can be used as:
- **Data orchestrator**: Handle complex workflows and move large datasets. Extract, transform and load datasets in the manner of your choice (ETL or ELT).
- **Distributed crontab**: Schedule work on multiple workflows and monitor each and every process.
- **Events Driven workflow**: React to external events such as api calls to get things done instantly.
- ...

Now [get started](getting-started) and keep it flowing!
