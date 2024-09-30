---
title: Make HTTP Requests inside of your flows
icon: /docs/icons/tutorial.svg
stage: Getting Started
topics:
  - Integrations
---

Make HTTP Requests to fetch data and generate outputs.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/sI-BDbb1aPI?si=ygTv9ZVoHPwYMaty" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

You can make HTTP Requests directly inside of a flow as well as get outputs from the responses. In this guide, we'll walk you through what HTTP Requests are and how you can use the most common request methods inside of Kestra.

## What is a HTTP Request?

Hypertext Transfer Protocol (better known as HTTP) [requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages#http_requests) are messages sent between a client and server to request something.

Requests can send or request data, with common methods known as GET, POST, PUT and DELETE requests. We can use these directly inside of Kestra to interact with 3rd party systems to make our workflows more powerful.

| Request Method | Description |
| - | - |
| GET | Used to retrieve data from a server |
| POST | Used to create new data on a server |
| PUT | Used to replace data on a server |
| DELETE | Used to delete data on a server |

There are many other request methods too, which you can read more about on the [MDN docs.](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

When you make a request, you will receive a [response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages#http_responses) from the server with the answer. We can use this answer with Kestra to create powerful automations. However first, let's understand a bit more about what makes up a request!

### Status Code

When you make a request, you'll receive a response with a status code. This will tell you if your request was successful or not. The format follows:

| Status Codes | Description |
| - | - |
| 100 - 199 | Informational |
| 200 - 299 | Successful |
| 300 - 399 | Redirection |
| 400 - 499 | Client error |
| 500 - 599 | Server error |

A few common ones you might have seen include:
- 200: OK - Request was successful.
- 404: Not Found - Request reached the server but the resource wasn't found. A common one you see when you go to a page on a website that doesn't exist.
- 500: Internal Server Error - Request reached the server but the server was unable to process it. Usually means the server has thrown an error.

You can read the full list of status codes on the [MDN docs.](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

### Headers

Each request also has a set of Request Headers which can provide additional information for the request, such as what client the user is using, as well as the type of content that sent with our request. You can read more about HTTP Headers on the [MDN docs.](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/) The response will also have headers following the same structure.

### Body

Lastly, requests can also have a Request Body which contains all the data we want to send as part of our request. For example, if you wanted to add a user to a system, you would include their information inside of the body like name and email. These are fundamental for POST and PUT requests which are used for creating and updating data on other systems, but other methods like GET don't have them. You can read more about the Request Body on the [MDN docs.](https://developer.mozilla.org/en-US/docs/Web/API/Request/body)

When you receive your [response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages#body_2), it might have a body, for example a GET Request. This is helpful as you can receive data which you can use in your workflows, such as a JSON.

## How can I make HTTP Requests?

You can make requests by putting a URL directly into your browser, especially for GET requests, but it can be challenging to specify the body and headers for other methods, such as POST and PUT requests. There's a variety of tools that can make this easier such as [Postman](https://www.postman.com/) and [cURL](https://curl.se/).

In the example below, we can use Postman to make a POST Request to [dummyjson.com](https://dummyjson.com) which will give us some dummy data. We can use the `/products/add` route to add a new product by providing a body like this:

```json
{
    "title": "Kestra Pen"
}
```

In Postman, we'll need to add our URL: `https://dummyjson.com/products/add`. On top of that, we will need to set our request type to `POST` and add the body above as a `raw` option and then change the type to JSON. Once we've done this, we can press send:

![postman](/docs/how-to-guides/http/postman.png)

We can also do the same with cURL by using the command below:

```bash
curl -X POST https://dummyjson.com/products/add \
     -H 'Content-Type: application/json' \
     -d '{ "title": "Kestra Pen" }'
```

The arguments used are:
- `-X {method} {url}` which allows us to specify what type of HTTP method we want to make, in this case a POST request, as well as the URL we will make the request to.
- `-H {header-type}` which allows us to specify the headers we want to use
- `-d {body}` which allows us to provide the body we want to send

We get the same response that we got in Postman:
```json
{
    "id": 101,
    "title": "Kestra Pen"
}
```

While these tools are very useful for testing APIs, it can be challenging to automate requests, as well as integrate them with other platforms.

## Making HTTP Requests inside of Kestra

This is where Kestra comes into enable us to automate requests with other tasks! Below, we'll cover how you can make a `GET`, `POST`, `PUT`, and `DELETE` request directly in your flow.

To make a request, you can use the task type `io.kestra.plugin.core.http.Request`. For more information on the the task type, head over to the [dedicated documentation.](/plugins/plugin-fs/tasks/http/io.kestra.plugin.core.http.Request)

### GET Request

Making a `GET` Request in Kestra is super useful if you want to fetch up-to-date data from a server and then perform computation directly on it without needing to manually intervene.

In this example, our flow is making a `GET` Request to collect a JSON of products and print the output to the logs:

```yaml
id: http_get_request_example
namespace: company.team
description: Make a HTTP Request and Handle the Output

tasks:
  - id: send_data
    type: io.kestra.plugin.core.http.Request
    uri: https://dummyjson.com/products
    method: GET
    contentType: application/json

  - id: print_status
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.send_data.body }}"

```

We can see the response from the Logs task in the Logs page:

![http_get_logs](/docs/how-to-guides/http/http_get_logs.png)

However if we want to view the outputs from tasks without needing to use Log tasks, we can easily view our output using the Outputs page inside the UI:

![http_get_outputs](/docs/how-to-guides/http/http_get_outputs.png)

Here, we are using the [Debug Outputs](../04.workflow-components/06.outputs.md#using-render-expression) option to allow us to view specific outputs by using an expression, like we would to output a dynamic value in a Log task, but after the flow has executed. This is very useful if you're trying to debug tasks and figure out what outputs were generated.

### POST Request

Using our `POST` Request example from earlier, we can recreate it directly in Kestra. We can use our `GET` request example above as a template and build from that. We'll need to change the following properties:
- `uri` will change to `https://dummyjson.com/products/add`
- `method` will change to `POST`
- `body` will be added where we'll add the data we want to send to the server


```yaml
id: http_post_request_example
namespace: company.team
description: Make a HTTP Request and Handle the Output

inputs:
  - id: payload
    type: JSON
    defaults: |
      { "title": "Kestra Pen" }

tasks:
  - id: send_data
    type: io.kestra.plugin.core.http.Request
    uri: https://dummyjson.com/products/add
    method: POST
    contentType: application/json
    body: "{{ inputs.payload }}"

  - id: print_status
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.send_data.body }}"

```

We can define the request body as an input so it's easier to remember what it is, change it when we execute and to use in multiple places if we decide to make multiple requests with the same body.

When we execute this as a `POST` request, this is the response we receive using the same Debug Outputs option in the Outputs page:

![http_post_outputs](/docs/how-to-guides/http/http_post_outputs.png)

As we can see, this generates the same output from our earlier example but with the added benefit that we can pass this data to later tasks to perform computation if we wanted to!

### PUT Request

Similar to our `POST` Request, we can change the `method` property to `PUT`. As the `PUT` request will replace the content, we'll need to adjust our body to have the data we want to update with. As we can see from the `GET` Request, `id` 1 is an `iPhone 9` so let's change it to an `iPhone 10`:

```yaml
id: http_put_request_example
namespace: company.team
description: Make a HTTP Request and Handle the Output

inputs:
  - id: payload
    type: JSON
    defaults: |
      {"title": "iPhone 10"}

tasks:
  - id: send_data
    type: io.kestra.plugin.core.http.Request
    uri: https://dummyjson.com/products/1
    method: PUT
    contentType: application/json
    body: "{{ inputs.payload }}"

  - id: print_status
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.send_data.body }}"
```

As we can see, the response body is showing our updated title field.

![http_put_outputs](/docs/how-to-guides/http/http_put_outputs.png)

### DELETE Request

We can also remove a product from the list by using a `DELETE` Request. This example is very similar to the `GET` Request as we don't need to provide a body.

```yaml
id: http_delete_request_example
namespace: company.team
description: Make a HTTP Request and Handle the Output

inputs:
  - id: product_id
    type: INT

tasks:
  - id: send_data
    type: io.kestra.plugin.core.http.Request
    uri: "https://dummyjson.com/products/{{ inputs.product_id }}"
    method: DELETE
    contentType: application/json

  - id: print_status
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.send_data.body }}"

```

By adding an input, we can change which product we will remove by asking for the `id` at execution.

![http_delete_outputs](/docs/how-to-guides/http/http_delete_input.png)

As expected, we get the desired output:

![http_delete_outputs](/docs/how-to-guides/http/http_delete_outputs.png)
