---
title: Generate and Pseudonymize Test Data in Kestra
h1: Prepare Realistic Data for Dev and Staging Environments
description: Use the plugin-datagen plugin to generate realistic fake data from scratch or replace PII fields in existing CSV, JSON, or ION files before moving data across environments.
icon: /src/contents/docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Data Pipelines
---

Using real production data in dev or staging environments risks exposing customer PII and violating data protection regulations like GDPR and CCPA.

The `plugin-datagen` plugin solves this with two tasks — choose based on what you already have:

| Situation | Task | What it does |
|---|---|---|
| You have a production export | `Pseudonymize` | Replaces PII fields in the file with realistic fakes; all other fields pass through unchanged |
| You have no production data | `Generate` | Creates a synthetic dataset from scratch using [Datafaker](https://www.datafaker.net/documentation/expressions/) expressions |

Both tasks write output to Kestra internal storage.

## Prerequisites

- A running Kestra instance
- `plugin-datagen` installed — add it from **Administration → Plugins** or via the CLI:

```bash
kestra plugins install io.kestra.plugin:plugin-datagen:LATEST
```

---

## Path A: Replace PII in an existing export

Use `Pseudonymize` when you have a real production file and need to replace sensitive fields before it enters a dev or staging environment. The task reads the file, replaces only the fields you specify using Datafaker expressions, and writes the result back to internal storage.

- `from` — URI of the input file in Kestra internal storage (required)
- `fields` — map of field names to Datafaker expressions; unlisted fields pass through unchanged
- `contentType` — `CSV`, `JSON`, or `ION`; auto-detected from the file extension when not set
- `locale` — optional Faker locale list such as `["en", "US"]` or `["fr", "FR"]`

Outputs: `uri` (the pseudonymized file) and `count` (records processed).

### CSV export

`fields` keys match column headers exactly. The header row is preserved verbatim.

```yaml
id: pseudonymize_customer_export
namespace: company.team

tasks:
  - id: pseudonymize
    type: io.kestra.plugin.datagen.core.Pseudonymize
    from: "{{ inputs.file }}"
    contentType: CSV
    locale: ["en", "US"]
    fields:
      first_name: "#{name.firstName}"
      last_name: "#{name.lastName}"
      email: "#{internet.emailAddress}"
      phone: "#{phoneNumber.cellPhone}"
      national_id: "#{idNumber.ssnValid}"

  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "Pseudonymized {{ outputs.pseudonymize.count }} records → {{ outputs.pseudonymize.uri }}"
```

### JSON export with nested fields

Use dot-notation to address nested fields (e.g. `user.profile.email`). A path that does not exist in a given record is silently skipped — the record is written as-is.

```yaml
id: pseudonymize_json_export
namespace: company.team

tasks:
  - id: pseudonymize
    type: io.kestra.plugin.datagen.core.Pseudonymize
    from: "{{ outputs.export_task.uri }}"
    contentType: JSON
    locale: ["en", "US"]
    fields:
      "user.profile.fullName": "#{name.fullName}"
      "user.profile.email": "#{internet.emailAddress}"
      "user.address.city": "#{address.city}"
      "user.address.zipCode": "#{address.zipCode}"

  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "Pseudonymized {{ outputs.pseudonymize.count }} records → {{ outputs.pseudonymize.uri }}"
```

### Schedule a nightly refresh

Wrap `Pseudonymize` in a scheduled flow to automatically clean a daily production export before it reaches staging.

```yaml
id: nightly_pseudonymize_export
namespace: company.team

triggers:
  - id: nightly
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 2 * * *"

tasks:
  - id: pseudonymize
    type: io.kestra.plugin.datagen.core.Pseudonymize
    from: "{{ vars.daily_export_uri }}"
    contentType: CSV
    locale: ["en", "US"]
    fields:
      customer_name: "#{name.fullName}"
      customer_email: "#{internet.emailAddress}"
      customer_phone: "#{phoneNumber.cellPhone}"
      national_id: "#{idNumber.ssnValid}"

  - id: load_to_staging
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.pseudonymize.count }} records ready at {{ outputs.pseudonymize.uri }}"
```

---

## Path B: Generate a synthetic dataset from scratch

Use `Generate` with `JsonObjectGenerator` when you have no production data to start from. Define a template map and use Datafaker expressions (`#{...}`) for any field that should vary per record. Set `store: true` and `batchSize` to write a full batch to internal storage.

Outputs: `uri` (the generated ION file) and `count` (records written).

```yaml
id: generate_staging_data
namespace: company.team

tasks:
  - id: generate
    type: io.kestra.plugin.datagen.core.Generate
    store: true
    batchSize: 1000
    generator:
      type: io.kestra.plugin.datagen.generators.JsonObjectGenerator
      locale: ["en", "US"]
      value:
        customer_id: "#{number.numberBetween '10000','99999'}"
        name: "#{name.fullName}"
        email: "#{internet.emailAddress}"
        phone: "#{phoneNumber.cellPhone}"
        tier: "#{options.option 'free','pro','enterprise'}"
        address:
          city: "#{address.city}"
          zip: "#{address.zipCode}"

  - id: load_to_staging
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.generate.count }} synthetic records ready at {{ outputs.generate.uri }}"
```

:::alert{type="info"}
`Generate` always writes ION format when `store: true`. Pass `{{ outputs.generate.uri }}` to any downstream task that reads from Kestra internal storage.
:::

---

## Datafaker expressions

Both tasks use [Datafaker](https://www.datafaker.net/documentation/expressions/) expressions in the format `#{category.method}`.

| Expression | Example output |
|---|---|
| `#{name.fullName}` | `Jane Doe` |
| `#{name.firstName}` | `Jane` |
| `#{internet.emailAddress}` | `jane.doe@example.com` |
| `#{phoneNumber.cellPhone}` | `(555) 867-5309` |
| `#{address.city}` | `Springfield` |
| `#{address.zipCode}` | `90210` |
| `#{address.fullAddress}` | `123 Main St, Springfield, IL 90210` |
| `#{idNumber.ssnValid}` | `123-45-6789` |
| `#{commerce.department}` | `Electronics` |
| `#{number.numberBetween '1','100'}` | `42` |
| `#{options.option 'free','pro','enterprise'}` | `pro` |

For the full provider list, see the [Datafaker documentation](https://www.datafaker.net/documentation/expressions/).

If an expression cannot be evaluated, the raw expression string is written to the output field rather than throwing an error.

Both tasks accept a `locale` list to control name, address, and phone formatting — for example, `["fr", "FR"]` for French output or `["de", "DE"]` for German. Omit `locale` to use Faker's default (English).
