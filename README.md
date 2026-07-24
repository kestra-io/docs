<p align="center">
  <a href="https://www.kestra.io">
    <img src="https://kestra.io/banner.png"  alt="Kestra workflow orchestrator" />
  </a>
</p>

<h1 align="center" style="border-bottom: none">
    Event-Driven Declarative Orchestrator
</h1>

<div align="center">
 <a href="https://github.com/kestra-io/kestra/releases"><img src="https://img.shields.io/github/tag-pre/kestra-io/kestra.svg?color=blueviolet" alt="Last Version" /></a>
  <a href="https://github.com/kestra-io/kestra/blob/develop/LICENSE"><img src="https://img.shields.io/github/license/kestra-io/kestra?color=blueviolet" alt="License" /></a>
  <a href="https://github.com/kestra-io/kestra/stargazers"><img src="https://img.shields.io/github/stars/kestra-io/kestra?color=blueviolet&logo=github" alt="GitHub star" /></a> <br>
<a href="https://kestra.io"><img src="https://img.shields.io/badge/Website-kestra.io-192A4E?color=blueviolet" alt="Kestra infinitely scalable orchestration and scheduling platform"></a>
<a href="https://kestra.io/slack"><img src="https://img.shields.io/badge/Slack-Join%20Community-blueviolet?logo=slack" alt="Slack"></a>
</div>

<br />

<p align="center">
  <a href="https://twitter.com/kestra_io" style="margin: 0 10px;">
        <img height="25" src="https://kestra.io/twitter.svg" alt="twitter" width="35" height="25" /></a>
  <a href="https://www.linkedin.com/company/kestra/" style="margin: 0 10px;">
        <img height="25" src="https://kestra.io/linkedin.svg" alt="linkedin" width="35" height="25" /></a> 
  <a href="https://www.youtube.com/@kestra-io" style="margin: 0 10px;">
        <img height="25" src="https://kestra.io/youtube.svg" alt="youtube" width="35" height="25" /></a>
</p>

<p align="center">
    <a href="https://go.kestra.io/video/product-overview" target="_blank">
        <img src="https://kestra.io/startvideo.png" alt="Get started in 3 minutes with Kestra" width="640px" />
    </a>
</p>
<p align="center" style="color:#CF9FFF;"><strong>Get started with Kestra in 3 minutes.</strong></p>

# Kestra Documentation

Kestra is an open-source infinitely-scalable orchestration platform enabling all engineers to manage business-critical workflows declaratively in code.

![gif](https://kestra.io/video.gif)


## Documentation

The official Kestra documentation can be found under [kestra.io/docs](https://kestra.io/docs).


## Local development of the Kestra Docs

To run the docs locally, you must have Node.js and NPM installed. Then, run the following commands:

```bash
npm install
npm run dev
```

You can access the docs at [localhost:4321](http://localhost:4321/).

## Contributing Tips

Ensure that all links, including images, are relative.

## Troubleshooting tips

Depending on your Node.js and OS version, you may encounter the following error: `Error message "error:0308010C:digital envelope routines::unsupported"`.

To resolve this issue, you will need to switch to the OpenSSL legacy provider by executing the following command: `export NODE_OPTIONS=--openssl-legacy-provider`.

If you are using an Apple Silicon Mac, please ensure that you are using Node.js version 20 or higher.

## Analytics: GTM runs in a web worker (Partytown)

Google Tag Manager and every `gtag`/tag script it loads run inside a
[Partytown](https://partytown.qwik.dev/) web worker instead of the main
thread (PageSpeed attributed ~640 ms of main-thread work and ~618 KiB of
transfer to the GTM stack). The wiring:

- `astro.config.mjs` registers the `@astrojs/partytown` integration with
  `forward: ["dataLayer.push"]`.
- `src/scripts/cookieconsent.ts` injects `gtm.js` after cookie consent with
  `type="text/partytown"` and dispatches the `ptupdate` event so Partytown
  picks up the late-added script.
- Site code must only talk to GTM through `window.dataLayer.push(...)`
  (already the case — `vue-gtm` runs with `enabled: false`). Forwarded
  pushes are queued even before the worker is ready, so ordering is safe.

### Limitations to be aware of

- **GTM Preview / Tag Assistant does not work** while GTM runs in the
  worker. Verify tags with GA4 DebugView, the network panel, or by
  temporarily loading GTM on the main thread (see rollback below).
- **Tags execute inside the worker.** Any script a tag injects is fetched
  with `fetch()` and must be CORS-readable; vendors that don't send
  `Access-Control-Allow-Origin` fail silently. Google (GA4, Ads) serves
  everything with CORS and is the officially supported case.
- **DOM-heavy tags are risky in the worker** (widgets, heatmaps,
  scroll/visibility triggers): every DOM access is proxied synchronously to
  the main thread — slower, and occasionally incompatible.
  `loadScriptsOnMainThread` in `astro.config.mjs` is the escape hatch; the
  HubSpot loader (chat widget, banners) is already pinned there.
- **`document.write`-based tags are not supported.**
- **Main-thread code cannot read GTM state** (`window.google_tag_manager`,
  `gtag(...)` return values). Only forwarded globals reach the worker.
- **New tag domains need CSP entries in `connect-src`**
  (`content-security-policy.config.js`): inside the worker, script
  downloads and beacons go through `fetch()`, which `connect-src` governs
  (on the main thread they were covered by `script-src`/`img-src`).
- kestra.io is not cross-origin isolated, so Partytown uses its service
  worker fallback (`/~partytown/partytown-sw.js`). Synchronous XHR
  deprecation warnings in the console are expected and harmless.

**When adding a tag to the GTM container**, check it against the list above
(vendor script CORS-enabled? no `document.write`? not DOM-heavy?). If in
doubt, add its script URL pattern to `loadScriptsOnMainThread` and its
domains to the CSP, then verify on a preview deploy.

**Rollback / debugging:** remove `type="text/partytown"` (and the
`ptupdate` dispatch) in `src/scripts/cookieconsent.ts` to load GTM on the
main thread again; the Partytown integration can stay enabled while unused.

## License
Apache 2.0 © [Kestra Technologies](https://kestra.io)


## Stay up to date

We release new versions on a monthly basis. To stay informed about the latest releases and receive notifications for future updates, please consider starring our [main repository](https://github.com/kestra-io/kestra).

![Star the repo](https://kestra.io/star.gif)
