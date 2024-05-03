---
title: How to Make a HTTP Request in Kestra
icon: /docs/icons/tutorial.svg
---

How to make a HTTP Request inside of your flow.

## What is a HTTP Request?

Hypertext Transfer Protocol (better known as HTTP) requests are messages sent between a client and server to request something. 

Requests can sending or requesting data, with common ones known as GET, POST, PUT and DELETE requests. We can use these directly inside of Kestra to interact with 3rd party systems to make our workflows more powerful.

| Request Method | Description |
| - | - |
| GET | Used to retrieve data from a server |
| POST | Used to create new data on a server |
| PUT | Used to replace data on a server |
| DELETE | Used to delete data on a server |

There are many other request methods too, which you can read more about on the [MDN docs.](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

### Request Headers

Each request also has a set of Request Headers which can provide additional information for the request, such as what client the user is using, as well as the type of content that we might be sending with our request. You can read more about HTTP Headers on the [MDN docs.](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/)

### Request Body

Lastly, requests can also have a Request Body which contains all the data we want to send as part of our request. For example, if you wanted to add a user to a system, you would include their information inside of the body like name and email. These are fundamental for GET and PUT requests which are used for creating and updating data on other systems. You can read more about the Request Body on the [MDN docs.](https://developer.mozilla.org/en-US/docs/Web/API/Request/body)

## How can I make HTTP Requests?

You can make requests by putting a URL directly into your browser, especially for GET and DELETE requests, but it can be challenging to specify the body as well as headers for POST and PUT requests. There's a variety of tools that can make this easier such as cURL and Postman. 

In the example below, we can use Postman to make a POST Request to `reqres.in` which will give us some dummy data. We can use the `api/users` route to add a new user by providing a body like this:

```json
{
    "name": "Bob",
    "job": "Developer"
}
```

In Postman, we'll need to add our URL which is `https://reqres.in/api/users`. On top of that, we will need to set our request type to POST and add the body above as a `raw` option and then change the type to JSON. Once we've done this, we can press send:

![postman](/docs/how-to-guides/http/postman.png)

We can also do the same with cURL by using the command below:

```bash
curl -X POST https://reqres.in/api/users \
     -H 'Content-Type: application/json' \
     -d '{ "name": "Bob", "job": "Developer"}'
```

The arguments used are:
- `-X` which allows us to specify what type of HTTP Request we want to make, in this case a POST request, as well as the URL we will make the request to.
- `-H` which allows us to specify the headers we want to use
- `-d` which allows us to provide the body we want to send


We get the same output that we got from Postman:
```json
{ 
    "name": "Bob",
    "job":"Developer",
    "id":"651",
    "createdAt":"2024-05-03T10:16:56.938Z"
}
```

While these are very useful for testing APIs, it can be challenging to automate these requests, as well as integrate them with other platforms.

## Making HTTP Requests inside of Kestra

To make a request, you can use the task type `io.kestra.plugin.fs.http.Request` which will allow us to make requests to websites outside of Kestra.

For more information on the the task type, head over to the [dedicated documentation.](https://kestra.io/plugins/plugin-fs/tasks/http/io.kestra.plugin.fs.http.request)

### GET Request

Making a GET Request in Kestra is super useful if you want to fetch up to date data from a server and then perform computation directly on it without needing to manually intervene. 

In this example, our flow is making a GET Request to collect a CSV file from Hugging Face and print the output to the logs:

```yaml file=public/examples/flows_http_get.yml
```

We can see the response from the Logs task in the Logs page:

![http_get_logs](/docs/how-to-guides/http/http_get_logs.png)

However if we want to view the outputs from tasks without needing to use Log tasks, we can easily view our output using the Outputs page inside the UI:

![http_get_outputs](/docs/how-to-guides/http/http_get_outputs.png)

Here we are using the [Render Expression](/docs/workflow-components/outputs#using-render-expression) option to allow us to view specific outputs by using an expression, like we would to output a dynamic value in a Log task, but instead after the flow has executed. This is very useful if you're trying to debug tasks and figure out what outputs were generated.

### POST Request

Using our POST Request example from earlier, we can recreate it directly in Kestra:

```yaml file=public/examples/flows_http_post.yml
```

We can save this as an input so it's easier to remember what it is, change it when we execute and to use in multiple places if we decide to make multiple requests. 

When we make this as a POST request, this is the response we get:

![http_post_outputs](/docs/how-to-guides/http/http_post_outputs.png)

