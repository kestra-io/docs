# Style harness

Mounts the components whose CSS has no other test — the header, search, docs
sidebar, both tables of contents, the markdown-actions menu, the custom select
— plus a styleguide of every class and element the global stylesheet touches.
It exists so a change to `src/assets/styles/` can be shown to move nothing,
which is what the bootstrap removal was verified against.

It is not part of the site build and ships nothing.

## Proving a stylesheet change is inert

```sh
npx vite build --config harness/vite.config.mjs
npx vite preview --config harness/vite.config.mjs &   # serves on :4173

node harness/snapshot.mjs /tmp/before.json            # on the current tree
# ...make the change, rebuild...
node harness/snapshot.mjs /tmp/after.json
node harness/diff.mjs /tmp/before.json /tmp/after.json
```

`snapshot.mjs` records ~30 computed properties and the box size for every
element inside a `real-*` wrapper and every `data-probe` in the styleguide, at
desktop and mobile widths. `diff.mjs` exits non-zero if any of them moved.

## Behaviour

```sh
node harness/behaviour.mjs
```

Drives the interactions that replaced bootstrap's JS: the `<dialog>` modals
(open by `data-modal-target`, Escape, backdrop click, scroll lock), the
`0fr`/`1fr` collapses, and the dropdowns' click-outside and Escape dismissal.

## Notes

- Astro's virtual modules and image imports are stubbed in `vite.config.mjs`;
  a bare `.svg` import has to resolve to an object, not a URL string, or
  `v-bind` spreads it character by character.
- `index.html` declares the two font variables Astro would otherwise inject.
  Without them `--ks-body-font-family` is empty and every text measurement
  shifts, which hides real regressions behind noise.
- Set `PLAYWRIGHT_CHROMIUM` if chromium lives outside playwright's own cache.

## coverage.mjs

Diffs every bootstrap-shaped class the markup uses against the CSS this repo
generates. The utilities map decides what exists, and a class it does not cover
silently does not apply, so this is the only thing that catches a trim going
one class too far.

```sh
npx sass --load-path=node_modules --load-path=src/assets/styles \
  src/assets/styles/vendor.scss /tmp/vendor.css --no-source-map
npx sass --load-path=node_modules --load-path=src/assets/styles \
  src/assets/styles/app.scss /tmp/app.css --no-source-map
node harness/coverage.mjs /tmp/vendor.css /tmp/app.css
```

Exits non-zero on anything undefined. Classes bootstrap 5 never shipped (v4
leftovers like `form-group`, out-of-range `col-md-13`) are listed separately
and ignored: they were inert before this repo owned its CSS.
