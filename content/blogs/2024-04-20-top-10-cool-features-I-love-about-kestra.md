---
title: "Top 10 cool features I love about Kestra"
description: "This blog post lists 10 Kestra features that have changed my work for the better."
date: 2024-04-20T10:00:00
category: Solutions
author:
  name: Shruti Mantri
  image: "smantri"
---

Kestra is a remarkably powerful orchestration engine. It uses a rather simple, and easy to configure declarative approach for designing workflows. This simplicity facilitates seamless adaptation to Kestra, as one does not need to be a master of any particular programming language. Anyone with clear intentions about the desired workflow can search for the corresponding plugins, and put the workflow together using the powerful YAML notation.

Kestra comes with a rich set of plugins. It has plugins for every popular system out in the market. Not just that, every plugin is also equipped with various actions, called as tasks, that it can perform. For example, if we talk about file systems like S3, Kestra not only provides tasks for uploading and downloading objects from S3, but also provides tasks that take care of smaller nitty-gritties like creating and deleting bucket, and listing the contents of bucket. This makes Kestra more powerful and dependable for all our needs.

While Kestra provides all the features that any orchestration tool in the market has like scheduling jobs/flows, showing the workflow execution in Gantt and graph formats, it has much more to offer. Kestra strikes a perfect balance between the tooling functionalities and the operational reality. Kestra has many cool features that are unique and aligns with the operational needs of any data engineer. Here are the top 10 cool features that are my personal favourite, and makes me fall in love with the tool:

## 10. Output Preview

Multiple orchestration tasks generate data, either by fetching it from external systems, or by performing actions on top of the existing data. These resultant data sets are stored internally by the orchestration engines. As part of the orchestration steps, these data sets are uploaded to file systems like S3 and Blob Storage, and used for further processing. But many times, you want to check the contents of the data sets being produced to ensure you are getting the desired results. The only choice you are left with is to download the data from the tool's internal storage onto your local machine. Soon, your local machine is cluttered with these regularly downloaded files. 

Kestra provides an extremely smart and easy to use feature of previewing these data sets. You can go to the Outputs tab, and the data sets that are downloaded to internal storage are available with Download and Preview option. The [Preview option](https://kestra.io/docs/workflow-components/outputs#outputs-preview) is one of my favorites giving me quick access to look at the output file contents. This is how the Preview of the data set looks like:

![output_preview](/blogs/2024-04-20-top-10-cool-features-I-love-about-kestra/output_preview.png)

## 9. Editor

Kestra comes with an in-built [VSCode editor](https://kestra.io/docs/getting-started/ui#editor). For any coding that you need to do, you need not go anywhere outside this tool. You have the well-equipped VS Code editor right there within Kestra itself. It also comes with the Kestra extension installed out of the box, and is flexible to also install any other extensions of your choice. This comes in very handy when you want to write scripts to be used within your orchestration flow.

![vscode_editor](/blogs/2024-04-20-top-10-cool-features-I-love-about-kestra/vscode_editor.png)

## 8. Auto-suggestion for task type

When you become a bit used-to to Kestra, you create the new flow, and start typing out your tasks. While you know that you want to write the task pertaining to certain third party plugin, it can become difficult to memorize the actual task type. But going to the plugin documentation every time just to get the task type is pretty time consuming and exhausting. Kestra has an ultimate solution to this problem. After typing out `task: `, you can start typing out any part of the type content like the plugin name, and you would get auto-suggestions containing what you have typed. This has saved multiple minutes of my time on a daily basis.

![task_type_autosuggestion](/blogs/2024-04-20-top-10-cool-features-I-love-about-kestra/task_type_autosuggestion.png)

## 7. Flow-based triggers

Multiple instances of orchestration requires flow dependencies. For example, you want to trigger a clean-up flow if another flow has failed, or you want to trigger the final flow when multiple other flows have succeeded. It could be daunting to achieve this in many orchestration tools. However, this can be achieved in Kestra in just a couple of lines by adding `conditions` to the flow trigger. Here is an example of a flow that will get triggered when any production flow fails:

```yaml
id: send-failure-alert
namespace: prod
tasks:
  - id: send-alert
    type: io.kestra.plugin.notifications.slack.SlackExecution
    url: "{{ secret('SLACK_WEBHOOK') }}"
    channel: "#failures"
    executionId: "{{trigger.executionId}}"
triggers:
  - id: watch-failed-flows
    type: io.kestra.core.models.triggers.types.Flow
    conditions:
      - type: io.kestra.core.models.conditions.types.ExecutionStatusCondition
        in:
          - FAILED
      - type: io.kestra.core.models.conditions.types.ExecutionNamespaceCondition
        namespace: prod
        prefix: true
```

You can read more about it on this [page](https://kestra.io/plugins/core/triggers/io.kestra.core.models.triggers.types.flow).

## 6. Backfill

[Backfill](https://kestra.io/docs/concepts/backfill) is one of the dreadful words in the orchestration world. While being one of the necessary features, it is one of the difficult task to achieve. Many tools are not able to abstract this underlying complexity, and make it a tedious task for the data engineer to trigger a backfill. Data Engineer is confused with the number of parameters they need to fill in, and get them right, for achieving the desired results from a backfill.

Kestra has done an amazing task at achieving this with the click of a button. If you are triggering this from the UI, the "backfill execution" is placed at the location where Kestra is already aware about the context of the backfill, and requires as minimum information as the time for which backfill needs to be performed. With Kestra, no data engineer will ever panic from backfilling.

![backfill](/blogs/2024-04-20-top-10-cool-features-I-love-about-kestra/backfill.png)

## 5. Dashboards

Kestra provides multiple dashboards, each at a different granularity, all out of the box. The global dashabord which is present as the home page of Kestra, gives an overall picture about how different workflows in Kestra are performing. The executions are available in the timeline format, highlighting any abnormal activities on the number of executions that took place. The failures are appropriately highlighted, making it difficult to miss out on them.

![dashboard](/blogs/2024-04-20-top-10-cool-features-I-love-about-kestra/dashboard.png)

The dashboards are also provided with every flow and every namespace(EE specific feature). If you figure out any abnormalities in the global dashboard, you can easily zero in on any flow or namespace, and dive deeper by going to the dashboards of the corresponding flow or namespace.

## 4. Inputs

Kestra flows can be configured to accept different types of [inputs](https://kestra.io/docs/workflow-components/inputs) like string, integer, float, date, datetime, and many more. My favorite one is the FILE input type.

For many orchestration tools, it is a tedious task to provide file input, as the file either needs to be checked in to the code or uploaded to an apporopriate loaction in the file system. With Kestra's file input, you can literally choose file from any location of your machine, and provide it as an input. This makes it a piece of cake to try out the workflows with different test files. It could not be any simpler to make changes to the file and iterate the testing process.

![input_file](/blogs/2024-04-20-top-10-cool-features-I-love-about-kestra/input_file.png)

## 3. Secrets

It is paramount to prioritize the protection of sensitive information. It is a necessity that no sensitive information gets checked-in in its plain or easily-decodeable format. At the same time, it should also be easy to introduce this information in the platform for developer productivity.

Kestra just has the right solution in place. The [secrets](https://kestra.io/docs/concepts/secret) can be provided as environment variables in base64 encoded format while operating Kestra in the dockerized mode. The secrets can also be provided from the UI directly in its EE edition. Using secret in Kestra is pretty starightforward as well. You can use the format `{{ secret('MY_PASSWORD') }}` and access a secret stored under `SECRET_MY_PASSWORD` environment variable. Overall, its mesmerizing to see how easy it is to introduce and use secrets in Kestra.

Here is an image of adding secret via the UI in EE edition:

![secrets_ee](/blogs/2024-04-20-top-10-cool-features-I-love-about-kestra/secrets_ee.png)

## 2. Task defaults

This is yet another powerful feature from the developer productivity perspective. Generally, you develop a pipeline in correspondance to some technology, and it is extremely likely that you use multiple tasks that corresponds to the same technology. For example, in a flow that queries Redshift, it is very likely that you connect to Redshift for creating the table in one task, and then to insert data into it in another task, and then query it for some purpose. In this case, you would just end up duplicating the Redshift connection information in all these tasks. This hampers the developer productivity, and also leads to config duplication.

In order to avoid this duplication, we have Kestra [task defaults](https://kestra.io/docs/workflow-components/task-defaults) to the rescue. Mention the task defaults once in the flow, and it gets referenced in all the tasks of the corresponding type.

```yaml
id: redshift_data_pipeline
namespace: dev
tasks:
  - id: "redshift_create_table_products"
    type: "io.kestra.plugin.jdbc.redshift.Query"
    sql: |
      create table if not exists products
      (
          id           varchar(5),
          name         varchar(250),
          category     varchar(100),
          brand        varchar(100)
      );
  - id: "redshift_insert_into_products"
    type: "io.kestra.plugin.jdbc.redshift.Query"
    sql: |
      insert into products values 
      (1,'streamline turn-key systems','Electronics','gomez'),
      (2,'morph viral applications','Household','wolfe'),
      (3,'expedite front-end schemas','Household','davis-martinez'),
      (4,'syndicate robust ROI','Outdoor','ruiz-price'),
      (5,'optimize next-generation mindshare','Outdoor','richardson');
  - id: join_orders_and_products
    type: "io.kestra.plugin.jdbc.redshift.Query"
    sql: |
      select o.order_id, o.customer_name, o.customer_email, p.id as product_id, p.name as product_name, p.category as product_category, p.brand as product_brand, o.price, o.quantity, o.total from orders o join products p on o.product_id = p.id
    store: true
taskDefaults:
  - type: "io.kestra.plugin.jdbc.redshift.Query"
    values:
      url: jdbc:redshift://<redshift-cluster>.eu-central-1.redshift.amazonaws.com:5439/dev
      username: redshift_username
      password: redshift_passwd
```

## 1. Render Expression

During the pipeline development phase, you get multiple intermediate data sets which you need to further cleanse or transform in order to achieve the desired results. It is pretty overwhelming to write the next data transformation step as part of the flow, and run the complete flow in order to test out the transformation. This is where Kestra has an advanced tooling which helps you perform the data transformation on the existing outputs. It evaluates the transform expression right on the spot, and provides you the preview of the transformed results.

![render_expression](/blogs/2024-04-20-top-10-cool-features-I-love-about-kestra/render_expression.png)

With all these cool features, it is no wonder that Kestra is the new future of the orchestration industry. I would definitely recommend this tool, and would encourage you to make your hands dirty trying out this tool and its awesome features.

Join the Slack [community](https://kestra.io/slack) if you have any questions or need assistance.
Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news.
Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.
