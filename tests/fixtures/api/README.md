# Recorded Kestra API responses

Replayed by `scripts/api-fixture-server.mjs` for two jobs. The Lighthouse
benchmark replays them so the server-rendered `/blueprints` page measures the
code instead of the latency to `api.kestra.io`. The visual-snapshot workflow
replays them so a plugin release does not repaint the `/plugins`, `/blueprints`
and `/community` baselines.

Each job passes its own `FIXTURE_PATHS`: Lighthouse records `/v1/blueprints` and
the two plugin index calls, the snapshot workflow adds the endpoints its sampled
SSR routes read. Everything else is proxied to the real API.

## Refreshing

Both jobs record anything in their own prefixes they have no fixture for, so a
newly sampled route records itself on one run and is frozen from the next.

To re-record the whole set, run `Update Linux Visual Snapshots` with
`refresh_api_fixtures` enabled: it clears the JSON files here, records what the
build and the screenshot run ask for, and commits the result with the refreshed
baselines. That also drops the blueprint detail responses only Lighthouse reads,
which its next run re-records into an `api-fixtures` artifact to commit.

`/v1/plugins/pluginsInformation` and `/v1/plugins/metadata` are recorded with
every `icon` swapped for one grey placeholder: the icons were ~15 MB and
Lighthouse never reads these two, so only the baselines show the difference.

Stale fixtures freeze the page content: a layout change that only shows up at
today's blueprint count will not appear in the scores or the baselines until
they are refreshed.
