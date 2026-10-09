# Recorded Kestra API responses

Replayed by `scripts/api-fixture-server.mjs` for two jobs. The Lighthouse
benchmark replays them so the server-rendered `/blueprints` page measures the
code instead of the latency to `api.kestra.io`. The visual regression workflow
replays them so both captures render the same `/plugins`, `/blueprints` and
`/community` data, whatever the live API says.

Each job passes its own `FIXTURE_PATHS`: Lighthouse records `/v1/blueprints` and
the two plugin index calls, the visual regression workflow adds the endpoints its sampled
SSR routes read. Everything else is proxied to the real API.

## Refreshing

Both jobs record anything in their own prefixes they have no fixture for, so a
newly sampled route records itself on one run and is frozen from the next.

The visual regression workflow never commits what it records: each capture
fetches its missing fixtures for that run only. Lighthouse uploads what it
records as an `api-fixtures` artifact to commit. To re-record the whole set,
delete the JSON files here and commit what the next runs record.

Stale fixtures freeze the page content: a layout change that only shows up at
today's blueprint count will not appear in the scores or the visual diffs until
they are refreshed.
