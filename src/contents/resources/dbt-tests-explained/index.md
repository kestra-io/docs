---
title: "dbt Tests Explained: A Complete Guide to Data Quality"
description: "Understand dbt tests with our comprehensive guide, covering types, benefits, and best practices. Uncover how dbt tests validate data quality and how Kestra enhances your testing strategy."
metaTitle: "dbt Tests Explained: Types, Benefits & Best Practices"
metaDescription: "Explore dbt tests with our complete guide. Learn about generic, singular, and unit tests, their benefits for data quality, and best practices for implementation."
tag: "data"
date: 2026-07-23
slug: "dbt-tests-explained"
faq:
  - question: "What are the main types of dbt tests?"
    answer: "dbt categorizes tests into Generic, Singular, and Unit tests. Generic tests are reusable assertions defined once and applied across multiple models. Singular tests are custom SQL queries written for specific, unique conditions. Unit tests validate the logic of a dbt model by comparing its output against predefined inputs."
  - question: "Why are dbt tests crucial for data quality?"
    answer: "dbt tests act as automated checks within your data transformation pipelines. They help catch common data issues like null values, duplicates, or unexpected relationships early in the development cycle, ensuring that data moving downstream is reliable and accurate. This proactive approach prevents erroneous data from impacting business decisions."
  - question: "How do dbt unit tests differ from data tests?"
    answer: "dbt data tests (generic and singular) run against your actual production or development data to validate its quality. dbt unit tests, however, validate the transformation logic of a specific dbt model using mocked input data and expected output data. They are designed to verify the correctness of the model's code, similar to unit tests in software engineering."
  - question: "How do you define and run dbt tests?"
    answer: "dbt tests are defined in YAML files (for generic tests) or as SQL files (for singular tests) within your dbt project. You can run all tests using the `dbt test` command in your terminal. For specific tests, you can use flags like `--select` to target models or tags, making it flexible for development and CI/CD pipelines."
  - question: "Can dbt tests be integrated into a CI/CD pipeline?"
    answer: "Yes, integrating dbt tests into a CI/CD pipeline is a recommended best practice. This ensures that every code change is automatically validated against defined data quality standards before being merged into production. Tools like Kestra can orchestrate these dbt test runs within broader CI/CD workflows, providing automation and observability."
  - question: "What is referential integrity in dbt testing?"
    answer: "Referential integrity ensures that relationships between tables are maintained. In dbt, the `relationships` generic test is used to validate this, checking that all values in a foreign key column exist as primary key values in the referenced table. This is critical for maintaining the consistency and correctness of joins and analytical queries."
  - question: "How does Kestra enhance dbt testing workflows?"
    answer: "Kestra provides a powerful platform to orchestrate dbt tests, allowing you to trigger tests based on schedules, data events, or as part of a CI/CD pipeline. With Kestra's dbt plugin, you can define, execute, and monitor dbt test runs alongside other data, infrastructure, and AI tasks, centralizing your data quality and operational workflows."
---

A silent data issue—a duplicated key, an unexpected null, a broken join—can propagate through your entire pipeline and only surface when a stakeholder questions a dashboard. By then, tracing the root cause is expensive. dbt (data build tool) tests exist to catch these problems at the transformation layer, before they reach anyone downstream.

This guide covers how dbt tests work, the differences between generic, singular, and unit tests, how to define and run them, and the best practices for building a test suite that stays fast and useful as your project grows.

## What are dbt tests?

dbt tests are SQL queries that you write to check for specific conditions in your data models. If a test query returns any rows, the test fails, indicating a data quality issue. Their primary purpose is to act as assertions about your data, ensuring it meets the standards you've defined.

These tests are a fundamental part of the dbt workflow, executed after your models are built. They function as an automated quality gate, validating the output of your transformations before the data is used for analytics or other downstream processes. By integrating testing directly into the transformation layer, dbt helps data teams catch issues closer to the source, making them easier and faster to resolve. This approach is central to modern [data orchestration](https://kestra.io/resources/data/data-orchestration) and a key component of building a culture of [data observability](https://kestra.io/resources/data/data-observability).

## Why dbt tests are crucial for data quality

Implementing dbt tests is not just about finding errors; it's about building a resilient and trustworthy data platform. The benefits are significant and impact the entire data lifecycle:

*   **Prevent Data Issues:** Tests proactively identify common problems like duplicates, null values, or broken relationships before they affect downstream dashboards and reports.
*   **Build Trust in Data:** When stakeholders know that data is rigorously tested, they have more confidence in the insights derived from it. This trust is essential for making data-driven decisions.
*   **Reduce Debugging Time:** Automated tests pinpoint the exact model and condition that failed, drastically reducing the time spent hunting down the root cause of an issue.
*   **Support Data Governance:** Tests serve as executable documentation for your data quality rules. They formalize business logic and make [data quality](https://kestra.io/resources/data/data-quality) standards explicit and enforceable.
*   **Enable Agile Development:** With a solid test suite, data teams can refactor models and add new features with confidence, knowing that their tests will catch any regressions.

## dbt test types explained

dbt offers several types of tests, each suited for different validation scenarios. Understanding their differences is key to building an effective testing strategy.

### Generic tests: built-in and custom

Generic tests are predefined, reusable assertions that can be applied to any model or column. dbt comes with four built-in generic tests:

1.  **`unique`**: Asserts that all values in a column are unique.
2.  **`not_null`**: Asserts that there are no null values in a column.
3.  **`accepted_values`**: Asserts that all values in a column are within a specified list.
4.  **`relationships`**: Asserts that all values in a column exist in a corresponding column in another model, ensuring referential integrity.

You can also create your own **custom generic tests**. These are macros that you define once and can then reuse across your project, just like the built-in tests. This is powerful for enforcing organization-specific rules, such as checking for valid email formats or ensuring string lengths are within a certain range. Kestra's [dbt plugin](https://kestra.io/plugins/plugin-dbt) seamlessly executes both built-in and custom generic tests as part of your orchestrated workflows.

### Singular tests: writing assertions with SQL

Singular tests are custom SQL queries written for a specific, one-off validation that can't be easily covered by a generic test. These tests are stored in `.sql` files, typically in your `tests` directory.

A singular test is simply a `SELECT` statement. If the statement returns any rows, the test fails. This makes them incredibly flexible. You can write complex logic involving multiple tables, aggregations, or specific business rules.

For example, you might write a singular test to ensure that the total revenue for a given day in an aggregate table matches the sum of individual transactions from a source table.

### Unit tests: validating model logic

Introduced more recently, dbt unit tests are a significant departure from traditional data tests. Instead of testing the data in your warehouse, they test the transformation logic of your model itself.

Similar to unit tests in software engineering, dbt unit tests allow you to provide mock input data and define the expected output. dbt then runs your model's logic against the mock inputs and compares the result to your expected output. This isolates the model's logic from the state of your data warehouse, making tests faster, more reliable, and more focused on code correctness.

### Data tests vs. unit tests: key distinctions

It's important to understand the different roles of data tests (generic and singular) and unit tests:

| Aspect | Data Tests (Generic/Singular) | Unit Tests |
| --- | --- | --- |
| **Purpose** | Validate the quality of the data in your warehouse. | Validate the correctness of your model's transformation logic. |
| **Runs Against** | Actual data in your development or production warehouse. | Mock input data defined in your dbt project. |
| **Focus** | Data integrity, consistency, and adherence to business rules. | Code logic, handling of edge cases, and correct transformations. |
| **Speed** | Can be slow, depending on the volume of data. | Very fast, as they don't query the warehouse. |
| **Use Case** | Catching upstream data issues, ensuring referential integrity. | Verifying complex SQL logic during development and in CI/CD. |

A comprehensive dbt testing strategy uses both data tests to monitor data quality and unit tests to ensure code reliability.

## Getting started with dbt tests

Implementing dbt tests is straightforward. Here’s a quick guide to get you started.

### How to define dbt tests

Generic tests are defined in your model's `.yml` configuration file. You simply add a `data_tests` key to a model or a specific column. (Since dbt 1.8, the `tests` key was renamed to `data_tests` to distinguish data tests from unit tests—the old key still works but is considered legacy.)

```yaml
models:
  - name: stg_orders
    columns:
      - name: order_id
        data_tests:
          - unique
          - not_null
      - name: status
        data_tests:
          - accepted_values:
              values: ['placed', 'shipped', 'completed', 'returned']
      - name: customer_id
        data_tests:
          - relationships:
              to: ref('stg_customers')
              field: customer_id
```

Singular tests are defined as individual `.sql` files in your `tests` directory. For example, a file named `tests/assert_positive_total_amount.sql` would contain a query like:

```sql
-- tests/assert_positive_total_amount.sql
select
    order_id,
    total_amount
from {{ ref('fct_orders') }}
where total_amount < 0
```

### Running dbt tests with the "dbt test" command

To execute your tests, you use the `dbt test` command from your terminal.

*   `dbt test`: Runs all tests in your project.
*   `dbt test --select stg_orders`: Runs all tests defined on the `stg_orders` model.
*   `dbt test --select test_type:generic`: Runs only generic tests.
*   `dbt test --select test_type:singular`: Runs only singular tests.

Historically, dbt used `dbt test --data` for singular tests and `dbt test --schema` for generic tests, but the modern `dbt test` command runs both by default.

### Understanding test results and failures

When you run `dbt test`, the command-line output will tell you which tests passed, failed, or warned. A passing test means the query returned zero rows. A failing test means the query returned one or more rows, which represent the records that violate your assertion.

With the `--store-failures` flag (or the `store_failures: true` config), dbt persists the records that failed each test as tables in your data warehouse, making it easy to query the exact rows that caused the failure for debugging purposes. You can explore these results to quickly identify and resolve data quality issues. For hands-on examples, you can use pre-built blueprints for running dbt with [BigQuery](https://kestra.io/blueprints/dbt-bigquery), [DuckDB](https://kestra.io/blueprints/dbt-duckdb), or [Postgres](https://kestra.io/blueprints/dbt-postgres).

## Best practices for dbt testing

Writing tests is easy, but writing an effective and maintainable test suite requires strategy.

### When to use generic vs. singular tests

*   **Use generic tests for common assertions.** If you find yourself repeatedly checking for uniqueness, nulls, or accepted values, a generic test is the right choice. Always prefer a built-in or custom generic test for reusability and consistency.
*   **Use singular tests for complex, specific business logic.** If a validation requires joining multiple tables or involves a complex calculation that is unique to one model, a singular test is more appropriate.

### Tips for writing effective dbt unit tests

*   **Focus on critical and complex logic.** Don't unit test every simple `SELECT *` model. Prioritize models with complex joins, case statements, or calculations.
*   **Mock data effectively.** Your mock inputs should be minimal but comprehensive enough to cover edge cases, nulls, and different logical paths in your model.
*   **Keep tests small and fast.** The power of unit tests lies in their speed. They should be able to run quickly as part of your development and CI/CD process.

### Integrating dbt tests into your data pipeline

Automating your dbt tests is crucial for maintaining data quality at scale. The best practice is to integrate `dbt test` into your CI/CD pipeline. This ensures that every pull request is automatically validated before being merged, catching issues early. This approach aligns with [GitOps principles](https://kestra.io/resources/infrastructure/gitops), where your Git repository is the single source of truth for both your transformation code and your quality checks. You can use Kestra's ability to [sync flows from a Git repository](https://kestra.io/docs/how-to-guides/syncflows) to manage this entire process as code.

### Strategies for fewer and better data tests

It's easy to get carried away and add tests to every column. However, this can lead to a slow and noisy test suite. Instead, focus on:

*   **Prioritizing critical models:** Add comprehensive tests to your core staging and mart models that power important dashboards.
*   **Testing at the source:** Add source freshness and quality tests to catch upstream issues as early as possible.
*   **Focusing on business impact:** Write tests that validate key business assumptions and metrics.

## Advanced dbt testing concepts

As your dbt project matures, you can leverage tests for more advanced use cases.

### dbt data quality checks and governance standards

dbt tests can be the foundation of your data governance program. By defining custom generic tests, you can enforce organization-wide standards, such as PII detection, format validation (e.g., ISO date formats), or range checks on critical numeric fields.

### Validating referential integrity and null values

The `relationships` and `not_null` tests are arguably the most important for maintaining a clean data warehouse.
*   **`relationships`**: This test prevents orphaned records and ensures that joins between models will behave as expected. It's essential for any foreign key column.
*   **`not_null`**: Applying this test to primary keys and other critical columns ensures the basic integrity of your entities.

### Using dbt tests for schema evolution

dbt tests can help manage schema changes. For example, if a column is deprecated, you can add a singular test that fails if the column still contains non-null values, ensuring it's safely phased out before being removed. Similarly, you can write tests to ensure new columns are populated correctly during a migration.

## Common dbt test examples

Here are some practical examples of how to define the four built-in generic tests.

### Example of a `unique` test

This test ensures every `order_id` in the `stg_orders` model is unique.

```yaml
# models/staging/stg_orders.yml
models:
  - name: stg_orders
    columns:
      - name: order_id
        data_tests:
          - unique
```

### Example of a `not_null` test

This test ensures the `order_id` column never contains null values.

```yaml
# models/staging/stg_orders.yml
models:
  - name: stg_orders
    columns:
      - name: order_id
        data_tests:
          - not_null
```

### Example of an `accepted_values` test

This test ensures the `status` column only contains one of the four specified values.

```yaml
# models/staging/stg_orders.yml
models:
  - name: stg_orders
    columns:
      - name: status
        data_tests:
          - accepted_values:
              values: ['placed', 'shipped', 'completed', 'returned']
```

### Example of a `relationships` test

This test ensures that every `customer_id` in `stg_orders` corresponds to a valid `customer_id` in the `stg_customers` model.

```yaml
# models/staging/stg_orders.yml
models:
  - name: stg_orders
    columns:
      - name: customer_id
        data_tests:
          - relationships:
              to: ref('stg_customers')
              field: customer_id
```

## Troubleshooting dbt test failures

When a test fails, dbt provides the information you need to diagnose the problem.

### Identifying the root cause of test failures

1.  **Review the compiled SQL:** Check the `target/compiled` directory to see the exact SQL query that was executed for the failing test.
2.  **Query the failure table:** if you run tests with `--store-failures`, dbt creates a table in your warehouse containing the records that failed the test. Query this table to inspect the problematic data.
3.  **Check upstream dependencies:** The issue might not be in your model's logic but in the source data. Trace the lineage of the failing data to identify the root cause.

### Strategies for resolving data quality issues

*   **Fix the source data:** If the issue is upstream, work with the source system owners to correct it.
*   **Adjust transformation logic:** If your model's logic is incorrect, update the SQL to handle the edge case or fix the bug.
*   **Cleanse the data:** In some cases, you may need to add steps to your staging models to cleanse or filter out bad data.
*   **Update the test:** If the data is correct and your test assertion is wrong, update the test to reflect the new business reality.

## Orchestrating dbt tests with Kestra

While `dbt test` is a powerful command-line tool, its true potential is unlocked when it's automated and integrated into your broader data ecosystem. This is [why an orchestration platform like Kestra](https://kestra.io/docs/why-kestra) comes in.

Kestra allows you to [orchestrate dbt workflows](https://kestra.io/use-cases/dbt) with a simple, declarative YAML interface. You can easily create a pipeline that builds your dbt models and then runs your tests as two separate, observable steps within a single workflow. You can also build [scalable dbt workflows with Kestra's built-in Code Editor and Git Sync features](https://kestra.io/blogs/2024-10-08-dbt-kestra).

Here’s an example of a Kestra flow that runs dbt tests after building the models. Note the `WorkingDirectory` task, which ensures the cloned repository is available to the dbt tasks that follow:

```yaml
id: dbt_run_and_test
namespace: company.team

tasks:
  - id: dbt
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone_repository
        type: io.kestra.plugin.git.Clone
        url: https://github.com/my-org/dbt-project
        branch: main

      - id: dbt_run
        type: io.kestra.plugin.dbt.cli.DbtCLI
        taskRunner:
          type: io.kestra.plugin.scripts.runner.docker.Docker
        containerImage: ghcr.io/kestra-io/dbt-duckdb:latest
        commands:
          - dbt deps
          - dbt run
        profiles: |
          my_dbt_project:
            outputs:
              prod:
                type: duckdb
                path: dbt.duckdb
            target: prod

      - id: dbt_test
        type: io.kestra.plugin.dbt.cli.DbtCLI
        taskRunner:
          type: io.kestra.plugin.scripts.runner.docker.Docker
        containerImage: ghcr.io/kestra-io/dbt-duckdb:latest
        commands:
          - dbt test
        profiles: |
          my_dbt_project:
            outputs:
              prod:
                type: duckdb
                path: dbt.duckdb
            target: prod

triggers:
  - id: daily_run
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 5 * * *"
```

You could also collapse the two dbt tasks into a single `dbt build` command, which runs each model's tests immediately after the model is built—useful when you want a failing test to stop downstream models from running. And for larger projects, Kestra's `storeManifest` and `loadManifest` properties let you persist the dbt `manifest.json` between runs and execute only the models and tests that changed.

With Kestra, you can:
*   **Schedule test runs:** Execute your dbt tests on a regular schedule to continuously monitor data quality.
*   **Trigger tests based on events:** Run tests automatically when new data arrives or when another process completes.
*   **Build complex dependencies:** Chain dbt tests with other tasks, such as data ingestion, infrastructure provisioning, or sending notifications.
*   **Enhance observability:** Get a centralized view of all your pipeline executions, including test results, logs, and artifacts.
*   **Use dynamic inputs:** Parametrize your dbt test runs using [Kestra expressions](https://kestra.io/docs/expressions) to create flexible and reusable workflows.

## Conclusion

dbt tests are an essential tool for any modern data team. By embedding assertions directly into your transformation pipelines, you can build a robust, automated framework for ensuring data quality. From simple `not_null` checks to complex unit tests, dbt provides a flexible and powerful way to build trust in your data.

By combining the testing capabilities of dbt with the orchestration power of Kestra, you can take your data quality initiatives to the next level. Automating your test runs within a larger, event-driven ecosystem ensures that your data is not only transformed correctly but is also consistently reliable and ready for analysis.

To explore more resources on building reliable data pipelines, check out our [Data Engineering Resources](https://kestra.io/resources/data). If you're ready to see how Kestra can streamline your data operations, explore our platform for [declarative orchestration for modern data engineers](https://kestra.io/data).
