---
title: "Orchestrating Genomic Data Workflows: SOPHIA GENETICS Optimizes Operations with Kestra"
description: "How a leading company in the pharmaceutical industry use Kestra to orchestrate genomic data workflows?"
date: 2024-11-05T13:00:00
category: Solutions
author:
  name: Benoit Pimpaud
  image: "bpimpaud"
image: /blogs/2024-11-05-sophia-genetics-use-case.jpg
---

Genomic sequence analysis is a key process for leading companies in the health technology industry. Yet, bioinformaticians have long grappled with existing tools that either lack user-friendly interfaces or fail to integrate smoothly with external systems. Enter Kestra, a software orchestrator that represents a game-changing solution designed to fill this gap. While many tools in the field either focus on narrow scientific applications, neglect modern integration capabilities, or rely on the limitations of interpreted languages like Python, Kestra offers a balanced approach. It combines scientific rigor with the flexibility to integrate with contemporary tooling, making it easier to scale, update architecture, and onboard new talent into this specialized field. In essence, Kestra addresses the bioinformatics community's pressing need for a tool that harmonizes scientific depth with modern technological agility.

Quite surprisingly, none of the existing tools in this space appeared to adequately address the aforementioned pain point.


## Kestra: The Solution for SOPHIA GENETICS

We're proud to be collaborating with one of the industry's leading giants, [SOPHiA GENETICS](https://www.sophiagenetics.com), in developing ever more efficient solutions to orchestrate and automate critical operations like demultiplexing sequencing data.

With Kestra, SOPHiA GENETICS streamlined the demultiplexing step, a mandatory step to perform analyses that takes as input raw data from sequencing machines and produces ready-to-analyse genomic data. Kestra Internal Storage plays a key role in this operation. As an illustration of their efforts to enhance overall quality, rather than manually specifying graphs using flowable tasks, SOPHiA GENETICS implemented a trigger-based system. This allowed flows to use input and output data from one another. As part of the Research and Development at SOPHiA GENETICS, this process is executed several hundred times per month. The user-friendly interface and the declarative domain system language of Kestra empowered data scientists and researchers of SOPHiA GENETICS to eliminate the complexities of manual operations, resulting in a substantial increase in productivity.

## Azure Batch plugin in Kestra

To deal with such a large amount of data, SOPHIA GENETICS team take advantage of the integration of [Azure Batch plugin in Kestra](/plugins/plugin-azure).

Azure Batch is a cloud-based job scheduling service that simplifies running large-scale parallel and high-performance computing applications. With its ability to automatically scale resources, Azure Batch can efficiently manage and process large volumes of data, making it an ideal choice when looking to optimize data processing capabilities. Indeed, SOPHiA GENETICS runs large-scale jobs efficiently in the cloud while coupling other steps together thanks to Kestra versatility.


## What's Next

The combination of the Kestra orchestration engine, declarative Flow based definition and Azure Batch plugin integration offers a powerful solution for SOPHiA GENETICS to manage, store, and process large-scale data workloads, while ensuring the highest stnadards of information security. Thanks to Kestra, they further streamlined their genomic sequence analysis, which involves many tools and processes. This led to improved time management, simplified data practitioner oversight, and ultimately, enhanced overall productivity. We're very proud to have SOPHiA GENETICS as one of our power users and can't wait to continue working with them to enhance further their genomic analysis capabilities, push the boundaries of medical research, and ultimately contribute to advancements in precision healthcare.


::alert{type="info"}
If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).
If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).
::
