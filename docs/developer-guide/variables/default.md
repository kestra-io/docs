---
order: 10
---
# Default Variables

The following table lists all the default variables available on each execution. 

| Parameter | Description |
| ---------- | ----------- |
|  <code v-pre>{{ flow.id }}</code> | The name the current flow Id |
|  <code v-pre>{{ flow.namespace }}</code> | The name current namespace |
|  <code v-pre>{{ execution.id }}</code> | Return the execution Id, a unique id for each  |
|  <code v-pre>{{ execution.startDate }}</code> | The start date of the current execution, you can format it with <code v-pre>{{ instantFormat execution.startDate  "yyyy-MM-dd HH:mm:ss.SSSSSS"}}</code> |
|  <code v-pre>{{ task.id }}</code> | The current task Id |
|  <code v-pre>{{ task.type }}</code> | The current task Type (full class name) |
|  <code v-pre>{{ taskrun.id }}</code> | The current task Id |
|  <code v-pre>{{ taskrun.value }}</code> | The value for current taskrun, only available with dynamic task like `EachSequential` |
|  <code v-pre>{{ taskrun.attemptsCount }}</code> | The number of attempts for current task (when retry or restart is done) |
|  <code v-pre>{{ taskrun.startDate }}</code> | The start date of the current taskrun, you can format it with <code v-pre>{{ instantFormat taskrun.startDate  "yyyy-MM-dd HH:mm:ss.SSSSSS"}}</code> |
|  <code v-pre>{{ inputs.input-name }}</code> | The value passed as input, more details [here](../inputs/) |
|  <code v-pre>{{ outputs.task-id.output-name }}</code> | The return of a past taskrun, more details [here](../outputs/) |
