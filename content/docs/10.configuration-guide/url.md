---
title: URL Configuration
icon: /docs/icons/admin.svg
---

This page describes how you can configure the URL of your Kestra webserver.

## URL Configuration
Some notification services require a URL configuration defined in order to add links from the alert message. Use a full URI here with a trailing `/` (without ui or api).

```yaml
kestra:
  url: https://www.my-host.com/kestra/
```

---

## Proxy Configuration

In networking, a **forward proxy** acts on behalf of clients **controlling outbound traffic**, while a **reverse proxy** acts on behalf of servers controlling **inbound traffic** and often providing additional features such as load balancing and SSL encryption.

A (forward) proxy serves as an intermediary for requests from clients seeking resources from other servers (like Kestra API in order to retrieve blueprints and plugin documentation), while a reverse proxy sits in front of one or more web servers, intercepting requests from clients before they are sent to the server.

### Forward Proxy Configuration

In a forward proxy, the client connects to the proxy server, requesting some service (such as Kestra API) available from a different server.

In order to set up proxy in your Kestra installation, you may need to adjust the `micronaut.http.services.api` configuration to include a proxy address, username, and password. This will allow you to make requests to the Kestra API through the proxy in order to fetch data for the Kestra UI, such as e.g. Blueprints. Here is how you can adjust your `config.yml` file to include the necessary configuration:

```yaml
micronaut:
  http:
    services:
      api:
        url: https://api.kestra.io
        proxy-type: http
        proxy-address: my.company.proxy.address:port
        proxy-username: "username"
        proxy-password: "password"
        follow-redirects: true
```

Make sure to check the [Micronaut HttpClient Configuration](https://docs.micronaut.io/latest/guide/configurationreference.html#io.micronaut.http.client.DefaultHttpClientConfiguration) for more information on how to configure the `DefaultHttpClientConfiguration` in your `config.yml` file.


Some features within Kestra's embedded Code editor require network communication to work, such as the auto-update mechanism, querying and installing extensions, and telemetry. For these features to work properly in a proxy environment, you might need to adjust some firewall rules to allow communication with the Code editor. For example, Kestra's editor needs access to the `*.vscode-unpkg.net` domain when behind a proxy/firewall combination in order to load web extensions. If you are behind a firewall that needs to allow specific domains used by VS Code, make sure to allow communication to go through common hostnames such as `*.vscode-unpkg.net`. We recommend whitelisting the following URLs to make the VS Code editor work:
- api.kestra.io
- kestra-io.vscode-unpkg.net
- proxzima.vscode-unpkg.net
- az764295.vo.msecnd.net
- marketplace.visualstudio.com.

Another way to authenticate is to provide the `micronaut.http.client.proxy-authorization: Basic <base64-encoded username:password>` and
`micronaut.http.services.*.proxy-authorization: Basic <base64-encoded username:password>` so that the password is not displayed in plain text in the config file.

Check the [Network Connections in Visual Studio Code](https://code.visualstudio.com/docs/setup/network) for more information.

---

### Reverse Proxy Configuration

Reverse proxies are used to hide the identity of the server from the clients and may perform tasks such as load balancing, authentication, decryption, and caching. A reverse proxy acts on behalf of the server, taking requests from the external network, and directing them to the internal server(s) that can fulfill those requests.

If you want to host Kestra behind a reverse proxy, make sure to use the [Server Send Event (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) to display executions in real-time.

On some reverse proxies, such as Nginx, you need to disable buffering to enable real-time updates.

Here is a working configuration:

```nginx
location / {
    proxy_pass  http://localhost:<kestra_port>;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 600s;
    proxy_redirect    off;
    proxy_set_header  Host             $http_host;
    proxy_set_header  X-Real-IP        $remote_addr;
    proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
    proxy_set_header  X-Forwarded-Protocol $scheme;

    # Needed for SSE
    proxy_buffering off;
    proxy_cache off;
}
```

Should you wish to access Kestra via a separate context path via the reverse proxy, a change will be required in the Micronaut settings of Kestra.

For instance, say I wish to access the Kestra UI through mycompany.com/kestra, add the following configuration to your Kestra startup configuration:

```yaml
micronaut:
  server:
    context-path: "/kestra"
```

Then, modify your above nginx configuration to the following

```nginx
server {
    listen 80;
    server_name mycompany.com;

    location /kestra {
        proxy_pass  http://<kestra-hostname>:<kestra-port>/kestra;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 600s;
        proxy_redirect    off;
        proxy_set_header  Host             $http_host;
        proxy_set_header  X-Real-IP        $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header  X-Forwarded-Protocol $scheme;

        # Needed for SSE
        proxy_buffering off;
        proxy_cache off;
    }
}
```