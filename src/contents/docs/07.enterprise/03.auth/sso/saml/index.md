---
title: "SAML 2.0 SSO in Kestra: Login, Group Sync, and Single Logout"
h1: Configure SAML 2.0 Single Sign-On
description: Configure SAML 2.0 single sign-on in Kestra Enterprise. Create users at first login, sync identity provider groups, and log out of both Kestra and the identity provider.
sidebarTitle: SAML 2.0 SSO
icon: /src/contents/docs/icons/admin.svg
editions: ["EE"]
version: ">= 2.1.0"
---

Use SAML 2.0 to let users sign in to Kestra with an identity provider (IdP) such as Keycloak, Okta, Microsoft Entra ID, or ADFS.

## What SAML SSO provides

- **Login**: a **Continue with …** button on the Kestra login page starts the login on your IdP. After signing in, the user lands on the page they originally asked for.
- **User creation at first login**: Kestra creates the user the first time they sign in, as long as an IdP group, a default role, or an invitation gives them access (see [Users and groups](#users-and-groups)).
- **Group sync**: at every login, the user joins the Kestra groups whose names match the groups sent by the IdP, and leaves the IdP-managed groups the IdP no longer sends.
- **Single Logout**: logging out of Kestra also ends the user's session on the IdP.
- **Multiple webservers**: no login state is kept on a webserver, so the login can start on one webserver and finish on another behind a load balancer without sticky sessions.

Kestra connects to a single SAML IdP, configured statically in the Kestra configuration file. SAML can be enabled alongside Basic Auth and OIDC.

:::alert{type="warning"}
SAML is a licensed feature. If `kestra.security.saml.enabled` is `true` but your license does not include SAML, Kestra refuses to start with an error that begins `SAML is not supported by your license`. Contact your Kestra account team to enable it.
:::

## Prerequisites

- Kestra must be served over HTTPS. The SAML login relies on a `Secure` cookie, so Kestra refuses to start if the callback URL is not an `https://` URL.
- The IdP must be able to reach your Kestra URL through the user's browser. The IdP never calls Kestra directly.
- `kestra.encryption.secret-key` must be set (see [Encryption](../../../../configuration/05.security-and-secrets/index.md#encryption)). Without it, logging out of Kestra does not log the user out of the IdP.
- Webserver clocks must be in sync with the IdP's (NTP). Kestra tolerates a clock skew of up to five minutes.

:::alert{type="warning"}
If CORS is enabled (`micronaut.server.cors.enabled: true`) and Kestra is served on a `localhost` hostname, the IdP's login response is rejected: the browser sends it with an `Origin: null` header, which Micronaut blocks for `localhost`. Serve Kestra on another hostname, or set `micronaut.server.cors.localhost-pass-through: true`.
:::

## Create the service provider keystore

Kestra signs its login and logout requests with its own key pair, stored in a JKS keystore. Most IdPs require these requests to be signed. The keystore must hold a single key pair: Kestra uses the first private key it finds.

```bash
keytool -genkeypair \
  -alias kestra-saml \
  -keyalg RSA -keysize 2048 -sigalg SHA256withRSA \
  -validity 3650 \
  -dname "CN=kestra.example.com" \
  -storetype JKS \
  -keystore sp-keystore.jks \
  -storepass "<keystore-password>" \
  -keypass "<private-key-password>"
```

Export the certificate to register it on the IdP:

```bash
keytool -exportcert -rfc -alias kestra-saml -keystore sp-keystore.jks -storepass "<keystore-password>" > kestra-saml.crt
```

Every webserver needs a copy of the same keystore.

## Configure Kestra

SAML is configured under `kestra.security.saml`:

```yaml
kestra:
  security:
    saml:
      enabled: true
      display-name: "Company SSO"
      identity-provider-metadata-path: "https://idp.example.com/realms/kestra/protocol/saml/descriptor"
      service-provider-entity-id: "https://kestra.example.com/saml/metadata"
      callback-url: "https://kestra.example.com/saml/callback"
      keystore-path: "/etc/kestra/sp-keystore.jks"
      keystore-password: "<keystore-password>"
      private-key-password: "<private-key-password>"
      email-attribute: "email"
      first-name-attribute: "firstName"
      last-name-attribute: "lastName"
      groups-attribute: "groups"
      maximum-authentication-lifetime: 0
```

| Property | Required | Default | Description |
|---|---|---|---|
| `enabled` | Yes | `false` | Enables SAML login. |
| `display-name` | No | `SAML` | The provider name shown on the login button: **Continue with `<display-name>`**. |
| `identity-provider-metadata-path` | Yes | | The IdP metadata, as a URL or a file path. |
| `service-provider-entity-id` | Yes | | Kestra's entity ID, registered on the IdP. Using the metadata URL, `https://<kestra-host>/saml/metadata`, is a common convention. |
| `callback-url` | Yes | | Kestra's assertion consumer service URL, as the browser reaches it: `https://<kestra-host>/saml/callback`. It must start with `https://` and end with `/saml/callback`. |
| `keystore-path` | Yes | | Path to the JKS keystore holding Kestra's key pair. |
| `keystore-password` | Yes | | The keystore password. |
| `private-key-password` | Yes | | The private key password. |
| `email-attribute` | No | `email` | The assertion attribute holding the user's email. When the IdP does not send it, the NameID is used as the email. |
| `first-name-attribute` | No | `firstName` | The assertion attribute holding the first name. |
| `last-name-attribute` | No | `lastName` | The assertion attribute holding the last name. |
| `groups-attribute` | No | `groups` | The assertion attribute holding the user's group names. |
| `maximum-authentication-lifetime` | No | `0` | In seconds. Refuses a login when the user authenticated on the IdP longer ago than this. `0` accepts an IdP session of any age, like OIDC. |

If Kestra runs under a context path, include it in both URLs, for example `https://kestra.example.com/kestra/saml/callback`.

Kestra checks the configuration when a webserver starts. It refuses to start, with a message naming the problem, if:

- a required property is missing
- the callback URL is not an `https://` URL ending in `/saml/callback`
- the keystore or a metadata file cannot be read

An IdP metadata URL is only fetched at the first login, so an IdP that is briefly unreachable does not prevent Kestra from starting.

:::alert{type="warning"}
An existing Kestra user whose email matches the IdP's email attribute is linked to the IdP identity at their first SAML login, and keeps their existing groups and roles. The IdP must therefore be authoritative for this attribute: map it to a directory-managed address, never to one that users can edit themselves. Otherwise, a user could set their email in the IdP to someone else's address and sign in to Kestra as that user.
:::

## Register Kestra on the IdP

Whatever the IdP, register Kestra as a SAML service provider (also called a SAML application or relying party) with these values:

| IdP setting | Value |
|---|---|
| Entity ID, Client ID, or Identifier | The `service-provider-entity-id`, for example `https://kestra.example.com/saml/metadata` |
| Assertion Consumer Service (ACS) URL, HTTP-POST binding | The `callback-url`, for example `https://kestra.example.com/saml/callback` |
| Single Logout URL, HTTP-POST binding | `https://kestra.example.com/saml/logout`, next to the callback URL |
| Signing certificate | The certificate exported from the keystore (`kestra-saml.crt`) |
| NameID format | A persistent identifier, or the email |
| Attributes | The email, first name, last name, and groups, under the names configured in Kestra |

The IdP must sign the SAML response, the assertion, or both. It may also encrypt the assertion with Kestra's certificate.

Kestra also publishes its service provider metadata at `https://<kestra-host>/saml/metadata`, which some IdPs can import directly.

### Example: Keycloak

In the Keycloak admin console, in your realm:

1. Go to **Clients** and click **Create client**. Choose **SAML** as the client type, and set the **Client ID** to Kestra's entity ID, `https://kestra.example.com/saml/metadata`.
2. In the client's **Settings** tab:
   - Set **Valid redirect URIs** to `https://kestra.example.com/saml/callback` and `https://kestra.example.com/saml/logout`.
   - Set **Name ID format** to `email` and enable **Force name ID format**.
   - Enable **Sign documents** and **Sign assertions**, and enable **Force POST binding**.
3. In the **Keys** tab, enable **Client signature required** and import `kestra-saml.crt`.
4. In the **Advanced** tab, set **Assertion Consumer Service POST Binding URL** to `https://kestra.example.com/saml/callback` and **Logout Service POST Binding URL** to `https://kestra.example.com/saml/logout`.
5. In the **Client scopes** tab, open the client's dedicated scope and add these mappers:
   - Three **User Property** mappers, for the `email`, `firstName`, and `lastName` properties. Use the same value as the **SAML Attribute Name**, with the `Basic` name format.
   - A **Group list** mapper with the SAML attribute name `groups`, **Single Group Attribute** disabled, and **Full group path** disabled, so that Keycloak sends `admins` rather than `/admins`.

Then point Kestra to the realm's metadata:

```yaml
kestra:
  security:
    saml:
      identity-provider-metadata-path: "https://keycloak.example.com/realms/<realm>/protocol/saml/descriptor"
```

## Users and groups

### First login

Kestra identifies a user by their email, taken from the email attribute or, when the IdP does not send it, from the NameID.

When no Kestra user has this email yet, Kestra creates one only if something gives them access:

- One of the groups sent by the IdP exists in Kestra, in any tenant.
- A tenant has a [default role](../../../../configuration/05.security-and-secrets/index.md#default-role).
- The user has a pending [invitation](../../invitations/index.md), which is accepted.

Otherwise, the login is refused and no user is created.

### Returning users

At their first SAML login, Kestra stores the user's NameID. At every later login, the NameID sent by the IdP must match it, so a user is not accepted on the strength of their email alone. A transient NameID, which the IdP changes at every login, is never stored. With a transient NameID, the IdP must send the email attribute, otherwise the login is refused, and Kestra matches the user by email only.

After group sync, a returning user must still have access to a tenant, or the login is refused.

The user's first and last names are updated from the IdP at every login, when the IdP sends them.

### Group sync

Group sync never creates groups. Create the groups in Kestra first, with the same names as the IdP groups, and bind them to roles in each tenant (see [RBAC](../../rbac/index.md)).

At every login:

- The user joins every Kestra group, in every tenant, whose name matches a group sent by the IdP.
- The user leaves the groups they joined through the IdP and that the IdP no longer sends. If the IdP sends no groups attribute, the user leaves all of them.

Group memberships added manually in Kestra are kept.

## Logout

When a user who signed in through SAML logs out of Kestra, Kestra ends its own session and sends a signed logout request to the IdP, which ends the IdP session and sends the user back to Kestra. If the IdP metadata does not publish a Single Logout endpoint, or `kestra.encryption.secret-key` is not set, only the Kestra session ends.

Logouts started from the IdP or from another application are not supported: they do not end the Kestra session, which expires on its own.

## Multiple webservers

SAML works behind a load balancer without sticky sessions. The login state travels in a short-lived cookie in the user's browser, which the IdP's signed response must match, so any webserver can complete a login started on another one.

All webservers must share the same SAML configuration, the same keystore, and the same `kestra.encryption.secret-key`.

## Troubleshooting

- **Kestra does not start**: the startup error names the missing or invalid `kestra.security.saml` property.
- **The login button does not appear**: check that `kestra.security.saml.enabled` is `true` on the webservers.
- **The login fails right after signing in on the IdP**:
  - Check that the `callback-url` is exactly the URL the IdP posts to, including the scheme, host, port, and context path. Behind a reverse proxy, it is the public URL.
  - Check that the IdP signs the response or the assertion, and that its metadata publishes the certificate it signs with.
  - Check the CORS warning above if Kestra runs on `localhost`.
  - The login must be completed within five minutes of clicking the login button. Otherwise, start it again.
- **The login is refused with a permission error**: the user has no IdP group that exists in Kestra, no default role, and no invitation, or the IdP sent a different NameID than the one stored for that email. A returning user with no access to any tenant is also refused.
- **The user is not added to a group**: check that the Kestra group's name is exactly the value sent by the IdP. With Keycloak, disable **Full group path** on the group mapper.
- **`/saml/metadata` returns an error**: Kestra needs to load the IdP metadata to build its own, so check that the `identity-provider-metadata-path` is reachable from the webservers.

Kestra logs the reason a SAML login failed or was refused at the `DEBUG` level. To see these reasons, set the SAML package to `DEBUG`:

```yaml
logger:
  levels:
    io.kestra.ee.webserver.authentifications.saml: DEBUG
```

## Limitations

- A single IdP can be configured.
- Logins started from the IdP (IdP-initiated SSO) are rejected: users must start from the Kestra login page.
- Logouts started from the IdP are not supported.
