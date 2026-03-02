---
title: "From Inbox to Insights AI-Enhanced Email Analysis with dlt and Kestra"
link: "Read the Guide"
href: "https://kestra.io/blogs/2023-12-04-dlt-kestra-usage"
image: ./image.jpg
publicationDate: 2023-12-03T23:00:00
addedDate: 2023-12-15T16:00:59.949
---

Combining dltHub, Kestra, and OpenAI for automated email analysis.

With two Kestra flows:

1️⃣ The main flow extracts email data from Gmail into BigQuery using dlt, and keeps an eye out for new emails.

2️⃣ The subflow uses OpenAI to summarize and analyze the sentiment of an email, loads the results into BigQuery, and then notifies about the details via Slack.
