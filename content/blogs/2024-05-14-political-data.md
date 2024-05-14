---
title: "Political Data, Preparing for the 2024 Elections Day with Kestra"
description: "Dive into how Kestra is used by Political Data to connect every sources of demographic data and prepare for the elections day"
date: 2024-05-14T08:00:00
category: Solutions
author:
  name: Benoit Pimpaud
  image: "bpimpaud"
image: /blogs/2024-05-14-political-data.jpg
---

On Tuesday, the 5th of September, millions of Americans will vote for their next president.

Months before, primary elections and coccus are driving the opinions.

Years before, it’s all a strategy that is put in place.

All parties are gathering feedback from different states, demographics, and voter habits. They listen and adjust, do their homework to find good allies, and ultimately build a program with the ambition to keep America at the top of the world economy.

All this work before the D day needs support from several assets. One of them is data.

Data about the demographics of the population, data about housing, cohort analysis, sentiment analysis, etc.

Ultimately, these data serve for polls and models that will help the candidates to win arguments and find the polarization spot that will make them win new votes.

This is where Political Data comes in. With their team of engineers, they make campaign software and sell enhanced voter data to democratic campaigns, party organizations, and unions.

Discover how [Political Data](https://politicaldata.com/) is driving the success of the American campaign with Kestra by improving and optimizing their data stack.

## Demographic Data at the Forefront of the Battle

More than in any other industry, data corresponding to demographics and voter habits are all different.

And how do you recall all that information? hands written notes, phone calls, emails, polls, surveys, old databases and go one.

Upon raw ingestion, data need transformation quite obvious regarding the heterogenous feed of data.

These transformations are needed to enrich voter files, model demographics, understand housing geography, and perform cohort analysis.

Once data are clean and enriched, they need to be exposed to the parties. [The Democratic Party for example is using BigQuery](https://startup.jobs/data-science-lead-the-democratic-party-4996267) to run analytics for campaign and vote analysis, thus they need to connect to API and software exposing cleaned data.

## Connect Every Source Out of the Box with Kestra

Political Data has been relying on .NET codebase and database like Vertica and Microsoft ServerSQL. Back then, these systems were enough to support data initiatives. But nowadays, with velocity and volume taking a steep curve, it’s another story.

The team there has been migrating over new technologies to support these needs brought by the business.

Still, it’s never black and white. Migration is always about double-run; two systems working at a liminal place.

Political Data team used Kestra to glue things all together and finally move forward on their data initiatives.

With Vertica and MSSQL plugins out of the box, Kestra makes things easy to connect to older systems.

In fact, this is usually where data engineers fear synchronization failure, resource limitation, etc. It’s often overlooked, but most of the time engineers spend is not on building but maintaining systems up.

While a rapid implementation of a new technology might be appealing, it’s important to consider how it connects with existing systems and people's workflows. Can this technology be swapped out later without causing issues?

With one instance deployed on a Kubernetes cluster, using namespaces to split environments and GitHub to version control flows, the team is way more confident about their workflow and can sleep on two ears.

It makes them engage in new initiatives and keep their pipelines up to date.

>"We want a fast, stable, and reliable orchestration platform"

## Finally Connecting Data Science into Reality

The adoption of Kestra enable Political Data to move data science work in production.

Data scientists rely on data stored in Vertical database for training their model. The code is a mix of Python and R so it’s not straightforward to deploy in a stable environment.

With Kestra they run query on the Vertica database to get training data, and clone the data scientist repository from GitHub containing model logic and binaries. Then they use Docker to build and install Python and R dependencies needed from the model. Finally, take the result of the model inference and insert the output back into the Vertical database.

With plugins such as Docker.build, Git.Clone, Python.commands, etc. it’s easy to streamline such end-to-end pipelines in Kestra.

In addition, scheduling the retrain of the model regularly is made easy thanks to scheduling and retry strategies offered by Kestra out of the box.

>“Kestra is the fast, stable, and reliable orchestration platform we were looking for” 

> “I’ve been really enjoying Kestra so far! It’s been much simpler to use than building Airflow DAGs or using Prefect, the plugins are incredibly handy, and my CTO understands declarative YAML much better than Python”
*Sophia Alice, Data Engineer*

## What's Next

We are very proud to be used in such an important way. Political Data has partnered with progressive campaigns, labor unions, and advocacy groups for more than 30 years to help them win on Election Day and we are very proud of their usage at Kestra.

We can't way to see their progress using Kestra, their software Engineering team is working on new implementations and new integrations and we are looking forward for their advancements!

And remember! Every election is determined by the people who show up!

Join the [Slack community](https://kestra.io/slack) if you have any questions or need assistance.
Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news.
Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.



