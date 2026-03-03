---
title: "Kestra 0.13 introduces an embedded VS Code Editor IDE, multi-tenancy, new UI header and 21 new plugins!"
link: "Welcome Kestra 0.13.0 ✨"
href: "https://kestra.io/blogs/2023-11-16-release-0-13"
image: ./image.png
publicationDate: 2023-11-16T14:30:00
addedDate: 2023-11-16T15:36:56.946
---

**Highlights of this release include:**
🔹 An embedded Visual Studio Code Editor
🔹 Namespace Files and the read() function, enabling the orchestration of custom scripts and microservices with modular components
🔹 Multi-tenancy in the Enterprise Edition, offering enhanced isolation and resource management
🔹 A new UI feature for customizing properties of the Executions table, improving the tabular view of executions
🔹 A revamped UI header with a global search bar for streamlined navigation
🔹 The ForEachItem task for efficient data processing in micro-batches
🔹 A flow-level concurrency setting to manage the number of concurrent executions and determine custom behavior upon limit breach
🔹 New notification plugins including OpsGenie (Atlassian), Sentry, PagerDuty, Zenduty, Discord, Twilio, WhatsApp, SendGrid, and GoogleChat
🔹 A broad array of additional plugins such as Ansible, Terraform, Weaviate, CloudQuery, Excel, Dremio, Arrow Flight, Modal, Dataform, SqlMesh, SQLite, and ClickHouse BulkInsert.
Additional highlights include:
🔹 A new logLevel property for all tasks, allowing you to manage the granularity level of logs captured by Kestra's backend
🔹 Enhanced webhook filtering via conditions
🔹 Improved access to taskrun.value in WorkingDirectory tasks used as child tasks of other flowable tasks
🔹 Support for manual database migration processes and an option to disable automatic migrations, giving you more control over the database migration process in production environments.
