---
title: "⚡️ Kestra v0.19.0 just arrived! ⚡️"
link: "Learn More"
href: "https://go.kestra.io/release-019-newsfeed"
image: ./image.png
publicationDate: 2024-10-01T16:30:00
addedDate: 2024-06-05T07:28:23.662
---

Here's what's new in the Open-Source edition:

- **UI Localization in 12 languages** — if your native language is still missing, let us know!
- **Fully redesigned Dashboard** — simpler, faster, and more informative than ever
- **System Flows** — automate maintenance tasks with dedicated flows that are hidden by default to end users.
- **Conditional Inputs** — make your workflows more dynamic by defining inputs based on **conditions**, allowing one input to depend on another via new **dependsOn** property.
- **New Log Level display** — navigate between logs across warnings, info, or debug messages with the new interactive Log Level display.
- **In-app versioned docs** — you can now access the full documentation of the version you're using, directly from the app!
- **Schedule for Later** — in the **Advanced Configuration** section of the Execute modal, you can now choose a custom date and time to schedule any flow. And you can do the same programmatically in a **Subflow** or via a new **ScheduleOnDates** trigger!

For Enterprise Edition users:

- **Backup & Restore (EE)** — protect your metadata and simplify migrations with the new Backup & Restore CLI.
- **Worker Groups UI** — track the health of your workers across multiple worker groups and get syntax validation for worker group keys in the Editor.
- **New** **PurgeAuditLogs** **task** — implement a custom log retention policy for your Audit Logs based on your compliance needs.
- **Auto-refresh token** — Kestra now automatically refreshes your auth token or session cookie if you're still active!
- **Forgot password functionality** — for basic auth users.
- **Managed Roles** — benefit from a convenient, hands-off approach to role and permission management by assigning an Admin, Editor, Launcher, Developer, or Viewer role. Managed Roles contain a set of sensible permissions automatically maintained by Kestra so that you don't need to worry about manually adding permissions for new features — Kestra keeps those roles up to date automatically.

Apart from that, we've got a bunch of **new plugins** (**a.o. NATS, Meilisearch, DataHub, JBang**), new UI pages (**a.o. a dedicated Concurrency tab on the Flow page to track active slots**), and more!
