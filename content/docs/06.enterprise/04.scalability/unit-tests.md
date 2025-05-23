---
title: Unit Tests
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.23.0"
---

Build Tests to insure proper Flow behavior.

Unit tests are an efficient and productive way to test the different aspects of your flow in isolation without cluttering your instance with test executions that run every task. For example, a unit test designed to mock the notification task of a flow ensures the configuration is correct without spamming dummy notifications to the recipient. 

<div class="video-container">
  <iframe src="VIDEO_URL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Flow Unit Tests

Unit tests are connected to the specific flows they are configured for. To create a new Unit Test, access them either through the **Tests** tab on the lefthand side panel of the Kestra UI or via the **Tests** tab of a flow.

<div style="position: relative; padding-bottom: calc(48.95833333333333% + 41px); height: 0; width: 100%;"><iframe src="https://demo.arcade.software/OXqOYL6Uz47IXDMD3afL?embed&embed_mobile=inline&embed_desktop=inline&show_copy_link=true" title="Unit Test UI | Kestra EE" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>

Once tests are created, they can all be viewed from the **Tests** tab with their respective Id, Namespace, Tested Flow, and current State listed. Addtionally, tests can be run from this view with expandable results.

![Tests Interface](/docs/enterprise/unit-tests-interface.png)

## Configuration

Unit tests are written in YAML like flows, and they are comprised of `testCases` which are then made up of `fixtures` and `assertions`.

- A **fixture** refers to the setup required before a test runs, such as initializing objects or configuring environments, to ensure the test has a consistent starting state.
- An **assertion** is a statement that checks if a specific condition is true during the test. If the condition is false, the test fails, indicating an issue with the code being tested, while true indicates the expectation is met.

For example, take the following flow that does the thest listed tasks:
1. Sends a message to Slack to alert a channel that it is running
2. Extracts data from an API
3. Transforms the returned data to match a certain format
4. Loads the transformed data to a BigQuery table

```yaml
id: etl_dailyProducts_toBigQuery
namespace: company.team

tasks:
  - id: send_slack_message_started
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "https://hooks.slack.com/services/XXXX-mywebhook-XXXXX" # To use this example, replace the url with your own Slack webhook
    payload: |
      {
        "text": "{{ flow.namespace }}.{{ flow.id }}: Daily products flow has started"
      }

  - id: extract
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/json/orders.json

  - id: transform_to_products_name
    type: io.kestra.plugin.core.debug.Return
    format: "{{ fromJson(read(outputs.extract.uri)) | jq('.Account.Order[].Product[].\"Product Name\"') }}"

  - id: transform_to_uppercase
    type: io.kestra.plugin.core.debug.Return
    format: "{{ fromJson(outputs.transform_to_products_name.value) | upper }}"

  - id: load
    type: io.kestra.plugin.gcp.bigquery.Load
    from: "{{ outputs.transform_to_uppercase.value }}"
    destinationTable: "my_project.my_dataset.my_table"
    format: JSON
```

A comprehensive unit test for this flow might look like the following:

```yaml
id: etl_dailyProducts_toBigQuery_testsuite
namespace: company.team
flowId: etl_dailyProducts_toBigQuery
testCases:
  - id: extract_should_return_data
    type: io.kestra.core.tests.flow.UnitTest
    fixtures:
      tasks:
        - id: send_slack_message_started
          description: "dont send Slack message"
        - id: load
          description: "dont load data into BigQuery"
    assertions:
      - value: "{{outputs.transform_to_uppercase.value}}"
        isNotNull: true
  - id: extract_should_transform_productNames_to_uppercase_mocked
    type: io.kestra.core.tests.flow.UnitTest
    fixtures:
      tasks:
        - id: send_slack_message_started
          description: "dont send Slack message"
        - id: load
          description: "dont load data into BigQuery"
        - id: extract
          description: "dont fetch data from API"
        - id: transform_to_products_name
          outputs:
            value: |
              [
                "my-product-1"
              ]
    assertions:
      - value: "{{outputs.transform_to_uppercase.value}}"
        contains: "MY-PRODUCT-1"
```

The `id` is unique to the test suite, and the `namespace` and `flowId` must match the intended flow to be tested against. These will automatically pipe into the test when creating from a flow. The `testCases` property is composed with the aforementioned `fixtures` and `assertions`. You can design multiple tests with their own specific designs.

In the first test case, `extract_should_return_data`, the `fixtures` include tasks to replace the Slack alert and BigQuery data load so as to not clutter a Slack channel with test alert messages or a BigQuery table with test data but still test the overall design of the flow.

The `assertions` property contains the conditions for success or failure. In the example, the test aims to ensure that the outputs from the `transform_to_uppercase` task are not null. After running the test, we can see the results for the `extract_should_return_data` test by expanding the results.

![Test case 1 results](/docs/enterprise/test-case-1.png)

The assertion passed as the `extract` task downloading data from the API returned product names and was not null. Additionally, since we did not include a fixture for the `transform_to_uppercase` task, we can see the returned product names were also transformed successfully to uppercase in the assertion's actual result.

Because we wrote the test suite with two test cases, both executed during the run. For more isolation, you could separate test cases into multiple tests of the flow as needed. While we know from the previous test that the uppercase transformation was successful, you may not want to extract actual data during testing, as it could add load to an external service or send unnecessary alerts. To mitigate this and solely test the transformation, we added the `extract` and `transform_to_products_name` fixtures in the second test case, `extract_should_transform_productNames_to_uppercase_mocked`. The `extract` fixture prevents the API call, and the `transform_to_products_name` fixture simulates the return of the flow task with a mock output, `my-product-1`, all in lowercase.

After running, we can see that the assertion was successful and the actual result `MY-PRODUCT-1` was successfully transformed and matches the expected result defined in the `assertions` property of the test.

![Test case 2 results](/docs/enterprise/test-case-2.png)

## Operators

While the above example uses `isNotNull` and `contains` as assertion operators, there are many more that can be used when designing unit tests for your flows. The full list is as follows:

- endsWith
- startsWith
- contains
- equalsTo
- notEqualsTo
- greaterThan
- greaterThanOrEqualTo
- lessThan
- lesThanOrEqualTo
- in
- notIn
- isNull
- isNotNull
