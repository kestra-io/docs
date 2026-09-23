---
title: Set Up Okta OIDC SSO in Kestra
h1: Authenticate Users via Okta OpenID Connect
description: Set up Okta OIDC SSO for Kestra. Securely authenticate users via Okta OpenID Connect for centralized access management.
sidebarTitle: Okta OIDC SSO
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
---

## Prerequisites

- An Okta Developer Account or Organization with administrative access.

For more detail, refer to the [Okta OIDC setup documentation](https://help.okta.com/oie/en-us/content/topics/apps/apps_app_integration_wizard_oidc.htm).

## Step 1: Create an App Integration

Log in to your Okta account and select **Applications** from the left side menu.

![Okta Applications menu](./okta-1.png)

Next, select **Create App Integration**, select **OIDC - OpenID Connect** as the sign-in method and **Web Application** as the application type. Select **Next** to configure the general settings of the new web app integration.

![Create App Integration with OIDC and Web Application selected](./okta-2.png)

## Step 2: Configure the web app integration

In the General Settings, give your App integration a name and select **Authorization Code** as the grant type. Open **Advanced Settings** to configure additional grants — Okta supports direct-auth API grants such as OTP, OOB, MFA OTP, and MFA OOB.

![Okta app integration general settings with grant type selection](./okta-3.png)

Set the **Sign-in redirect URI** to `http://localhost:8080/oauth/callback/okta` and the **Sign-out redirect URI** to `http://localhost:8080/logout` (adjust to match your environment). Configure optional **Trusted Origins** and **Assignments** as needed.

Set access to **Everyone** or to a more restricted group. Uncheck **Enable immediate access with Federation Broker Mode** to control app access manually. Click **Save**.

![Sign-in redirect URIs and assignments settings for Okta app](./okta-4.png)

## Step 3: Add a test user (optional)

To verify the integration before enabling it for all users, add a test user in **Directory → People → Add Person**. Assign the Kestra application to that user from the user's **Applications** tab.

![Add Person form in Okta Directory](./okta-7.png)

![Assign Applications to user in Okta Directory](./okta-8.png)

## Step 4: Connect to Kestra

After saving, Okta redirects you to your integration, where you can find your **Client ID** and **Client Secret**.

![Client ID and Client Secret in Okta app integration](./okta-5.png)

After copying your **Client ID** and **Client Secret**, switch to the **Sign On** tab. Under **OpenID Connect ID Token**, change the issuer from Dynamic to your Okta URL. Click **Save** and copy the URL for use in your [Kestra Security and Secrets configuration](../../../../configuration/05.security-and-secrets/index.md).

![OpenID Connect ID Token issuer URL configuration in Okta](./okta-6.png)

Add the following configuration to enable Okta as an OIDC provider:

```yaml
 micronaut:
  security:
    oauth2:
      enabled: true
      clients:
        okta:
          client-id: "{{ clientId }}"
          client-secret: "{{ clientSecret }}"
          openid:
            issuer: 'https://<your-domain-id>.okta.com'
```
- Replace `clientId` and `clientSecret` with the values copied from the Okta App integration.
- Replace `issuer` with your issuer URL from the application's sign-on settings.
- Restart Kestra to apply the changes and log in.

On restart, Okta appears as an available login method.

![Okta login option on Kestra login page](./okta-9.png)

After logging in, go to **IAM → Users** to confirm the user shows both login methods in the **Login & API Tokens** column.

![User shown with Okta authentication in IAM Users tab](./okta-10.png)
