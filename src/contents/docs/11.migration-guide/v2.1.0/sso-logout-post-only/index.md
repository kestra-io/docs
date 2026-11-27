---
title: Logout Requires POST and SSO Post-Logout Redirect Changes
h1: Update SSO Logout Settings for POST-Only Logout
sidebarTitle: POST-Only Logout
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
editions: ["EE", "Cloud"]
description: In 2.1.0, the Enterprise Edition accepts logout only as a POST request. GET /logout returns 405. Register /ui as the post-logout redirect URI in your identity provider and remove get-allowed overrides from your configuration.
---

Kestra 2.1.0 accepts logout only as a `POST` request. A `GET` request to `/logout` or `/oauth/access_token` now returns `405 Method Not Allowed`.

This closes a cross-site request forgery gap: before 2.1.0, any page could sign a user out of Kestra by embedding a link or image that pointed to `/logout`.

## What changed

- **Logout endpoint**: `micronaut.security.endpoints.logout.get-allowed` and `micronaut.security.endpoints.oauth.get-allowed` now default to `false`.
- **UI**: the **Logout** button sends a `POST` request. After logout, the browser is redirected to `/ui`, or to your identity provider's end-session endpoint when you use [OIDC SSO](../../../07.enterprise/03.auth/sso/index.md).
- **Post-logout redirect URI**: unchanged since 2.0, Kestra sends `<your Kestra URL>/ui` as the `post_logout_redirect_uri` to your identity provider. Identity providers configured with `/logout` from older guides must be updated, because `/logout` no longer accepts the redirect.

## Who is affected

- **SSO users whose identity provider only allows `/logout` as a post-logout redirect URI.** Register `/ui` instead. The identity provider otherwise rejects the logout redirect, and a redirect to `/logout` now fails with `405`.
- **Configurations that set `get-allowed: true`.** Earlier versions of the [Keycloak guide](../../../07.enterprise/03.auth/sso/keycloak/index.md) included this setting. It overrides the new default, so `GET` logout keeps working, but the CSRF protection is lost.
- **Links, bookmarks, or portals that open `/logout` directly.** These send a `GET` request and now fail with `405`.

## Migrate

1. In your identity provider, set the post-logout redirect URI (called **Valid post logout redirect URIs** in Keycloak and **Sign-out redirect URIs** in Okta) to your Kestra URL followed by `/ui`, for example `https://kestra.example.com/ui`.
2. Remove `get-allowed: true` from your Kestra configuration:

   ```yaml
   micronaut:
     security:
       endpoints:
         logout:
           get-allowed: true # remove this line
   ```

3. Replace any direct links to `/logout` with the **Logout** button in the Kestra UI.

<!-- TODO(eng): confirm whether post_logout_redirect_uri includes the server context path when Kestra is served under a sub-path (redirect.logout is a bare /ui). Source: kestra-ee#10702, fixes kestra-ee#10685. -->
