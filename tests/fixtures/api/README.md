# Recorded Kestra API responses

Replayed by `scripts/api-fixture-server.mjs` during the Lighthouse benchmark, so
the server-rendered `/blueprints` page measures the code instead of the latency
to `api.kestra.io`. Only paths under `/v1/blueprints` are recorded; every other
call is proxied to the real API.

## Refreshing

The benchmark records anything under that prefix it has no fixture for, so a new
endpoint records itself on the next run. To re-record the whole set, delete the
JSON files here, let the Lighthouse workflow run, download its `api-fixtures`
artifact and commit the contents.

Stale fixtures freeze the page content: a layout change that only shows up at
today's blueprint count will not appear in the scores until they are refreshed.
