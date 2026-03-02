---
title: HTCH Building The Best Architect Collaborative Web Tool with Kestra
description: This is the Story of HTCH a collaborative web platform for
  architects. They rely on Kestra to manage their data landscape.
metaTitle: HTCH Building The Best Architect Collaborative Web Tool with Kestra
metaDescription: This is the Story of HTCH a collaborative web platform for
  architects. They rely on Kestra to manage their data landscape.
heroImage: ./hero.jpg
featuredImage: ./hero.jpg
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.kafka.Produce
  - io.kestra.plugin.notifications.discord.DiscordExecution
  - io.kestra.plugin.aws.s3.CreateBucket
  - io.kestra.core.tasks.scripts.Python
kpi1: |-
  ##### Easy
  Kafka Integration
kpi2: |-
  ##### Terabytes
  uploaded to S3
kpi3: |-
  ##### FULL
  CI/CD from dev to Prod
quote: The flows are pretty epic, I'm quite proud of what I've created.
quotePerson: Michele Memoli
quotePersonTitle: ""
industry: SaaS
headquarter: London, United Kingdom
solution: Modelisation tool for architects
companyName: ""
---

## About HTCH

HTCH is creating a new kind of architectural design collaboration tool centered around architects. Often, architects and designers manage huge files, handle different versions, and deal with various file formats, which takes time and storage space. To solve these challenges and provide a modern approach to architects, HTCH relies on Kestra for orchestrating their new tool.

## Building an Efficient Web Platform

The core mission at HTCH is to transition native three-dimensional architectural files to a collaborative web platform, making these models accessible and efficiently managed. This goal necessitates the integration of diverse technologies to handle file uploads to cloud storage and API connections, allowing for the seamless processing and exposure of 3D models to users.

HTCH has built a strong technology stack. Kafka facilitates event communication between the web API and Kestra workflows, ensuring efficient data processing. AWS S3 serves as the cloud storage solution, housing files and data securely. Discord provides real-time notifications on file transformation outcomes for immediate feedback loops. Node and Python are employed to process and optimize files, utilizing both the gtlf-transform library and custom scripts to prepare data for web consumption. Central to orchestrating these components is Kestra, simplifying and automating workflows to ensure smooth operation across systems.

## Building an Efficient Web Platform

HTCH's mission is to transition native three-dimensional architectural files to a collaborative web platform, making these models accessible and efficiently managed. This goal necessitates the integration of diverse technologies to handle file uploads to cloud storage and API connections, allowing for seamless processing and exposure of 3D models to users.

HTCH has built a robust technology stack. Kafka facilitates event communication between the web API and Kestra workflows, ensuring efficient data processing. AWS S3 serves as the cloud storage solution, housing files and data securely. Discord provides real-time notifications on file transformation outcomes, for immediate feedback loops. Node and Python are employed to process and optimize files, utilizing both the gtlf-transform library and custom scripts to prepare data for web consumption. Central to orchestrating these components is Kestra, simplifying and automating workflows to ensure smooth operation across systems.

## Streamlining Operations with Kestra

HTCH's adoption of Kestra has been critical in enhancing its service offering. Kestra's event-trigger pattern enables automated workflows upon file uploads via the web browser. This system architecture maintains service decoupling while managing integrations through Kestra, promoting system coherence and efficiency. Moreover, Kestra's ease of installation and flexibility in connecting with S3 storage, executing custom scripts, and responding to Kafka events have expedited the development process, allowing HTCH to quickly achieve a production-grade project.

>"Things are good here: we're operational! I've got CI set up to deploy flows to dev and prod Kestra on commit. Feels really powerful."

## Future Enhancements and Optimizations

Satisfied with the current system architecture, HTCH is now refining its platform further. Plans include transitioning from Restack to AWS EC2 for Kestra deployment and optimizing costs without sacrificing functionality. This move will be accompanied by the integration of Postgres RDS for database management and continued use of S3 for internal storage, ensuring a streamlined and robust cloud-based Kestra installation. Additionally, the incorporation of Discord as a plugin within Kestra's ecosystem will enhance messaging integration, improving communication and system feedback.

## Seamless Integration Workflow

The process begins with the web application uploading large files to AWS S3. Once uploaded, the web app communicates with the API, triggering a Kafka event containing all necessary details for processing. Kestra’s Kafka Trigger then initiates the execution workflow.

Upon successful execution, another message is produced to a different Kafka topic, and a notification is sent to a dedicated Discord channel, informing the team of the successful operation. In the event of a failure, immediate notifications are sent to Discord, ensuring the team can promptly address any issues.

> "I'm quite proud of what we've created. It includes parsing input file URIs to determine file extension, folder, path, etc., and a switch statement on file extension to trigger different optimization flows."

By integrating Kestra into their workflow, HTCH has accelerated the development of their architectural design collaboration tool and how they manage and process architectural data.
