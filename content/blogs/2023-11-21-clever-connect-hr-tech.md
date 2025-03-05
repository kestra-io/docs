---
title: "CleverConnect: Using Kestra to Help 350 Million People Find a Fulfilling Job by 2030"
description: "How the HR company uses Kestra as the backbone of their platform."
date: 2023-11-21T09:00:00
category: Solutions
author:
  name: Benoit Pimpaud
  image: "bpimpaud"
image: /blogs/2023-11-21-clever-connect-hr-tech.jpg
---

This case study delves into how [CleverConnect](https://cleverconnect.com/), a human resources tech company, leverages Kestra's capabilities to create an integration platform. With a database of over 10 million candidates and partnerships with 2,500 companies across Europe, CleverConnect has developed an AI-driven, integrated solution for job boards, career sites, CRMs, and other HR tools. Using [Kestra](https://github.com/kestra-io/kestra), they've constructed a platform specifically tailored for automating the creation of connectors, streamlining the recruitment process, and enhancing the overall experience.

## CleverConnect’s Journey Towards Efficiency

One part of CleverConnect’s job is to integrate data from different external sources to parse job postings, job applications and talents to distribute them in their products. They need to create new connectors regularly and maintain API schema in sync with their own integrations.
Before CleverConnect adopted Kestra, the tech stack presented certain challenges that, with Kestra's implementation, have since transformed into opportunities for growth:

* Architecture simplification: the technology stack was a diverse mix of technologies. This scattered the business logic across different services, making operations challenging. However, with Kestra, they have streamlined and simplified their integration processes, bringing greater clarity to business logic and design.

* Time-Efficient Development: Creating new connectors used to be a time-consuming process, demanding a significant allocation of internal resources. However, Kestra has revolutionized their development process. They can now develop connectors more efficiently, saving valuable time and internal resources. This efficiency enables them to be more agile and responsive to their business needs.

CleverConnect required a new integration hub —a solution that could accelerate their development of partnerships within the HR ecosystem while allowing them to scale seamlessly, without being limited by extensive maintenance. They needed an agile and efficient platform to meet their evolving needs.


## New Integration Platform: Create Connectors Automated by Kestra

CleverConnect created this new platform, built on top of Kestra. As Kestra is API by design, CleverConnect takes advantage of this feature to use it as their orchestration system to scrape, parse and connect HR data with their products. Kestra is used as the backbone to schedule and automate workflow executions.

This platform allows to generate Kestra flows through a low code interface that mostly consists of three parts:

* Inbound Connectors: allow to validate and connect with partners API sources. Using flow inputs property and custom plugins to streamline development and scrape the API. Users are guided during the connector edition thanks to Kestra semantics allowing type enforcement and default values.

* Transformer Connectors: to apply custom rules like adding or removing values, mapping fields, filtering data, etc.

* Outbound Connectors: to map data to external providers and deal with corresponding destination authentication and credentials.


![connector](/blogs/2023-11-21-clever-connect-hr-tech/cleverconnect-connectors.png)

The more sources and destinations CleverConnect has, the more difficult it gets. Thanks to Kestra, the company has successfully uncoupled the sources and destinations, allowing ease of maintenance and development. The business logic of parsing API and make the codebase flexible has been possible thanks to the following features of Kestra:

* Subflows: CleverConnect has implemented a level of abstraction, which allows them to recycle components across multiple use-cases. The strategic use of [input properties](../docs/developer-guide/inputs) ensures not only the easy transmission of metadata and parameters but also creates a library of highly composable elements.

* Custom Scripting: they adeptly handle tasks such as API parsing, pagination, and rate limiting by employing custom [Groovy scripts](/plugins/plugin-script-groovy). This flexibility in script execution enables CleverConnect to structure their codebase in a way that seamlessly integrates with their requirements, while maintaining a cohesive and well-orchestrated workflow.


> "Kestra's advanced low-code system streamlined Customer Integrations, it let us reduce time and costs significantly, marking a major efficiency and scalability leap for CleverConnect." - Patrick Ferreira, Product Manager CleverConnect


## Deploying & Using Kestra Very Fast

Following the adoption of Kestra, CleverConnect achieved production readiness in under two months, with the first integrations seamlessly running in a production environment. While evaluating other options, none could match Kestra's combination of rapid deployment and user-friendly operation.

The semantics of Kestra, based on YAML, speed up the development processes and general understanding of workflows:
Before Kestra, crafting new connectors was a process that could stretch over several weeks. From now they easily onboard junior profiles and let them create flow independently.
Even less technical users can read visual flows easily and grasp most of the logic.

As Kestra is API by design, it allows them to quickly build their custom front-end and automate the flow creation. Kestra orchestrates the data flow and application logic, tying all the components of their platform together.
Regarding deployment, the CleverConnect team chose [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine).
The development workflow is streamlined by using [GitLab CI/CD](../docs/developer-guide/cicd/gitlab) alongside [Terraform](../docs/developer-guide/cicd#deploy-flows-from-terraform) to deploy Kestra flows from development to production instances. Following the best practices of DevOps and craftsmanship.

## Conclusion

Kestra has become a critical asset for CleverConnect, enabling them to accelerate their development processes and manage an ever-growing number of connectors. The platform's versatility, rapid development capabilities, and robust API have played a critical role in CleverConnect's ongoing mission to change the recruitment industry. With Kestra by their side, CleverConnect is well on its way to achieving its ambitious goal by 2030: to help over 350 million people find a fulfilling job.

Join the [Slack community](https://kestra.io/slack) if you have any questions or need assistance. Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news. Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.
