---
title: Webserver
icon: /docs/icons/admin.svg
---

How to configure options for the webserver.


## `kestra.webserver.google-analytics`: Google Analytics ID
Add Google Analytics tracking ID (ex: `UA-12345678-1`) and report all page tracking.


## `kestra.webserver.html-head`: Append HTML tags to the webserver application
Useful for injecting CSS or JavaScript to customize a web application.

For example, here is how you can add a red banner in production environments:
```yaml
kestra:
  webserver:
    html-head: |
      <style type="text/css">
        .v-sidebar-menu .logo:after {
          background: var(--danger);
          display: block;
          content: "Local";
          position: relative;
          text-transform: uppercase;
          bottom: -65px;
          text-align: center;
          color: var(--white-always);
        }
      </style>
```
