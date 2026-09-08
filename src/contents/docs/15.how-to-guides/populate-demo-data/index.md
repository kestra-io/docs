---
title: Populate Your Instance with Sample Data
h1: Load Demo Data into Your Kestra Instance
description: Populate your Kestra instance with demo data. Use sample flows and datasets to explore features, test integrations, and validate your setup.
icon: /src/contents/docs/icons/admin.svg
stage: Getting Started
topics:
  - Kestra Concepts
---

Quickly populate your Kestra instance with realistic demo flows and executions using a single SQL script.
 
This is useful for demos, testing dashboards, taking screenshots, or exploring Kestra's UI with meaningful data.

## Prerequisites

- Kestra running via [Docker Compose](../../02.installation/03.docker-compose/index.md) with a **PostgreSQL** backend
- Access to the `postgres` container via `docker compose exec`

## What Gets Inserted

The script creates a fully populated instance with:

| Category   | Details                                                                 |
|------------|-------------------------------------------------------------------------|
| **Flows**       | 10 flows across 6 namespaces (`acme`, `acme.sales`, `acme.company.data`, `acme.operations`, `acme.marketing`, `acme.finance`) |
| **Executions**  | ~224 executions spread over the past 7 days                            |
| **States**      | Realistic distribution: ~70% SUCCESS, ~10% FAILED, ~8% WARNING, ~5% RUNNING, ~4% CANCELLED, ~3% RETRIED |
| **Timing**      | Weighted toward business hours (8 AM–6 PM), with some evening and night runs |

## How to Run

Download the SQL script and pipe it into the PostgreSQL container:

```bash
cat seed_demo_data.sql | docker compose exec -T postgres psql -U kestra
```

:::alert{type="info"}
The `-T` flag disables pseudo-TTY allocation, which is required when piping input to `docker compose exec`.
:::

## Key Properties

- **Idempotent** — uses `ON CONFLICT DO NOTHING`, so it's safe to run multiple times without duplicating data.
- **Multi-tenant aware** — all records are created under the `main` tenant ID.
- **Deterministic IDs** — execution IDs are generated with `md5(flow_id + day_offset + index)`, ensuring consistent results across runs.

## Full SQL Script

:::collapse{title="View the full SQL script"}

```sql
-- =============================================================================
-- Kestra Demo Seed Data
-- Inserts ~10 flows and ~180 executions for the past 7 days
-- Idempotent: safe to re-run (ON CONFLICT DO NOTHING)
-- =============================================================================

BEGIN;

-- ============================================================
-- FLOWS
-- ============================================================

-- 1. hello-world (acme)
INSERT INTO flows (key, value, source_code) VALUES (
  'acme_hello-world_1',
  '{"id":"hello-world","namespace":"acme","tenantId":"main","revision":1,"deleted":false,"description":"Hello World","tasks":[{"id":"first_task","type":"io.kestra.plugin.core.debug.Return","format":"thrilled"},{"id":"second_task","type":"io.kestra.plugin.scripts.shell.Commands","commands":["sleep 0.42","echo ''::{ \"outputs\":{\"returned_data\":\"mydata\"}}::''"]},{"id":"hello_world","type":"io.kestra.plugin.core.log.Log","message":"Welcome to Acme, {{ inputs.user }}!\nWe are {{ outputs.first_task.value }} to have you here!"}],"inputs":[{"id":"user","type":"STRING","defaults":"Rick Astley"}],"triggers":[{"id":"daily","type":"io.kestra.plugin.core.trigger.Schedule","cron":"0 9 * * *","disabled":true}]}'::jsonb,
  'id: hello-world
namespace: acme
description: Hello World

inputs:
  - id: user
    type: STRING
    defaults: Rick Astley

tasks:
  - id: first_task
    type: io.kestra.plugin.core.debug.Return
    format: thrilled

  - id: second_task
    type: io.kestra.plugin.scripts.shell.Commands
    commands:
      - sleep 0.42
      - echo ''::{"outputs":{"returned_data":"mydata"}}::''

  - id: hello_world
    type: io.kestra.plugin.core.log.Log
    message: |
      Welcome to Acme, {{ inputs.user }}!
      We are {{ outputs.first_task.value }} to have you here!

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: 0 9 * * *
    disabled: true'
) ON CONFLICT (key) DO NOTHING;

-- 2. customer_onboarding (acme.sales)
INSERT INTO flows (key, value, source_code) VALUES (
  'acme.sales_customer_onboarding_1',
  '{"id":"customer_onboarding","namespace":"acme.sales","tenantId":"main","revision":1,"deleted":false,"description":"Automated customer onboarding workflow","tasks":[{"id":"welcome_message","type":"io.kestra.plugin.core.log.Log","message":"Starting onboarding process"},{"id":"generate_customer_id","type":"io.kestra.plugin.core.output.OutputValues","values":{"customer_id":"ACME-20260317"}},{"id":"send_welcome_email","type":"io.kestra.plugin.core.log.Log","message":"Welcome email sent"},{"id":"complete","type":"io.kestra.plugin.core.log.Log","message":"Customer onboarding completed successfully!"}],"inputs":[{"id":"customer_name","type":"STRING","required":true},{"id":"customer_email","type":"STRING","required":true}]}'::jsonb,
  'id: customer_onboarding
namespace: acme.sales
description: Automated customer onboarding workflow

inputs:
  - id: customer_name
    type: STRING
    required: true
  - id: customer_email
    type: STRING
    required: true

tasks:
  - id: welcome_message
    type: io.kestra.plugin.core.log.Log
    message: Starting onboarding process

  - id: generate_customer_id
    type: io.kestra.plugin.core.output.OutputValues
    values:
      customer_id: ACME-20260317

  - id: send_welcome_email
    type: io.kestra.plugin.core.log.Log
    message: Welcome email sent

  - id: complete
    type: io.kestra.plugin.core.log.Log
    message: Customer onboarding completed successfully!'
) ON CONFLICT (key) DO NOTHING;

-- 3. monthly_sales_report (acme.sales)
INSERT INTO flows (key, value, source_code) VALUES (
  'acme.sales_monthly_sales_report_1',
  '{"id":"monthly_sales_report","namespace":"acme.sales","tenantId":"main","revision":1,"deleted":false,"description":"Generate monthly sales performance report","tasks":[{"id":"fetch_sales_data","type":"io.kestra.plugin.core.log.Log","message":"Fetching sales data"},{"id":"calculate_metrics","type":"io.kestra.plugin.core.output.OutputValues","values":{"total_sales":"85000","num_customers":"342","avg_deal_size":"2480"}},{"id":"generate_report","type":"io.kestra.plugin.core.log.Log","message":"Monthly Sales Report generated"}],"triggers":[{"id":"monthly_schedule","type":"io.kestra.plugin.core.trigger.Schedule","cron":"0 9 1 * *","disabled":true}]}'::jsonb,
  'id: monthly_sales_report
namespace: acme.sales
description: Generate monthly sales performance report

tasks:
  - id: fetch_sales_data
    type: io.kestra.plugin.core.log.Log
    message: Fetching sales data

  - id: calculate_metrics
    type: io.kestra.plugin.core.output.OutputValues
    values:
      total_sales: "85000"
      num_customers: "342"
      avg_deal_size: "2480"

  - id: generate_report
    type: io.kestra.plugin.core.log.Log
    message: Monthly Sales Report generated

triggers:
  - id: monthly_schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 9 1 * *"
    disabled: true'
) ON CONFLICT (key) DO NOTHING;

-- 4. data_pipeline_assets (acme.company.data)
INSERT INTO flows (key, value, source_code) VALUES (
  'acme.company.data_data_pipeline_assets_1',
  '{"id":"data_pipeline_assets","namespace":"acme.company.data","tenantId":"main","revision":1,"deleted":false,"tasks":[{"id":"create_staging_layer_asset","type":"io.kestra.plugin.jdbc.duckdb.Query","sql":"CREATE TABLE IF NOT EXISTS trips AS select VendorID, passenger_count, trip_distance from sample_data.nyc.taxi limit 10;"},{"id":"for_each","type":"io.kestra.plugin.core.flow.Loop","values":["passenger_count","trip_distance"],"tasks":[{"id":"create_mart_layer_asset","type":"io.kestra.plugin.jdbc.duckdb.Query","sql":"SELECT AVG({{item.value}}) AS avg_{{item.value}} FROM trips;"}]}]}'::jsonb,
  'id: data_pipeline_assets
namespace: acme.company.data

tasks:
  - id: create_staging_layer_asset
    type: io.kestra.plugin.jdbc.duckdb.Query
    sql: |
      CREATE TABLE IF NOT EXISTS trips AS
      select VendorID, passenger_count, trip_distance from sample_data.nyc.taxi limit 10;

  - id: for_each
    type: io.kestra.plugin.core.flow.Loop
    values:
      - passenger_count
      - trip_distance
    tasks:
      - id: create_mart_layer_asset
        type: io.kestra.plugin.jdbc.duckdb.Query
        sql: SELECT AVG({{item.value}}) AS avg_{{item.value}} FROM trips;'
) ON CONFLICT (key) DO NOTHING;

-- 5. system_health_check (acme.operations)
INSERT INTO flows (key, value, source_code) VALUES (
  'acme.operations_system_health_check_1',
  '{"id":"system_health_check","namespace":"acme.operations","tenantId":"main","revision":1,"deleted":false,"description":"Monitor system health and performance","tasks":[{"id":"check_api_endpoints","type":"io.kestra.plugin.core.log.Log","message":"Checking API endpoint availability..."},{"id":"check_database","type":"io.kestra.plugin.core.log.Log","message":"Checking database connections..."},{"id":"check_services","type":"io.kestra.plugin.core.log.Log","message":"Checking microservices status..."},{"id":"calculate_uptime","type":"io.kestra.plugin.core.output.OutputValues","values":{"api_uptime":"99.95","db_response_time":"12","services_healthy":"10"}},{"id":"generate_report","type":"io.kestra.plugin.core.log.Log","message":"System Health Report generated"}],"triggers":[{"id":"hourly_check","type":"io.kestra.plugin.core.trigger.Schedule","cron":"0 * * * *","disabled":true}]}'::jsonb,
  'id: system_health_check
namespace: acme.operations
description: Monitor system health and performance

tasks:
  - id: check_api_endpoints
    type: io.kestra.plugin.core.log.Log
    message: Checking API endpoint availability...

  - id: check_database
    type: io.kestra.plugin.core.log.Log
    message: Checking database connections...

  - id: check_services
    type: io.kestra.plugin.core.log.Log
    message: Checking microservices status...

  - id: calculate_uptime
    type: io.kestra.plugin.core.output.OutputValues
    values:
      api_uptime: "99.95"
      db_response_time: "12"
      services_healthy: "10"

  - id: generate_report
    type: io.kestra.plugin.core.log.Log
    message: System Health Report generated

triggers:
  - id: hourly_check
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 * * * *"
    disabled: true'
) ON CONFLICT (key) DO NOTHING;

-- 6. inventory_check (acme.operations)
INSERT INTO flows (key, value, source_code) VALUES (
  'acme.operations_inventory_check_1',
  '{"id":"inventory_check","namespace":"acme.operations","tenantId":"main","revision":1,"deleted":false,"description":"Daily inventory level monitoring","tasks":[{"id":"scan_inventory","type":"io.kestra.plugin.core.log.Log","message":"Scanning inventory levels across all warehouses..."},{"id":"check_levels","type":"io.kestra.plugin.core.output.OutputValues","values":{"total_items":"8542","low_stock_items":"23","out_of_stock":"2"}},{"id":"generate_alerts","type":"io.kestra.plugin.core.log.Log","message":"Inventory Status Report generated"},{"id":"notify_purchasing","type":"io.kestra.plugin.core.log.Log","message":"Reorder notifications sent to purchasing team"}],"triggers":[{"id":"daily_check","type":"io.kestra.plugin.core.trigger.Schedule","cron":"0 7 * * *","disabled":true}]}'::jsonb,
  'id: inventory_check
namespace: acme.operations
description: Daily inventory level monitoring

tasks:
  - id: scan_inventory
    type: io.kestra.plugin.core.log.Log
    message: Scanning inventory levels across all warehouses...

  - id: check_levels
    type: io.kestra.plugin.core.output.OutputValues
    values:
      total_items: "8542"
      low_stock_items: "23"
      out_of_stock: "2"

  - id: generate_alerts
    type: io.kestra.plugin.core.log.Log
    message: Inventory Status Report generated

  - id: notify_purchasing
    type: io.kestra.plugin.core.log.Log
    message: Reorder notifications sent to purchasing team

triggers:
  - id: daily_check
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 7 * * *"
    disabled: true'
) ON CONFLICT (key) DO NOTHING;

-- 7. email_campaign_trigger (acme.marketing)
INSERT INTO flows (key, value, source_code) VALUES (
  'acme.marketing_email_campaign_trigger_1',
  '{"id":"email_campaign_trigger","namespace":"acme.marketing","tenantId":"main","revision":1,"deleted":false,"description":"Trigger email marketing campaigns","tasks":[{"id":"validate_campaign","type":"io.kestra.plugin.core.log.Log","message":"Validating campaign"},{"id":"calculate_audience","type":"io.kestra.plugin.core.output.OutputValues","values":{"audience_size":"4500"}},{"id":"send_campaign","type":"io.kestra.plugin.core.log.Log","message":"Sending campaign"},{"id":"track_metrics","type":"io.kestra.plugin.core.log.Log","message":"Campaign sent successfully. Tracking metrics..."}],"inputs":[{"id":"campaign_name","type":"STRING","defaults":"Monthly Newsletter"},{"id":"target_segment","type":"SELECT","values":["All Customers","Premium Customers","Trial Users","Inactive Users"],"defaults":"All Customers"}]}'::jsonb,
  'id: email_campaign_trigger
namespace: acme.marketing
description: Trigger email marketing campaigns

inputs:
  - id: campaign_name
    type: STRING
    defaults: "Monthly Newsletter"
  - id: target_segment
    type: SELECT
    values:
      - All Customers
      - Premium Customers
      - Trial Users
      - Inactive Users
    defaults: "All Customers"

tasks:
  - id: validate_campaign
    type: io.kestra.plugin.core.log.Log
    message: Validating campaign

  - id: calculate_audience
    type: io.kestra.plugin.core.output.OutputValues
    values:
      audience_size: "4500"

  - id: send_campaign
    type: io.kestra.plugin.core.log.Log
    message: Sending campaign

  - id: track_metrics
    type: io.kestra.plugin.core.log.Log
    message: Campaign sent successfully. Tracking metrics...'
) ON CONFLICT (key) DO NOTHING;

-- 8. social_media_analytics (acme.marketing)
INSERT INTO flows (key, value, source_code) VALUES (
  'acme.marketing_social_media_analytics_1',
  '{"id":"social_media_analytics","namespace":"acme.marketing","tenantId":"main","revision":1,"deleted":false,"description":"Aggregate social media performance metrics","tasks":[{"id":"fetch_twitter_metrics","type":"io.kestra.plugin.core.log.Log","message":"Fetching Twitter/X metrics..."},{"id":"fetch_linkedin_metrics","type":"io.kestra.plugin.core.log.Log","message":"Fetching LinkedIn metrics..."},{"id":"aggregate_data","type":"io.kestra.plugin.core.output.OutputValues","values":{"total_impressions":"32000","total_engagement":"1250","follower_growth":"87"}},{"id":"generate_insights","type":"io.kestra.plugin.core.log.Log","message":"Social Media Weekly Report generated"}],"triggers":[{"id":"weekly_report","type":"io.kestra.plugin.core.trigger.Schedule","cron":"0 10 * * 1","disabled":true}]}'::jsonb,
  'id: social_media_analytics
namespace: acme.marketing
description: Aggregate social media performance metrics

tasks:
  - id: fetch_twitter_metrics
    type: io.kestra.plugin.core.log.Log
    message: Fetching Twitter/X metrics...

  - id: fetch_linkedin_metrics
    type: io.kestra.plugin.core.log.Log
    message: Fetching LinkedIn metrics...

  - id: aggregate_data
    type: io.kestra.plugin.core.output.OutputValues
    values:
      total_impressions: "32000"
      total_engagement: "1250"
      follower_growth: "87"

  - id: generate_insights
    type: io.kestra.plugin.core.log.Log
    message: Social Media Weekly Report generated

triggers:
  - id: weekly_report
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 10 * * 1"
    disabled: true'
) ON CONFLICT (key) DO NOTHING;

-- 9. invoice_processing (acme.finance)
INSERT INTO flows (key, value, source_code) VALUES (
  'acme.finance_invoice_processing_1',
  '{"id":"invoice_processing","namespace":"acme.finance","tenantId":"main","revision":1,"deleted":false,"description":"Process and validate invoices","tasks":[{"id":"validate_invoice","type":"io.kestra.plugin.core.log.Log","message":"Validating invoice"},{"id":"check_approval_needed","type":"io.kestra.plugin.core.output.OutputValues","values":{"needs_approval":"true","approver":"CFO"}},{"id":"process_payment","type":"io.kestra.plugin.core.log.Log","message":"Processing payment"},{"id":"send_confirmation","type":"io.kestra.plugin.core.log.Log","message":"Payment confirmation sent"}],"inputs":[{"id":"invoice_number","type":"STRING","required":true},{"id":"amount","type":"FLOAT","required":true},{"id":"vendor_name","type":"STRING","required":true}]}'::jsonb,
  'id: invoice_processing
namespace: acme.finance
description: Process and validate invoices

inputs:
  - id: invoice_number
    type: STRING
    required: true
  - id: amount
    type: FLOAT
    required: true
  - id: vendor_name
    type: STRING
    required: true

tasks:
  - id: validate_invoice
    type: io.kestra.plugin.core.log.Log
    message: Validating invoice

  - id: check_approval_needed
    type: io.kestra.plugin.core.output.OutputValues
    values:
      needs_approval: "true"
      approver: CFO

  - id: process_payment
    type: io.kestra.plugin.core.log.Log
    message: Processing payment

  - id: send_confirmation
    type: io.kestra.plugin.core.log.Log
    message: Payment confirmation sent'
) ON CONFLICT (key) DO NOTHING;

-- 10. quarterly_financial_report (acme.finance)
INSERT INTO flows (key, value, source_code) VALUES (
  'acme.finance_quarterly_financial_report_1',
  '{"id":"quarterly_financial_report","namespace":"acme.finance","tenantId":"main","revision":1,"deleted":false,"description":"Generate quarterly financial statements","tasks":[{"id":"gather_financial_data","type":"io.kestra.plugin.core.log.Log","message":"Gathering financial data"},{"id":"calculate_financials","type":"io.kestra.plugin.core.output.OutputValues","values":{"revenue":"842000","expenses":"510000","profit_margin":"24.5"}},{"id":"generate_report","type":"io.kestra.plugin.core.log.Log","message":"Quarterly Financial Report generated"},{"id":"distribute_report","type":"io.kestra.plugin.core.log.Log","message":"Report distributed to executive team"}],"triggers":[{"id":"quarterly_schedule","type":"io.kestra.plugin.core.trigger.Schedule","cron":"0 8 1 1,4,7,10 *","disabled":true}]}'::jsonb,
  'id: quarterly_financial_report
namespace: acme.finance
description: Generate quarterly financial statements

tasks:
  - id: gather_financial_data
    type: io.kestra.plugin.core.log.Log
    message: Gathering financial data

  - id: calculate_financials
    type: io.kestra.plugin.core.output.OutputValues
    values:
      revenue: "842000"
      expenses: "510000"
      profit_margin: "24.5"

  - id: generate_report
    type: io.kestra.plugin.core.log.Log
    message: Quarterly Financial Report generated

  - id: distribute_report
    type: io.kestra.plugin.core.log.Log
    message: Report distributed to executive team

triggers:
  - id: quarterly_schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 8 1 1,4,7,10 *"
    disabled: true'
) ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- EXECUTIONS
-- Generated via PL/pgSQL to create ~180 executions over 7 days
-- ============================================================

DO $$
DECLARE
  -- Flow definitions: flow_id, namespace, avg_duration_seconds, daily_frequency
  flow_configs TEXT[][] := ARRAY[
    ARRAY['hello-world',              'acme',               '8',    '5'],
    ARRAY['customer_onboarding',      'acme.sales',         '15',   '4'],
    ARRAY['monthly_sales_report',     'acme.sales',         '120',  '2'],
    ARRAY['data_pipeline_assets',     'acme.company.data',  '300',  '3'],
    ARRAY['system_health_check',      'acme.operations',    '25',   '8'],
    ARRAY['inventory_check',          'acme.operations',    '45',   '3'],
    ARRAY['email_campaign_trigger',   'acme.marketing',     '90',   '2'],
    ARRAY['social_media_analytics',   'acme.marketing',     '180',  '1'],
    ARRAY['invoice_processing',       'acme.finance',       '30',   '3'],
    ARRAY['quarterly_financial_report','acme.finance',       '600',  '1']
  ];
  -- State distribution weights (cumulative out of 100):
  -- SUCCESS=70, FAILED=80, WARNING=88, RUNNING=93, CANCELLED=97, RETRIED=100
  state_thresholds INT[] := ARRAY[70, 80, 88, 93, 97, 100];
  state_names TEXT[] := ARRAY['SUCCESS', 'FAILED', 'WARNING', 'RUNNING', 'CANCELLED', 'RETRIED'];

  base_date TIMESTAMP;
  exec_id TEXT;
  flow_id TEXT;
  flow_ns TEXT;
  avg_dur INT;
  daily_freq INT;
  exec_start TIMESTAMP;
  exec_end TIMESTAMP;
  duration_secs INT;
  duration_iso TEXT;
  state TEXT;
  rand_val INT;
  day_offset INT;
  hour_val INT;
  minute_val INT;
  histories_json TEXT;
  exec_json TEXT;
  hour_weight FLOAT;
  i INT;
  j INT;
BEGIN
  -- Base date = 7 days ago at midnight UTC
  base_date := date_trunc('day', NOW() - INTERVAL '7 days');

  FOR i IN 1..array_length(flow_configs, 1) LOOP
    flow_id    := flow_configs[i][1];
    flow_ns    := flow_configs[i][2];
    avg_dur    := flow_configs[i][3]::INT;
    daily_freq := flow_configs[i][4]::INT;

    FOR day_offset IN 0..6 LOOP
      -- Fixed daily count for idempotency (deterministic loop bounds)
      FOR j IN 1..daily_freq LOOP

        -- Generate hour weighted toward business hours (8-18)
        hour_weight := random();
        IF hour_weight < 0.7 THEN
          -- 70% during business hours 8-18
          hour_val := 8 + (random() * 10)::INT;
        ELSIF hour_weight < 0.9 THEN
          -- 20% during evening 18-23
          hour_val := 18 + (random() * 5)::INT;
        ELSE
          -- 10% during night 0-7
          hour_val := (random() * 7)::INT;
        END IF;
        minute_val := (random() * 59)::INT;

        exec_start := base_date + (day_offset || ' days')::INTERVAL
                      + (hour_val || ' hours')::INTERVAL
                      + (minute_val || ' minutes')::INTERVAL
                      + ((random() * 59)::INT || ' seconds')::INTERVAL;

        -- Duration: vary between 30% and 250% of avg
        duration_secs := greatest(2, (avg_dur * (0.3 + random() * 2.2))::INT);

        -- Pick state based on distribution
        rand_val := (random() * 99)::INT + 1;
        state := 'SUCCESS';
        FOR k IN 1..array_length(state_thresholds, 1) LOOP
          IF rand_val <= state_thresholds[k] THEN
            state := state_names[k];
            EXIT;
          END IF;
        END LOOP;

        -- RUNNING executions have no end date
        IF state = 'RUNNING' THEN
          exec_end := NULL;
          -- Make start_date recent (within last 30 min)
          exec_start := NOW() - (random() * 30 || ' minutes')::INTERVAL;
          duration_iso := 'PT' || (EXTRACT(EPOCH FROM (NOW() - exec_start))::INT) || 'S';
        ELSE
          exec_end := exec_start + (duration_secs || ' seconds')::INTERVAL;
          -- Build ISO 8601 duration
          IF duration_secs >= 3600 THEN
            duration_iso := 'PT' || (duration_secs / 3600) || 'H'
                            || ((duration_secs % 3600) / 60) || 'M'
                            || (duration_secs % 60) || 'S';
          ELSIF duration_secs >= 60 THEN
            duration_iso := 'PT' || (duration_secs / 60) || 'M'
                            || (duration_secs % 60) || 'S';
          ELSE
            duration_iso := 'PT' || duration_secs || 'S';
          END IF;
        END IF;

        -- Deterministic ID based on flow + day + index for idempotency
        exec_id := md5(flow_id || '_' || day_offset::TEXT || '_' || j::TEXT);

        -- Build state histories JSON
        IF state = 'RUNNING' THEN
          histories_json := '[{"state":"CREATED","date":"' || to_char(exec_start, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') || '"},'
                         || '{"state":"RUNNING","date":"' || to_char(exec_start + INTERVAL '100 milliseconds', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') || '"}]';
        ELSIF state = 'RETRIED' THEN
          histories_json := '[{"state":"CREATED","date":"' || to_char(exec_start, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') || '"},'
                         || '{"state":"RUNNING","date":"' || to_char(exec_start + INTERVAL '100 milliseconds', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') || '"},'
                         || '{"state":"FAILED","date":"' || to_char(exec_start + (duration_secs / 2 || ' seconds')::INTERVAL, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') || '"},'
                         || '{"state":"RETRYING","date":"' || to_char(exec_start + (duration_secs / 2 || ' seconds')::INTERVAL + INTERVAL '1 second', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') || '"},'
                         || '{"state":"RUNNING","date":"' || to_char(exec_start + (duration_secs / 2 || ' seconds')::INTERVAL + INTERVAL '2 seconds', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') || '"},'
                         || '{"state":"RETRIED","date":"' || to_char(exec_end, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') || '"}]';
        ELSIF state = 'CANCELLED' THEN
          histories_json := '[{"state":"CREATED","date":"' || to_char(exec_start, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') || '"},'
                         || '{"state":"RUNNING","date":"' || to_char(exec_start + INTERVAL '100 milliseconds', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') || '"},'
                         || '{"state":"KILLING","date":"' || to_char(exec_end - INTERVAL '1 second', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') || '"},'
                         || '{"state":"CANCELLED","date":"' || to_char(exec_end, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') || '"}]';
        ELSE
          -- SUCCESS, FAILED, WARNING
          histories_json := '[{"state":"CREATED","date":"' || to_char(exec_start, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') || '"},'
                         || '{"state":"RUNNING","date":"' || to_char(exec_start + INTERVAL '100 milliseconds', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') || '"},'
                         || '{"state":"' || state || '","date":"' || to_char(exec_end, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') || '"}]';
        END IF;

        -- Build full execution JSON
        exec_json := '{"id":"' || exec_id || '",'
                  || '"namespace":"' || flow_ns || '",'
                  || '"tenantId":"main",'
                  || '"flowId":"' || flow_id || '",'
                  || '"flowRevision":1,'
                  || '"deleted":false,'
                  || '"state":{'
                  || '"current":"' || state || '",'
                  || '"startDate":"' || to_char(exec_start, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') || '",'
                  || CASE WHEN exec_end IS NOT NULL
                       THEN '"endDate":"' || to_char(exec_end, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') || '",'
                       ELSE ''
                     END
                  || '"duration":"' || duration_iso || '",'
                  || '"histories":' || histories_json
                  || '},'
                  || '"taskRunList":[]}';

        INSERT INTO executions (key, value)
        VALUES (exec_id, exec_json::jsonb)
        ON CONFLICT (key) DO NOTHING;

      END LOOP; -- j (executions per day)
    END LOOP; -- day_offset
  END LOOP; -- i (flows)
END $$;

COMMIT;
```

:::
