---
title: "Efficient & Automated Football Data Analytics in MLS with Kestra"
description: "How a Major League Soccer club use Kestra to power its analytics initiative"
date: 2023-10-13T16:30:00
category: Solutions
author:
  name: Benoit Pimpaud
  image: "bpimpaud"
image: ./main.jpg
---

In this blog post we will show how [Kestra](https://github.com/kestra-io/kestra) is used by professional football club to find the best talents and optimize game strategy.
Indeed, taking data-driven decisions in sport is now a keystone to improve athlete performances and financial strategy. The [Major League Soccer](https://www.mlssoccer.com/) has seen a huge growth since years and many clubs didn’t wait to modernize their assets. They rely now on full football analytics teams to take important decisions regarding player performances, player transfers and finance.

## Football Analytics: What, Why & How?

Football analytics emerged from the established analytical practices in sports like baseball and basketball.
Clubs, players, competition stakeholders, and betting companies are leaning on data to drive their decisions.

The first objective of this transformation is to analyze and model the game in the most objective way. To improve sports performances. Understand players' choices, forecast team performance trends, study tactics and rules evolution, forecast injuries, optimize transfer decisions, find valuable — underrated — players, etc…

The list is infinite: the variety of data and the freedom of football make a perfect playground for data analytics.

Behind the focus on sports performance is the challenge to make data-driven decisions regarding financial decisions. Come to mind player transfers: it’s the resource with the most leverage. In the long term stakeholders would like to improve business assets such as overall revenue, marketing and technology development, staff investments, or stadium rentability.

To make this a reality, clubs and sport institutions had to invest in new types of profiles: data scientists, data engineers and even software developers.
Like more classic businesses, it involves many tools and practices. Unlike the way it came through in traditional B2B or B2C businesses, sports ventures move fast as they are quite small and pressured by weekly sport performances.
Hence, they need efficient and scalable tools, enabling them to develop insight at pace while keeping cost low.

Football clubs can rely on different type of data to improve performances and drive decisions:

* **Contextual data**: main events like goals, replacement, yellow cards, etc… It’s characterized by the minute of the event, so it's quite basic. Still useful for common statistics and general view.
* **Event data**: much detailed, they track every ball action: passes, tackles, crosses, dribbles, shoots, etc… They are characterized by coordinate data (sometimes in three dimensions), so very useful for any person looking to analyze and create models of the game. Used by football clubs, they are gathered by hand and algorithms and often exposed through provider APIs.
* **Tracking data**: every player's position and ball position at really low framerates sometimes 15 frames by seconds. Gathered either by physical sensors or software algorithms.

## Why did an MLS club choose Kestra?

The Major League of Soccer has recently been very trendy as more and more western stars come to the US to play the “beautiful game”. Today, what’s probably the best player in the soccer history is playing on the East Coast: Lionel Messi.

Strengthened by this new bang, a very near-by club has recently finished the migration and integration of all its sport data pipelines thanks to Kestra.

Their first data stack version, based on [Papermill notebooks](https://github.com/nteract/papermill), was quite hard to manage: troubleshooting errors was a long process of looking over each notebook output and dealing with complex semantic based code.
With [Kestra](https://github.com/kestra-io/kestra), they now have a full control plane, accessible from the web browser. They can create flows, monitor executions and build dependencies easily. It’s a game changer!

Thanks to Kestra, they can orchestrate several critical pipelines such as:

1. **Fetch data from multiple sources**: the club relies on different data providers to gather event, physical and scouting data. Thanks to Kestra, they can easily fetch them and orchestrate the whole ingestion pipeline into AWS S3 and a PostgreSQL server.

2. **Manage bespoke KPIs**: Kestra allows the club to manage KPIs creation for the club model, match analysis and player recruitment. They even scaled the whole system for usage in their B team which competes in MLS Next Pro. As Kestra is very versatile it can be easily used across different teams without huge work. Moreover, flow creation is easily templatizable as reusability is a core feature of Kestra.

3. **Enhance scouting process with machine learning models**: data scientists have built internal machine learning models to supplement the scouting process, player list drafts and few other applications like player identifier mapping. Managing custom scripts and serving complex machine learning models is quite straightforward. Those projects rely on both Python and R codebases and as Kestra supports Docker containers, it was effortless to orchestrate polyglot usages.

For deployment, they choose a straightforward AWS EC2 instance with PostgreSQL server, Shiny proxy to serve apps and private R or Python packages for everyday tasks.

![infra schema](./mls-schema.png)


## Next Steps

Ending a migration is always a fresher. The football analytics team is now heading to move on their own model regarding how many goals a player adds to the team while on the pitch (known as possession value model). Trying to balance between capturing both quality and style of play is quite difficult and mixing external API (OBV models) from their data provider ([StatsBomb](https://statsbomb.com)) and their home made model will definitely improve accuracy of the analysis and forecast.

We’re quite happy to have Kestra running in such a football club, assuring the orchestration of data ingestion and machine learning models. We can’t wait to see how far they will go, both technically and sportingly speaking.

Join the [Slack community](/slack) if you have any questions or need assistance. Follow us on [Twitter](https://x.com/kestra_io) for the latest news. Check the code in our [GitHub repository and give us a star](https://github.com/kestra-io/kestra) if you like the project.
