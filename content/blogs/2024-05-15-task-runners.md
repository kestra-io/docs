---
title: "Run Your Code Across Any Environment with Task Runners"
description: "Task Runners are a pluggable system allowing you to run any code anywhere without having to worry about the underlying infrastructure"
date: 2024-05-15T08:00:00
category: Solutions
author:
  name: Martin-Pierre Roset
  image: "mproset"
image: /blogs/2024-05-15-task-runners.jpg
---

Efficiently managing infrastructure is crucial for businesses striving to stay competitive. In the past, handling compute-intensive tasks has meant maintaining always-on servers, which can be both inefficient and costly. Kestra's Task Runners offer an amazing solution that dynamically compute instances in the cloud. This feature ensures that your data processing tasks receive the resources they need precisely when they need them, optimizing your workloads, reducing costs, and improving processing speed.

---

## The Importance of Task Runners

Task Runners are a core feature of Kestra, providing a flexible and efficient way to manage compute-intensive tasks. They address several critical challenges for your workflows:

**Resource Optimization**: Task Runners give you fine-grained control over the allocation of compute resources such as CPU, memory, and GPU. This ensures that you are not paying for idle infrastructure, significantly reducing costs and improving resource utilization.

**Scalability**: Task Runners can seamlessly scale up or down based on workload requirements. Whether you are dealing with periodic spikes in data processing needs or sustained high workloads, Task Runners adapt to meet your demands, providing unparalleled flexibility.

**Efficiency**: By automating resource management, Task Runners complete your data processing tasks faster and more efficiently.

**Versatility**: Task Runners support various deployment models, including AWS ECS Fargate, Azure Batch, Google Batch, and auto-scaled Kubernetes clusters. This flexibility allows you to choose the best infrastructure for your specific needs without being locked into a single vendor.

**Task Isolation**: Each task runs in a fully isolated container environment, preventing interference and resource competition between tasks. This isolation ensures reliable and consistent performance across all workloads.

---

### Real-World Impact of Task Runners

To truly appreciate the value of Task Runners, let's explore how they transform operations across different industries.

**Data Analytics**: During heavy data ingestion phases, Task Runners can dynamically increase resources during these periods and scale down afterward, optimizing performance and cost. For instance, during nightly batch processing jobs involving extensive data transformation and cleaning, Task Runners allocate the necessary resources, ensuring these intensive tasks are completed efficiently without manual intervention.

**Financial Services**: In the financial sector, high data volume during trading hours can be challenging. Task Runners can scale up resources during peak times to handle the increased load, ensuring smooth and efficient data processing. For tasks like financial risk simulations, which require running numerous scenarios to assess risk, Task Runners dynamically allocate the necessary computational power, enabling rapid and accurate risk assessment.

**Healthcare & Life Sciences**: The healthcare industry often deals with large datasets that require significant computational power. Task Runners can scale resources as needed to ensure timely and accurate analysisng. For example, genomic data processing, which involves sequencing or analyzing large genomic datasets, can be resource-intensive. Task Runners dynamically allocate the required resources, ensuring efficient processing.

**Software Development**: Software development tasks such as database migrations often require transferring large volumes of data and substantial computational power. Task Runners can scale up resources during these tasks, ensuring efficient migration and processing. This leads to smoother transitions and timely completion of tasks, which is critical in maintaining project timelines and reducing downtime.

---

## How Task Runners Work

Task Runners operate by interfacing with your cloud provider's infrastructure to provision and manage compute resources. When a task is submitted to Kestra, the orchestrator evaluates the resource requirements and provisions the necessary instances in the cloud. Once the task is completed, the resources are deallocated, ensuring that you only pay for what you use.

For example, in a machine learning scenario, a Task Runner can be configured to allocate GPUs during the training phase. As soon as the training is complete, the GPUs are released, and the cost of those resources ceases. This dynamic allocation and deallocation make Task Runners an economical and efficient solution for handling compute-intensive tasks.

---

## Fine-Grained Resource Allocation

One of the standout features of Task Runners is the fine-grained control over resource allocation. This allows you to specify the exact amount of CPU, memory, and GPU resources required for each task. Whether you're running a simple data transformation job or training a complex machine learning model, Task Runners ensure that the right resources are available, optimizing performance and cost-efficiency.

---

## Flexible Deployment Patterns

Task Runners support a variety of deployment models, allowing you to mix and match different runners within a single workflow. This flexibility is particularly useful for businesses that operate in hybrid cloud environments or need to support multiple cloud providers. With Task Runners, you can deploy your tasks on AWS ECS Fargate, Azure Batch, Google Batch, Kubernetes, and more, without being locked into a specific vendor.

For instance, many Kestra users develop their scripts locally in Docker containers and then run the same code in a production environment as Kubernetes pods. Thanks to the taskRunner property, setting this up is straightforward.

This approach allows you to maintain consistent development and production environments without changing your code, ensuring a smooth transition from development to production.

---

## Centralized Configuration Management

Task Runners also simplify configuration management by allowing you to centrally govern your settings. Using the pluginDefaults property, you can manage task runner configurations and credentials at the namespace level. This centralization ensures consistency and simplifies the management of complex deployments.

For example, you can centrally manage your AWS credentials for the AWS Batch task runner plugin:

```yaml
pluginDefaults:
  - type: io.kestra.plugin.aws
    values:
      accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
      secretKeyId: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
      region: "us-east-1"

```

This configuration applies to all components of the AWS plugin, including tasks, triggers, and task runners, streamlining management and ensuring security.

---

## Documentation and Autocompletion

To make configuration even easier, each Task Runner plugin comes with built-in documentation, autocompletion, and syntax validation. The Kestra UI includes a code editor that provides these features, ensuring that your configurations are correct and standardized. When you click on a runner's name in the editor, its documentation appears on the right side of the screen, providing immediate access to information and examples.

---

## Full Customization

For businesses with unique requirements, Task Runners offer full customization capabilities. You can create custom Task Runner plugins tailored to your specific environment. By building these plugins as JAR files and adding them to the plugins directory, you can extend Kestra's functionality to meet your precise needs.

For instance, if your deployment patterns require specific configurations not covered by existing plugins, you can develop and integrate your own Task Runner. Contributing these custom plugins to the Kestra community can also help other users with similar requirements, fostering collaboration and innovation.

---

### Conclusion

Kestra's Task Runners provide a robust, efficient, and cost-effective solution for managing compute-intensive tasks across various industries. By dynamically provisioning resources as needed, Task Runners ensure that your data processing tasks are completed efficiently, without the need for always-on servers. This not only optimizes resource usage and reduces costs but also enhances scalability and efficiency.

By optimizing workloads, reducing costs, and improving speed, Task Runners empower businesses to handle their data processing needs more effectively. Whether you are in data analytics, financial services, healthcare, or software development, Task Runners provide the flexibility and efficiency you need to stay competitive in today’s data-driven world.

Ready to see Task Runners in action? [Read our documentation](https://kestra.io/docs/concepts/task-runners)!

Join the [Slack community](https://kestra.io/slack) if you have any questions or need assistance.
Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news.
Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.
