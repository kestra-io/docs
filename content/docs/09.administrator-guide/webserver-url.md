---
title: Webserver URL
icon: /docs/icons/admin.svg
---

Configure the URL of your Kestra webserver.

## URL configuration

Some notification services require a URL configuration to add links from alert messages. Use a full URI with a trailing `/` (excluding `ui` or `api`).

```yaml
kestra:
  url: https://www.my-host.com/kestra/
```

---

## Proxy configuration

In networking, a **forward proxy** acts on behalf of clients to control **outbound traffic**, while a **reverse proxy** acts on behalf of servers to control **inbound traffic** and may also provide features such as load balancing and SSL encryption.

A forward proxy serves as an intermediary for requests from clients seeking resources from other servers (such as the Kestra API for retrieving blueprints and plugin documentation), while a reverse proxy sits in front of one or more web servers, intercepting client requests before they reach the server.

### Forward proxy configuration

In a forward proxy, the client connects to the proxy server, requesting some service (such as Kestra API) available from a different server.

To set up a proxy in your Kestra installation, adjust the `micronaut.http.services.api` configuration to include a proxy address, username, and password. This will allow you to make requests to the Kestra API through the proxy in order to fetch data for the Kestra UI, such as Blueprints. Here is how you can adjust your `config.yml` file to include the necessary configuration:

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

Another way to authenticate is by providing `micronaut.http.client.proxy-authorization: Basic <base64-encoded username:password>` and `micronaut.http.services.*.proxy-authorization: Basic <base64-encoded username:password>`, which prevents the password from being displayed in plain text in the config file.

---

### Reverse proxy configuration

Reverse proxies hide the server’s identity from clients and may perform tasks such as load balancing, authentication, decryption, and caching. A reverse proxy acts on behalf of the server, taking requests from the external network, and directing them to the internal server(s) that can fulfill those requests.

If you want to host Kestra behind a reverse proxy, make sure to use the [Server Send Event (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) to display executions in real-time.

On some reverse proxies, such as Nginx, you need to disable buffering to enable real-time updates.

Here is a working configuration:

```bash
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

For example, if you want to access the Kestra UI through `mycompany.com/kestra`, add the following to your Kestra startup configuration:

```yaml
micronaut:
  server:
    context-path: "/kestra"
```

Then, modify your above nginx configuration to the following

```bash
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
