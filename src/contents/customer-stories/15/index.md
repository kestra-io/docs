---
title: A Solopreneur's Journey, How NetworkLessons Leverage Kestra to Automate
  his Business
description: Discover how NetworkLessons, a leading platform in Cisco technology
  education, streamlined its operations and reduced workflow maintenance time
  by  using Kestra. Learn how Rene Molenaar, the founder, leveraged Kestra to
  automate his business.
metaTitle: A Solopreneur's Journey, How NetworkLessons Leverage Kestra to
  Automate his Business
metaDescription: Discover how NetworkLessons, a leading platform in Cisco
  technology education, streamlined its operations and reduced workflow
  maintenance time by  using Kestra. Learn how Rene Molenaar, the founder,
  leveraged Kestra to automate his business.
heroImage: ./hero.jpg
featuredImage: ./hero.jpg
logo: ./logo.svg
tasks:
  - io.kestra.plugin.core.http.Request
  - io.kestra.plugin.scripts.python.Script
  - io.kestra.plugin.aws.lambda.Invoke
kpi1: |-
  ##### Cut
  Maintenance time
kpi2: |-
  ##### Increased
  Response rate to customers
kpi3: |-
  ##### Improved
  Automation capabilities
quote: Being used to Python orchestration frameworks, using Kestra has been
  refreshing! Integration with my APIs, ChatGPT, and migrating my AWS Lambda
  functions is effortless with Kestra. It works so well. I'm sticking to Kestra!
quotePerson: Rene Molenaar
quotePersonTitle: ""
industry: Education Management
headquarter: Netherlands
solution: Educational platform that offers network lessons focused on Cisco technologies
companyName: ""
---

## NetworkLessons

NetworkLessons, a one-man business founded by Rene Molenaar, has been providing high-quality network lessons focused on Cisco technologies since 2010. Based in the Netherlands, Rene leverage technology to automate and optimize his business processes. Over the years, he has relied on AWS Lambda to handle various tasks such as customer payments, email automation, and customer support via Zendesk and forums. However, as the business grew, so did the complexity of maintaining and managing these automated workflows.

## The Challenge

As a solopreneur, Rene faced increasing challenges in managing the intricate web of AWS Lambda functions that powered his business. The maintenance overhead became a significant pain point, requiring constant attention to ensure smooth operations. "Managing all these Lambda functions was becoming a nightmare. I tried using Dagster, but the learning curve was too steep, and it introduced too much complexity for what I needed," Rene explained.

The need for a simpler, more intuitive solution became evident. Rene needed a platform that would allow him to maintain his focus on content creation and automation without getting bogged down by technical intricacies. His exploration led him to Kestra.

## The Move to Kestra
Rene's transition to Kestra marked a significant turning point in how he managed his business workflows. Kestra’s user-friendly interface and powerful orchestration capabilities made it an ideal choice for automating tasks that had previously relied on AWS Lambda. The platform's ability to seamlessly integrate with APIs, Python scripts, and ChatGPT allowed Rene to consolidate his operations under one roof.

>"Since I'm so used to Python, I also took a look at Dagster and Prefect because it sounded tempting to do everything in Python, but the whole idea of writing code locally and then publishing it to a server just didn't work as well. Rerunning tasks in Kestra works so smoothly. I'm sticking to Kestra."

With Kestra, Rene was able to automate a wide array of tasks, including:

- **Payment Automation**: Integrating Stripe webhooks with getdrip.com to automate customer payments and email notifications.
- **Customer Support**: Utilizing ChatGPT to analyze Zendesk support tickets, check the urgency of requests, generate replies, and even forward critical issues to Rene when necessary.
- **Content Creation**: Automating the process of analyzing PDFs and blog posts to extract information, build outlines, and create Cisco configuration files. Kestra also helps in checking forum posts for spelling errors, formatting code, and assessing the urgency of replies.

The simplicity of Kestra allowed Rene to not only migrate his existing AWS Lambda functions but also expand his automation capabilities without the need for additional complexity. This shift has enabled him to maintain his focus on creating valuable content for his audience while ensuring that the operational side of his business runs like a well-oiled machine.

## The Outcome
The migration to Kestra has provided Rene with a much-needed relief from the burdens of managing complex automation workflows. The platform’s seamless integration with his existing tools, including APIs and ChatGPT, has streamlined his business processes, allowing him to scale his operations with ease. And because Kestra use a declarative language for the workflows creation it's easy to pickup for any engineer familiar with CI/CD tools such as GitHub Actions

>"Being used to Python orchestration frameworks, using Kestra has been refreshing! Integration with my APIs, ChatGPT, and migrating my AWS Lambda functions is effortless with Kestra. It works so well. I'm sticking to Kestra!" Rene concluded.

## Conclusion
For Rene Molenaar and NetworkLessons, Kestra has become an indispensable tool, simplifying automation and enabling him to maintain a lean, efficient operation. As a solopreneur, Rene can now focus on what he does best—creating and delivering top-notch network lessons—while Kestra handles the complexities of automation and workflow management.
