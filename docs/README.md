---
order: 0
---

# What’s Kestra?
Kestra is an orchestration & scheduler platform that helps you to build, run, schedule, and monitor complex pipelines.


![Flow Topology](/ui.gif)

You just need to [develop some flow](developer-guide) in yaml and let Kestra do all the others complex things for you : 
- Deploying
- Scaling
- Monitoring 
- Handling errors
- ... 

> Simply define the flow with a simple succession of tasks, decide when and how the flow should be launched, and monitor execution in real time.


## Principles
- **Simple**: Kestra workflow are defined as yaml, no code here, just a simple declarative syntax allowing even [complex](developer-guide/flowable) workflow.  
- **Extensible**: All the foundation of Kestra is built upon plugins, found [one](../plugins) or build your [own](plugin-developer-guide) to fit your business needs.
- **Real time**: Kestra is built by thinking in real time, just create a flow, run it & see all the logs in realtime
- **Scalable**: Kestra has started to enjoy infinite scale, build with top technologies like Kafka & Elasticsearch, scale to millions of executions without the pain.
- **Cloud Native**: Build with cloud in mind, with top cloud native technology and [deploy everywhere](administrator-guide/deployment) in cloud or on premise. 
- **Open source**: Kestra is built with Apache 2 license, [contribute](https://github.com/kestra-io/kestra) on core or plugins as you can.


## Usages
Kestra can be used as: 
- **Data orchestrator**: handle complex workflow. Moving large dataset, transform it and load it (ETL or ELT). 
- **Distributed crontab**: schedule work on multiples workers and monitor all these process.
- **Events Driven workflow**: react to external events like api call to get things done instantly.
- ... 

Now [Getting started](getting-started) and happy flows ! 
