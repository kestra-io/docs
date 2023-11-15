---
title: "Kestra and AWS SQS: How To Work with Message Queues in Kestra"
description: "What are message queues and how to work with them in Kestra flows? We bring you the latest in pushing and processing queue messages."
date: 2023-11-15T08:00:00
category: Solutions
author:
  name: Dario Radecic
  image: "dradecic"
image:
---

If you want to build scalable, reliable, and fault-tolerant applications/APIs in 2023 and beyond, queues might be just what you're looking for. They provide you with a stupidly simple mechanism for **building large-scale and distributed applications**. With the rise of cloud computing in recent years, it makes sense to provision and maintain your queues in cloud environments - using [Amazon Simple Queue Service (SQS)](https://aws.amazon.com/sqs/), for example.

But that's not the only practical implementation of queues, of course. You can also use them with [Kestra](https://github.com/kestra-io/kestra), our orchestration platform, to push and read messages directly from your flows. This way, you can publish messages to SQS that has one or multiple consumers attached to it, or, your Kestra flow can serve as consumers itself - it's up to you and your specific needs.

Today's article will refresh your memory on the importance of queues in modern-day applications and will give you practical examples of **how to connect an AWS SQS queue to Kestra** - both for pushing and processing messages.

---

## The Role of Message Queues in Modern Applications and APIs
Imagine you've created a machine learning model that automatically **detects fraud based on credit card transactions**, are are now using it on a large scale in your company. You've probably written the whole thing in Python, and exposed the logic as a REST API with libraries like Flask, Django, or FastAPI:

![Image 1 - Architecture example 1](/blogs/2023-11-15-kestra-sqs/1.png)

Processing each credit card transaction takes time, and your API will start sweating real fast as more and more requests come in.

If too many requests are submitted at once, your API might crash altogether, losing info on the most recent requests that were made. Sure, you can try out implementing various techniques like adding more workers on the API end, but at the end of the day, you're barking at the wrong tree.

What you should do instead is to **split your application into multiple services**, and add a queue in between:

![Image 2 - Architecture example 2](/blogs/2023-11-15-kestra-sqs/2.png)

In practice, this means your Python API will be a separate service and will have a single task of accepting requests. As soon as a new request is captured, its content is added (or *enqueued*) to a queue. In other words, this part serves as a producer. This queue has one or multiple Python services attached to it on the other end, and their task is to take the messages from a queue (*dequeue*) and process them individually, usually in parallel if you have multiple services, or consumers at this end.

**So, why is this approach better?** Here's a couple of reasons:
- **Improved scalability** - Message queues like SQS make scaling possible. In the context of your application, the source Python API will always be available since its only task is to forward requests, and all of the tasks from a queue will be processed eventually since multiple worker services are attached to it and are processing messages in parallel. If the processing is slow, simply scale the worker portion horizontally and/or increase the compute capacity of individual worker nodes.
- **Increased reliability and fault tolerance** - Your app won't fail if flooded with many requests at once, since the portion of the app that handles requests does only that, and leaves processing to other services. Further, if the worker nodes fail or are unavailable, the messages will remain in a queue. They will be processed as soon as worker nodes are up and running again.
- **Asynchronous and parallel processing** - The processing task happens as a background process, or asynchronously, and can also be parallelized by attaching multiple worker services to the same queue. Win-win!
- **Load balancing** - Message queues like SQS provide a form of load balancing by default, meaning they'll distribute tasks evenly across multiple worker nodes. This is essential with high workload applications, as it allows you to scale the number of workers up or down as needed.
- **Service decoupling** - A queue like SQS will allow you to separate your services (as shown in Image 2), and result in better architectural design. In short, the producer (Python API) is separated from the consumers (workers) and ensures changes in one part of the system, such as changing your machine learning model will have minimal or no impact on other parts of the system.

There are more reasons why a queue-based architecture is simply superior, but we're certain you get the point by now.

Up next, let's see what exactly is needed to use a Queue in your Kestra flows.



## What Do You Need to Enable Kestra to AWS SQS Communication?
This section will be short, just because there's only a handful of prerequisites you need in order to connect to SQS from Kestra.

Assuming you have a queue created, make sure to **grab its URL**:

![Image 3 - Queue details](/blogs/2023-11-15-kestra-sqs/3.png)

Other than that, you'll need:
- AWS access key
- AWS secret access key
- Region name

That's it! You can grab (or create) the first two by going into **Security Credentials - Access keys**. Simply create a pair if you don't have it already.

As for the region name, you can obtain it by looking at the navigation menu at the top right corner of the screen - you'll see a code right by your user name. For reference, ours is `eu-north-1`.

Now, all of these are potentially **sensitive values**, so you don't want to hardcode them into your Kestra flow. Also, harcording values will pose a problem if you're using them in multiple Kestra flows, and need to change them later on. The best practice is to add them as environment variables in `docker-compose.yml`, inside the `ENVIRONMENT` section. Don't forget to base64 encode them first, and also prefix them with `SECRET`:

![Image 4 - Kestra environemnt variables](/blogs/2023-11-15-kestra-sqs/4.png)

**Note:** [Kestra Enterprise](https://kestra.io/enterprise) users can add and modify secret keys directly from the Kestra UI.

Assuming you've done that, let's continue by creating a Kestra flow that communicates with SQS.



## Kestra SQS in Action: Practical Examples
This section will walk you through two practical examples of how to use SQS with Kestra. You'll first see how to push messages to a queue, imitating a content producer, and then we'll go over reading those messages from Kestra (content consumer).


### Example 1: Push Messages to AWS SQS
First, let's push a couple of messages to our queue. To establish a connection, you'll need to specify the values for the AWS access key, AWS secret key, AWS region, and the queue URL. All of these were added to environment variables in the previous section, meaning you can access them with `"{{ secret('<VARIABLE-NAME>') }}"`.

The flow you're about to see will **publish two messages to SQS**, so it's a good practice to create `taskDefaults` for `io.kestra.plugin.aws.sqs.Publish`. This will ensure we don't have to repeat ourselves and also will allow us to change credentials in one place.

The `io.kestra.plugin.aws.sqs.Publish` plugin also accepts `from` parameter, which further expects one or more `data` values to be submitted to the queue. You can read more about message formatting on our [official documentation](https://kestra.io/plugins/plugin-aws/tasks/sqs/io.kestra.plugin.aws.sqs.publish).

Our flow will separate the two message publishing tasks with a simple Python script task that sleeps for a couple of seconds:

```yaml
id: publish-to-sqs
namespace: dev

tasks:
  - id: sqsMessageStart
    type: io.kestra.plugin.aws.sqs.Publish
    from:
      data: "FLOW: publish-to-sqs | TASK ID: sqsMessageStart | Flow started."

  - id: pythonScript
    type: io.kestra.plugin.scripts.python.Script
    warningOnStdErr: false
    script: |
      import time

      time.sleep(5)

  - id: sqsMessageEnd
    type: io.kestra.plugin.aws.sqs.Publish
    from:
      data: "FLOW: publish-to-sqs | TASK ID: sqsMessageEnd | Flow finished."


taskDefaults:
  - type: io.kestra.plugin.aws.sqs.Publish
    values:
      accessKeyId: "{{ secret('AWS_ACCESS_KEY') }}"
      secretKeyId: "{{ secret('AWS_SECRET_KEY') }}"
      region: "{{ secret('AWS_REGION') }}"
      queueUrl: "{{ secret('SQS_URL') }}"
```

This is what your editor should look like:

![Image 5 - Kestra editor contents](/blogs/2023-11-15-kestra-sqs/5.png)

You can **run the flow** by clicking on the "Execute" button in the top right corner. You'll see the following Gantt view immediately afterward:

![Image 6 - Flow execution Gantt view](/blogs/2023-11-15-kestra-sqs/6.png)

The good thing about SQS is that it allows us to **see how many messages are currently in the queue**, straight from the AWS site:

![Image 7 - Flow execution Gantt view](/blogs/2023-11-15-kestra-sqs/7.png)

Long story short, it's safe to assume the messages were successfully published from Kestra to SQS.

Let's see how to read them next.



### Example 2: Process Messages from AWS SQS
We've used the `io.kestra.plugin.aws.sqs.Publish` plugin to send messages to SQS, so can you guess the name of the plugin used to do the opposite? If you've guessed `io.kestra.plugin.aws.sqs.Consume`, you're absolutely right!

This plugin requires you to set either the `maxDuration` or `maxRecords` parameter. Since we already know there are 2 messages in a queue, we'll use the latter, just for convenience. Once again, the credentials will be stored in `taskDefaults` for this specific plugin.

There's not much to it - the plugin is straightforward to use, but there are a couple of [extra parameters available](https://kestra.io/plugins/plugin-aws/tasks/sqs/io.kestra.plugin.aws.sqs.consume) if you want to dig deeper:

```yaml
id: read-from-sqs
namespace: dev

tasks:
  - id: consumeSqsMessages
    type: io.kestra.plugin.aws.sqs.Consume
    maxRecords: 2


taskDefaults:
  - type: io.kestra.plugin.aws.sqs.Consume
    values:
      accessKeyId: "{{ secret('AWS_ACCESS_KEY') }}"
      secretKeyId: "{{ secret('AWS_SECRET_KEY') }}"
      region: "{{ secret('AWS_REGION') }}"
      queueUrl: "{{ secret('SQS_URL') }}"
```

This is what your flow editor should look like:

![Image 8 - Kestra editor contents](/blogs/2023-11-15-kestra-sqs/8.png)

As earlier, running the task will redirect you to a flow execution Gantt view:

![Image 9 - Flow execution Gantt view](/blogs/2023-11-15-kestra-sqs/9.png)

All the good stuff is stored in the *Outputs* tab. Click on it to continue:

![Image 10 - Outputs tab](/blogs/2023-11-15-kestra-sqs/10.png)

You can download the consumed SQS messages locally to verify they are the ones submitted by the previous task:

![Image 11 - Consumed messages](/blogs/2023-11-15-kestra-sqs/11.png)

And that's pretty much all there is to the Kestra SQS integration. You can publish and consume messages, and that's actually all you need. Let's wrap things up next.


---
## Summing up Kestra and AWS SQS
Today you got a 10000-foot overview of message queues and why they're essential in modern and scalable applications/APIs. You've also seen how to work with Amazon Simple Queue Service (SQS) directly from Kestra, which allows you to both send messages to the queue and read them thanks to our specific plugins.

To recap, queues are life savers when you want to scale your applications, and SQS is among the best queues available right now. Kestra integration allows you to integrate SQS into your new and existing workflows, which is yet another practical worth exploring.

You might also be interested in other recently implemented Kestra integrations, such as the one for [SurrealDB](https://kestra.io/blogs/2023-10-09-kestra-surrealdb) and [Weaviate](https://kestra.io/blogs/2023-10-31-kestra-weaviate). Make sure to check these out, especially the latter if you want to learn how to work with **vector databases**.

Subscribe to our newsletter below for more guides on modern orchestration, automation, and trends in data management, as well as new features in our platform.

Join the [Slack community](https://kestra.io/slack) if you have any questions or need assistance. Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news. Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.