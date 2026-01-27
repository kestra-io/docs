---
title: Split notifications plugins (Non-Breaking Change)
icon: /src/contents/docs/icons/migration-guide.svg
release: 1.2.0
description: Guide to migrating to the split notification plugins in Kestra 1.2.0, allowing for more granular plugin management.
---

Kestra is splitting the monolithic notifications plugin into provider-specific plugins.

With this change, you can include only what you need and, in Enterprise, pin versions per provider. It is not necessary to update Flows – aliases are in place – and executions will process as usual. The update is something to keep in mind when using or searching for Notifications Plugins moving forward.

# Migrate to the split notification plugins

## New plugin packages

Replace the single notifications bundle with the individual plugins listed below. Install only the providers you use. Examples:

- Slack → [`plugin-slack`](/plugins/plugin-slack)
- Email (SMTP) → [`plugin-email`](/plugins/plugin-email)
- PagerDuty → [`plugin-pagerduty`](/plugins/plugin-pagerduty)
- Microsoft 365 / Teams → [`plugin-microsoft365`](/plugins/plugin-microsoft365)
- Google Chat → [`plugin-googleworkspace`](/plugins/plugin-googleworkspace)
- Meta (Messenger & WhatsApp) → [`plugin-meta`](/plugins/plugin-meta)

Other providers (Twilio/Segment, Opsgenie, SendGrid, Sentry, Squadcast, X, Zenduty, Zulip, Discord, Telegram, LINE, etc.) follow the same naming pattern (`plugin-<provider>`).

## What to do

1. **Update plugin sources**
   - OSS: download or reference the new provider plugins you need and remove the legacy notifications plugin from your plugins directory.
   - EE: specify the desired provider plugins (and versions) in your plugin configuration instead of the monolithic bundle. See [versioned plugins](../../../07.enterprise/05.instance/versioned-plugins/index.md) to pin and control upgrades per provider.

2. **Keep flow definitions unchanged (where possible)**
   Task and trigger type aliases remain in place, so flows generally do **not** need YAML changes as long as the matching provider plugin is installed. If a task fails to load, confirm the plugin is present and restart the worker/webserver.

3. **Review plugin defaults and secrets**
   Move any `pluginDefaults` or secrets you set for notifications to the corresponding provider plugin type (for example, Slack defaults now rely on `plugin-slack` being available).

## Notes for Enterprise deployments

- You can pin versions per provider to control blast radius (for example, keep `plugin-slack` at a known version while upgrading `plugin-email`).
- Ensure all workers in a worker group share the same plugin set so tasks resolve consistently.
