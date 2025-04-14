---
title: Okta as an OIDC SSO Provider
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
---

# Setting Up OpenID Connect (OIDC) application with Okta and Integrating with Kestra

This guide provides step-by-step instructions to configure **OpenID Connect (OIDC) authentication using Okta** and link it to [**Kestra Enterprise**](../../01.overview/index.md) for [Single Sign-On (SSO)](./index.md).

## Prerequisites

- **Okta Developer Account**: Ensure you have an Okta Developer Account or Organization.
- **Administrator Access**: You need sufficient permissions to configure Identity Platform and manage identity providers.
- **Kestra Enterprise Edition**: Kestra SSO is available only in the Enterprise Edition.

This guide covers setup with Okta from a high level, refer to the [Okta OIDC setup documentation](https://help.okta.com/oie/en-us/content/topics/apps/apps_app_integration_wizard_oidc.htm) for more details.

## Step 1: Create an App Integration

Log in to your Okta account and select **Applications** from the left side menu.

![okta-1](/docs/enterprise/sso/okta-1.png)

Next, select **Create App Integration**, select **OIDC - OpenID Connect** as the sign-in method and **Web Application** as the application type. Select **Next**, and you will be taken to configure the general settings of the new web app integration.

![okta-2](/docs/enterprise/sso/okta-2.png)

## Step 2: Configure the Web App Integration

In the General Settings, give your App integration a name and set your grant type. For this example, we are using Authorization Code. You can open **Advanced Settings** to configure more sensitive grants. Okta has several direct auth API grants such as OTP, OOB, MFA OTP, and MFA OOB that you can select only if necessary.

![okta-3](/docs/enterprise/sso/okta-3.png)

Here, you also set the **Sign-in redirect URIs** and **Sign-out redirect URIs** for your App integration. For this example connecting to Kestra, we set a Sign-in redirect URI as `http://localhost:8080/oauth/callback/okta` and sign-out as `http://localhost:8080/logout`, but you can customize this to your environment.
Further down the page, you can configure optional **Trusted Origins** and then choose the **Assignments** and the access settings for the App integration.

We'll set the access to everyone in the organization, but you can set stricter access to only certain selected groups or skip for now. Lastly, we uncheck the setting to enable immediate access with Federation Broker Mode because we will give manual app access for this basic example. Finally, hit **Save**.

![okta-4](/docs/enterprise/sso/okta-4.png)

## Step 3: Add test user to Okta app integration

To create a test user in your Okta Directory to test your app integration, in your Okta Admin Dashboard, navigate to **Directory > People**. Select **Add Person**.

![okta-7](/docs/enterprise/sso/okta-7.png)

Enter user test details, including a password, and save the test user.

In the **Directory**, select the new user, and navigate to the **Applications** tab for the user and choose **Assign Applications**.

![okta-8](/docs/enterprise/sso/okta-8.png)

Select the Kestra application name you created and enter the added details for the user and hit **Save**.

## Step 4: Connect to Kestra

Now that Okta is set up as an OIDC provider, we need to link it to Kestra. After saving your settings in the previous step, Okta will automatically direct you to your integration. Here, you can collect your client credentials to connect to Kestra, **Client ID** and **Client Secret**.

![okta-5](/docs/enterprise/sso/okta-5.png)

After copying your Client Id and Client Secret, switch from the **General** tab to the **Sign On** tab. Here, you can configure your **OpenID Connect ID Token**, and for this example, we will edit the issuer from Dynamic to our Okta URL. Click **Save** and copy the URL to be used in our Kestra configuration along with the Client Id and Client Secret.

![okta-6](/docs/enterprise/sso/okta-6.png)

1. **Navigate to the Kestra Configuration File**:
   - Locate Kestra’s `yaml` configuration file.

2. **Add the OIDC Settings**:
   - Add the following configuration to enable Okta as an OIDC provider for Kestra:

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
- Replace `clientId` and `clientSecret` with the values from the Okta App integration copied previously.
- Replace `issuer` with your issuer URL from Application's sign on settings from before.
- Restart Kestra to apply the changes and log in.

On restart, you will now see Okta as an available login method.

![okta-9](/docs/enterprise/sso/okta-9.png)

After logging in with the created user, navigate to the **Administration > IAM** tab, and you can see un the **Users** tab that the user can sign in with basic authentication as well as Okta.

![okta-10](/docs/enterprise/sso/okta-10.png)
