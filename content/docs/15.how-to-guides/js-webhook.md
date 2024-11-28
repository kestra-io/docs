---
title: Connect JavaScript Apps to Kestra
icon: /docs/icons/nodejs.svg
stage: Getting Started
topics:
  - Scripting
  - Integrations
---

Integrate Kestra into your JavaScript App using Webhooks.

With Kestra's API First Design, you can build web applications to integrate with Kestra acting as a backend server. 

This can be useful if you want a request from your website to be made and start a workflow execution to process orders. For example, you have an online shop where orders are made and you want Kestra to receive these orders and start processing them.

In this guide, we'll walk through how you can set up Kestra to receive webhooks as well as build a basic JavaScript application with React.js that can make requests.

## Configuring CORS

To make sure we can make requests to Kestra from our JavaScript application locally, we'll need to enable CORS in our Kestra Configuration. We can do that by adding the following configuration:

```yaml
micronaut:
  server:
    cors:
      enabled: true
```

More information can be found in the [configuration documentation](../configuration/index.md#configuring-cors).

## Building a Workflow with a Webhook Trigger

Our JavaScript application will need a workflow to trigger. To do this, we will use a [Webhook Trigger](../04.workflow-components/07.triggers/03.webhook-trigger.md) to receive our requests and start our executions.

Once we've added it, we can add any tasks to run. In this example, we have a log message that will log the request body field `dataField` from the webhook:

```yaml
id: webhook_example
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: "{{ trigger.body.dataField ?? 'null' }}"

triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: abcdefg
```

## Building our JavaScript application with React.js

In this example, I am using React.js to interact with Kestra but this will work with any web framework that can make requests.

We can create our application using `create-react-app`.

```bash
npx create-react-app example
```

Once it's installed, we can start it with:

```bash
npm start
```

We can now navigate to our web application at `locahost:3000`.

Now we have a running web application, we will modify `App.js` to make a request to Kestra.

To start with, we will install axios to make our POST Request to Kestra:

```bash
npm install axios
```

Once we've done that, we can add a `useState` hook to help us make our request and handle the response, specifically handle the request body state:

```js
function App() {
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await axios.post('http://localhost:8080/api/v1/executions/webhook/company.team/webhook_example/abcdefg',
              formData).then(response => {
                console.log(response.data)
                
              }); 
      } catch (error) {
          console.error('Error:', error);
      }
  };
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Kestra Webhook Example</h1>
      </header>
    </div>
  );
}
```

We can get our Webhook URL by going to **Triggers** at the top of our Flow in Kestra and hovering over webhook icon on the right:

![trigger_copy](/docs/how-to-guides/js-webhook/trigger_copy.png)

This current example will make a request with data from a form (which we will add later) using the `useState` hook. We will store the state in `formData` and update it using `setFormData`.

Now we need to add some UI elements to allow us to set our state variable `formData`, make the request and display the response back to us.

We will now modify the JSX in the return statement to include a form which will handle our request.

```js
function App() {

  ...

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Kestra Webhook Example</h1>
        <p>Send a message to Kestra</p>
        <form onSubmit={handleSubmit}>
            <input type="text" name="dataField"
                onChange={handleChange} />
            <button type="submit">Submit</button>
        </form>
      </header>
    </div>
  );
}
```

The form uses `onSubmit` and `onChange` to call functions. We use `onSubmit` on the button to call our newly added `handleSubmit` function. 

However, we don't have a function to handle automatically adding our text to our state variable `formData`. We can add a new function called `handleChange` which will use our state updater function `setFormData` to update `formData` everytime new text is added to the input. This means that when we press **Submit**, the text is ready to be sent in a request body.

```js
function App() {
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await axios.post('http://localhost:8084/api/v1/executions/webhook/company.team/webhook_example/abcdefg',
              formData).then(response => {
                console.log(response.data)
                
              }); 
      } catch (error) {
          console.error('Error:', error);
      }
  };

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Kestra Webhook Example</h1>
        <p>Send a message to Kestra</p>
        <form onSubmit={handleSubmit}>
            <input type="text" name="dataField"
                onChange={handleChange} />
            <button type="submit">Submit</button>
        </form>
      </header>
    </div>
  );
}
```

Now our example will collect the data inside of the `input` field as `dataField` and send it in our request as a key value pair: `dataField: {the input value}`. For example, if I type "Hello" and press **Submit**, it will send the body `{dataField: "Hello"}`.

![js-final](/docs/how-to-guides/js-webhook/js-final.png)

The last thing to add now is to display the response back to the user.

We can add another state variable called `responseData` to handle the response from the request. We can add it into our JSX to only display if we have a response:

```js
{responseData.id && <p><b>Execution ID:</b> {responseData.id}</p>}
```

In this case, `id` is the Execution ID of the Execution that was started because of the webhook request.

Now we've added the response, our full `App.js` should look like this now:

```js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({});
  const [responseData, setResponseData] = useState({});

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await axios.post('http://localhost:8084/api/v1/executions/webhook/company.team/webhook_example/abcdefg',
              formData).then(response => {
                setResponseData(response.data)
                
              }); 
      } catch (error) {
          console.error('Error:', error);
      }
  };

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Kestra Webhook Example</h1>
        <p>Send a message to Kestra</p>
        <form onSubmit={handleSubmit}>
            <input type="text" name="dataField"
                onChange={handleChange} />
            <button type="submit">Submit</button>
        </form>
        {responseData.id && <p><b>Execution ID:</b> {responseData.id}</p>}
      </header>
    </div>
  );
}

export default App;
```

![js-response](/docs/how-to-guides/js-webhook/js-response.png)

This will:
1. Display a Form with an input and a button.
2. Make a request to Kestra with the input data as our request body.
3. Receive the response and display it to the user.

When we type in a value and press **Submit**, we can see a new execution is created in Kestra and our request body was received and used in our Log task:

![kestra-logs](/docs/how-to-guides/js-webhook/kestra-logs.png)

::collapse{title="CSS Styling"}

These are the CSS styles used in the example:

```css
.App {
  text-align: center;

}
.App-header {
  background-color: #4b0aaa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App h1 {
  font-size: 34px;
}

.App h2 {
  font-size: 24px;
}

.App p {
  font-size: 16px;
}

```
::
