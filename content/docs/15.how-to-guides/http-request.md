---
title: How to Make a HTTP Request in Kestra
icon: /docs/icons/tutorial.svg
---

How to make a HTTP Request inside of your flow.

## What is a HTTP Request?

Hypertext Transfer Protocol (better known as HTTP) requests are messages sent between a client and server to request something. 

Requests can sending or requesting data, commonly known as GET and POST requests. We can use these directly inside of Kestra to interact with 3rd party systems to make our workflows more powerful.

## Making HTTP Requests inside of Kestra

To make a request, you can use the task type `io.kestra.plugin.fs.http.Request` which will allow us to make requests to websites outside of Kestra.

For more information on the the task type, head over to the [dedicated documentation](https://kestra.io/plugins/plugin-fs/tasks/http/io.kestra.plugin.fs.http.request)

In this example, we can make a POST Request to `reqres.in` which will give us some dummy data. We can use the `api/users` route to add a new user by providing a body like this:

```json
{
    "name": "Bob",
    "job": "Developer"
}
```

We can save this as an input so it's easier to remember what it is and to reuse if we decide to make multiple requests. 

When we make this as a POST request, this is the response we get!

![postman](/docs/how-to-guides/http/postman.png)

```yaml file=public/examples/flows_http.yml
```
