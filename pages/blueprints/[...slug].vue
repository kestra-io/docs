<template>
<div>
  <div class="container" v-if="slug === '/blueprints/'">
    <BlueprintsLists />
  </div>

  <div v-else>
    <BlueprintsHeader :page="page" />
    <div class="container">
      <BlueprintsAbout :page="page" />
      <LayoutSection title="More Related Blueprints">
        <div class="row">
          <div class="col-lg-4 col-md-6 mb-4" v-for="blueprint in relatedBlueprints" :key="blueprint.id">
            <BlueprintsBlueprintCard :blueprint="blueprint" data-aos="zoom-in" />
          </div>
        </div>
      </LayoutSection>
    </div>
  </div>

  <div class="bottom">
    <BlueprintsFooter />
  </div>
</div>
</template>

<script setup>
const route = useRoute()
const slug = ref("/blueprints/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug));
const page = {
  slug: slug.value, 
  "flow": "id: aws_lambda\nnamespace: blueprint\n\ntasks:\n  - id: parallel\n    type: io.kestra.core.tasks.flows.Parallel\n    tasks:\n      - id: lambda\n        type: io.kestra.plugin.aws.lambda.Invoke\n        functionArn: arn:aws:lambda:eu-central-1:123456789:function:demo\n\n      - id: lambdaVersion\n        type: io.kestra.plugin.aws.lambda.Invoke\n        functionArn: arn:aws:lambda:eu-central-1:123456789:function:ResultHandler:1\n        functionPayload:\n          your_event_input: hello\n\n      - id: lambdaAlias\n        type: io.kestra.plugin.aws.lambda.Invoke\n        functionArn: arn:aws:lambda:eu-central-1:123456789:function:ResultHandler:kestra\n        functionPayload:\n          your_event_input: hey there\n\n  - id: lambdaResult\n    type: io.kestra.plugin.scripts.shell.Commands\n    runner: PROCESS\n    commands:\n      - cat {{outputs.lambda.uri}} | jq -r '.body'", 
  "title": "Microservice orchestration: invoke multiple AWS Lambda functions in parallel", 
  "body": { "type": "root", 
  children: [
	{
		"type": "element", 
		"tag": "p", 
		"props": {}, 
		"children": [
				{"type": "text", "value": "This flow invokes multiple AWS lambda functions in parallel. It demonstrates how you can:"},
				{"type": "element", "tag": "ol", "props": {}, "children": [
					{"type": "element", "tag": "li", "props": {}, "children": [{"type": "text", "value": "Invoke a Lambda function based on its ARN, including invoking a specific `version` or `alias` of your function"}]},
					{"type": "element", "tag": "li", "props": {}, "children": [{"type": "text", "value": "Easily pass custom `functionPayload` in a simple dictionary format"}]},
					{"type": "element", "tag": "li", "props": {}, "children": [{"type": "text", "value": "Access the output of the Lambda result JSON payload and extract relevant data using `jq`"}]}
				]},
				{ "type": "element", "tag": "p", "props": {}, "children": [{"type": "text", "value": "To test this blueprint, you can create a simple function, e.g. in Python, named `demo` as follows:"}] },
				{"type": "element", "tag": "pre", "props": {}, "children": [{"type": "text", "value": "```python\nimport json\n\ndef lambda_handler(event, context):\n    print(event)\n    return {\n        'statusCode': 200,\n        'body': json.dumps('Hello from Lambda!')\n    }\n```"}]},
				{"type": "element", "tag": "p", "props": {}, "children": [{"type": "text", "value": "And another one named `ResultHandler`:"}]},
				{"type": "element", "tag": "pre", "props": {}, "children": [{"type": "text", "value": "```python\nimport json\n\ndef lambda_handler(event, context):\n    function_result = event['your_event_input']\n    return {\n        'body': json.dumps(function_result + ' from Kestra')\n    }\n```"}]},
				{"type": "element", "tag": "p", "props": {}, "children": [{"type": "text", "value": "You can then create a custom version or alias for your function, if needed."}]}
		  ]
	}
]}
}
const relatedBlueprints = ref([
  {
    id: 1,
    category: "AI",
    title: "Create an image using OpenAI's DALL-E",
    path: ""
  },
  {
    id: 2,
    category: "S3 INGEST TRANSFORM DATABASE",
    title: "Extract data, transform it, and load it in parallel to S3 and Postgres — all in less than 7 seconds!",
    path: ""
  },
  {
    id: 3,
    category: "AI",
    title: "Send a prompt to OpenAI's ChatCompletion API",
    path: ""
  },
])
</script>