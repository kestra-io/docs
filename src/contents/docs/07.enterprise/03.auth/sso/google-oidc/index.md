---
title: Set Up Google OIDC SSO for Kestra
description: Set up Google OIDC SSO for Kestra. Authenticate users with their Google accounts using OpenID Connect for secure and easy access.
sidebarTitle: Google OIDC SSO
icon: /src/contents/docs/icons/tutorial.svg
editions: ["EE", "Cloud"]
---

## Set up Google OIDC SSO

This guide provides step-by-step instructions to configure **OpenID Connect (OIDC) authentication using Google Identity Platform** and link it to [**Kestra Enterprise**](../../../index.mdx) for [Single Sign-On (SSO)](../index.md).

## Prerequisites

- **Google Cloud Project**: Ensure you have a Google Cloud project with billing enabled.
- **Administrator Access**: You need sufficient permissions to configure Identity Platform and manage identity providers.
- **Kestra Enterprise Edition**: Kestra SSO is available only in the Enterprise Edition.

Refer to the [Google OIDC setup documentation](https://cloud.google.com/identity-platform/docs/web/oidc) for more details.

---

## Step 1: Enable Identity Platform in Google Cloud

1. **Navigate to the Identity Platform**:
   - Go to the [Identity Platform page](https://console.cloud.google.com/identity) in the Google Cloud Console.

2. **Confirm your project**:
    - Make sure that you have the correct project selected to add an identity provider to.

---

## Step 2: Add an OIDC Provider in Google Cloud

1. **Access Identity Providers**:
   - In the Identity Platform menu, select **Providers**.

2. **Add a New Provider**:
   - Click on **Add a Provider**.
   - From the list, choose **OpenID Connect**.

![add-provider](./add-provider.png)

3. **Configure the OIDC Provider**:
   - **Grant type**: Select the Code Flow grant type.
   - **Provider Name**: Enter a display name for the OIDC provider.
   - **Client ID**: Enter the **Client ID** obtained from Google.
   - **Client Secret**: Enter the **Client Secret** associated with the Client ID.
   - **Issuer URL**: Provide the **Issuer URL** (e.g., `https://accounts.google.com`).
   - **Scopes**: Specify any additional scopes required by your application.

![oidc-details](./oidc-provider.png)

4. **Save the Configuration**:
   - Click **"Save"** to add the OIDC provider to your Identity Platform configuration.

---

## Step 3: Configure Kestra to Use Google as an OIDC SSO Provider

Now that Google is set up as an OIDC provider, we need to link it to Kestra.

1. **Navigate to the Kestra Configuration File**:
   - Locate the [Kestra configuration](../../../../configuration/index.md) file.

2. **Add the OIDC Settings**:
   - Add the following configuration to enable Google as an OIDC provider for Kestra:

```yaml
 micronaut:
  security:
    oauth2:
      enabled: true
      clients:
        google:
          client-id: "{{ clientId }}"
          client-secret: "{{ clientSecret }}"
          openid:
            issuer: 'https://accounts.google.com'
```
- Replace `clientId` and `clientSecret` with the values from the Google Identity Platform.
- Update the `redirectUri` with your Kestra instance URL.
- Restart Kestra to apply the changes.

## Additional Resources

- [Managing SAML and OIDC Providers Programmatically](https://cloud.google.com/identity-platform/docs/managing-providers-programmatically)
- [Identity Platform Documentation](https://cloud.google.com/identity-platform/docs)

By following these steps, you can successfully set up OIDC authentication using Google Identity Platform, allowing users to sign in with their existing credentials via your chosen OIDC provider.
