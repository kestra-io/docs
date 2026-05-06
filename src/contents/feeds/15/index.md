---
title: "✨ Kestra 0.10.0 ✨"
link: "See the blog post"
href: "https://kestra.io/blogs/2023-07-10-release-0-10-blueprints-worker-groups-scripts"
image: ./image.png
publicationDate: 2023-07-07T11:00:00
addedDate: 2023-07-07T12:16:57.06
---

🔹 Blueprints: a curated, organized, and searchable catalog of ready-to-use examples designed to help you kick-start your workflow. Accessible in the left navigation sidebar and in dedicated tab in the code editor.

🔹 Improved Support for Scripts: we introduced new dedicated tasks plugins supporting Python, R, Bash and Node. It comes with improved syntax, better support of Docker and files management.

🔹 Execution Labels: so far, it was only possible to add labels on a flow level by adjusting the workflow code. This release adds the ability to set custom labels for specific Executions.

🔹 Basic Auth: Kestra 0.10.0 introduce basic authentication in open-source - to strengthens your instance’s security.

🔹 Secret Function: you can now manage secrets in the open-source version with a dedicated secret() function - reading encoded base64 value from environment variables.

🔹 New DAG task: Directed Acyclic Graph was a pattern already supported in Kestra. This new DAG task allow you to define dependencies explicitly between tasks with a specific dependsOn property (so now you can specify upstream dependencies of each task).

🔹 Worker Group (EE) : sometimes you need access to particular Operating Systems, libraries, on-prem applications, network resources (such as VPN), GPUs, or need to execute in a defined region to meet compliance regulations. With Worker Group you can execute tasks on specific worker instances by associating them with a particular worker group key.

🔹 Organization Blueprints (EE) : alongside the new Blueprint feature, enterprise users can write their own organization blueprints and so share an intern gallery of flows between teams.
