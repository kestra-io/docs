---
title: URL Configuration
icon: /docs/icons/admin.svg
---

This page describes how you can configure the URL of your Kestra webserver.

Some notification services require a URL configuration defined in order to add links from the alert message. Use a full URI here with a trailing `/` (without ui or api).

```yaml
kestra:
  url: https://www.my-host.com/kestra/
```

## Reverse Proxy Configuration
If you want to host Kestra behind a reverse proxy, make sure to use the [Server Send Event (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) to display executions in real-time.

On some reverse proxies such as Nginx, you need to disable buffering to enable real-time updates.

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
