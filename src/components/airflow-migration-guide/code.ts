export const AF_DAG_FILE = `from datetime import datetime

import requests
from airflow.sdk import dag, task


@dag(schedule="@daily", start_date=datetime(2024, 1, 1), catchup=False,
     default_args={"retries": 3})
def example_astronauts():
    @task
    def get_astronauts(**context) -> list[dict]:
        r = requests.get("http://api.open-notify.org/astros.json")
        r.raise_for_status()
        context["ti"].xcom_push(key="number_of_people_in_space", value=r.json()["number"])
        return r.json()["people"]

    @task
    def print_astronaut_craft(greeting: str, person_in_space: dict) -> None:
        print(f"{person_in_space['name']} is currently in space flying on the "
              f"{person_in_space['craft']}! {greeting}")

    print_astronaut_craft.partial(greeting="Hello! :)").expand(
        person_in_space=get_astronauts()
    )


example_astronauts()`

export const EX4_KESTRA = `id: example_astronauts
namespace: company.data

tasks:
  - id: get_astronauts
    type: io.kestra.plugin.scripts.python.Script
    dependencies:
      - requests
      - kestra
    retry:
      type: constant
      interval: PT5M
      maxAttempts: 4                 # retries: 3 → 4 attempts in total
    script: |
      import requests
      from kestra import Kestra

      r = requests.get("http://api.open-notify.org/astros.json")
      r.raise_for_status()
      Kestra.outputs({"number_of_people_in_space": r.json()["number"],
                      "people": r.json()["people"]})

  - id: print_astronaut_craft
    type: io.kestra.plugin.core.flow.Loop
    values: "{{ outputs.get_astronauts.vars.people }}"
    tasks:
      - id: greet
        type: io.kestra.plugin.core.log.Log
        message: "{{ fromJson(item.value).name }} is currently in space flying on the {{ fromJson(item.value).craft }}! Hello! :)"

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"
    recoverMissedSchedules: NONE     # catchup=False`

export const DAILY_AIRFLOW = `from datetime import datetime, timedelta

from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.providers.common.sql.operators.sql import SQLExecuteQueryOperator
from airflow.providers.slack.notifications.slack_webhook import send_slack_webhook_notification

with DAG(
    dag_id="orders_daily",
    schedule="0 6 * * *",
    start_date=datetime(2026, 1, 1),
    catchup=False,
    default_args={"retries": 2, "retry_delay": timedelta(minutes=5)},
    on_failure_callback=send_slack_webhook_notification(
        slack_webhook_conn_id="slack_alerts",
        text="orders_daily failed",
    ),
):
    stage = SQLExecuteQueryOperator(
        task_id="stage_orders",
        conn_id="warehouse",
        sql="sql/stage_orders.sql",
    )

    build = BashOperator(
        task_id="dbt_build",
        bash_command="dbt build --select orders+ --project-dir /opt/dbt --profiles-dir /opt/dbt",
    )

    stage >> build`

export const DAILY_KESTRA = `id: orders_daily
namespace: company.data

retry:
  type: constant
  interval: PT5M
  maxAttempts: 3
  behavior: RETRY_FAILED_TASK

tasks:
  - id: stage_orders
    type: io.kestra.plugin.jdbc.postgresql.Queries
    url: "{{ secret('WAREHOUSE_JDBC_URL') }}"
    username: "{{ secret('WAREHOUSE_USER') }}"
    password: "{{ secret('WAREHOUSE_PASSWORD') }}"
    sql: "{{ read('sql/stage_orders.sql') }}"

  - id: dbt_build
    type: io.kestra.plugin.dbt.cli.DbtCLI
    containerImage: ghcr.io/kestra-io/dbt-postgres:latest
    namespaceFiles:
      enabled: true
    projectDir: dbt
    profiles: |
      orders:
        target: prod
        outputs:
          prod:
            type: postgres
            host: "{{ secret('WAREHOUSE_HOST') }}"
            port: 5432
            user: "{{ secret('WAREHOUSE_USER') }}"
            password: "{{ secret('WAREHOUSE_PASSWORD') }}"
            dbname: analytics
            schema: public
            threads: 4
    commands:
      - dbt build --select orders+

errors:
  - id: slack_alert
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    messageText: "orders_daily failed on {{ errorLogs()[0].taskId }}: {{ errorLogs()[0].message }}"

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 6 * * *"
    recoverMissedSchedules: NONE`

export const USAGE_AIRFLOW = `from datetime import datetime

import requests
from airflow.decorators import dag, task
from airflow.models import Variable
from airflow.providers.postgres.hooks.postgres import PostgresHook


@dag(schedule="@hourly", start_date=datetime(2026, 1, 1), catchup=False, max_active_tasks=8)
def usage_extract():
    @task
    def list_accounts() -> list[str]:
        hook = PostgresHook(postgres_conn_id="app_db")
        return [row[0] for row in hook.get_records("SELECT id FROM accounts WHERE active")]

    @task(retries=3)
    def fetch_usage(account_id: str) -> None:
        r = requests.get(
            f"https://billing.internal/v1/accounts/{account_id}/usage",
            headers={"Authorization": f"Bearer {Variable.get('billing_token')}"},
            timeout=30,
        )
        r.raise_for_status()
        PostgresHook(postgres_conn_id="warehouse").insert_rows(
            "usage_raw", [(account_id, r.text)], target_fields=["account_id", "payload"]
        )

    fetch_usage.expand(account_id=list_accounts())


usage_extract()`

export const USAGE_KESTRA = `id: usage_extract
namespace: company.billing

tasks:
  - id: list_accounts
    type: io.kestra.plugin.jdbc.postgresql.Query
    url: "{{ secret('APP_DB_JDBC_URL') }}"
    username: "{{ secret('APP_DB_USER') }}"
    password: "{{ secret('APP_DB_PASSWORD') }}"
    sql: SELECT id FROM accounts WHERE active
    fetchType: FETCH

  - id: per_account
    type: io.kestra.plugin.core.flow.Loop
    values: "{{ outputs.list_accounts.rows | jq('.[].id') }}"
    concurrencyLimit: 8
    tasks:
      - id: fetch_usage
        type: io.kestra.plugin.core.http.Request
        uri: "https://billing.internal/v1/accounts/{{ item.value }}/usage"
        headers:
          Authorization: "Bearer {{ secret('BILLING_TOKEN') }}"
        retry:
          type: constant
          interval: PT30S
          maxAttempts: 4

      - id: store
        type: io.kestra.plugin.jdbc.postgresql.Query
        url: "{{ secret('WAREHOUSE_JDBC_URL') }}"
        username: "{{ secret('WAREHOUSE_USER') }}"
        password: "{{ secret('WAREHOUSE_PASSWORD') }}"
        sql: INSERT INTO usage_raw (account_id, payload) VALUES (:account_id, :payload)
        parameters:
          account_id: "{{ item.value }}"
          payload: "{{ outputs.fetch_usage.body }}"

triggers:
  - id: hourly
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@hourly"
    recoverMissedSchedules: NONE`

export const DATASETS_AIRFLOW = `from datetime import datetime

from airflow import DAG
from airflow.datasets import Dataset
from airflow.providers.common.sql.operators.sql import SQLExecuteQueryOperator

orders = Dataset("postgres://warehouse:5432/analytics/public/orders")

with DAG(dag_id="orders_ingest", schedule="@hourly", start_date=datetime(2026, 1, 1), catchup=False):
    SQLExecuteQueryOperator(
        task_id="merge_orders",
        conn_id="warehouse",
        sql="sql/merge_orders.sql",
        outlets=[orders],
    )

with DAG(dag_id="orders_report", schedule=[orders], start_date=datetime(2026, 1, 1), catchup=False):
    SQLExecuteQueryOperator(
        task_id="refresh_report",
        conn_id="warehouse",
        sql="REFRESH MATERIALIZED VIEW orders_daily_report",
    )`

export const INGEST_KESTRA = `id: orders_ingest
namespace: company.data

tasks:
  - id: merge_orders
    type: io.kestra.plugin.jdbc.postgresql.Queries
    url: "{{ secret('WAREHOUSE_JDBC_URL') }}"
    username: "{{ secret('WAREHOUSE_USER') }}"
    password: "{{ secret('WAREHOUSE_PASSWORD') }}"
    sql: "{{ read('sql/merge_orders.sql') }}"

triggers:
  - id: hourly
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@hourly"
    recoverMissedSchedules: NONE`

export const REPORT_KESTRA = `id: orders_report
namespace: company.data

tasks:
  - id: refresh_report
    type: io.kestra.plugin.jdbc.postgresql.Query
    url: "{{ secret('WAREHOUSE_JDBC_URL') }}"
    username: "{{ secret('WAREHOUSE_USER') }}"
    password: "{{ secret('WAREHOUSE_PASSWORD') }}"
    sql: REFRESH MATERIALIZED VIEW orders_daily_report

triggers:
  - id: after_ingest
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - namespace: company.data
        flowId: orders_ingest
        states: [SUCCESS]`
