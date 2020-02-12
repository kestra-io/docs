# Default Variables

The following table lists the configurable Variables of the Kestra.io and their default values.

| Parameter                                                  | Description                                                                                                                  | Default                                           |
| -----------------------------------------------------------| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
|  <code v-pre>{{ flow.id }}</code>                          | The name of your flow ID "example: barometre-1 ,each-sequential"                                                             |  Matches alphanumeric (same as [a-zA-Z0-9_])      |
|  <code v-pre>{{ task.id }}</code>                          | The ID of your task ID "example: task-1-XXXXXX ,task-2-VVVVVVVV"                                                             |  Matches alphanumeric (same as [a-zA-Z0-9_])      |
|  <code v-pre>{{ taskrun.id }}</code>                       | It's the ID of your execution Task                                                                                           |  Matches alphanumeric (same as [a-zA-Z0-9_])      |
|  <code v-pre>{{ taskrun.value }}</code>                    | The result of your task "exemple: 0, 1"                                                                                      |  Matches numeric (same as [0-9])                  |
|  <code v-pre>{{ taskrun.attemptsCount }}</code>            | The number of times that the task is launched for a given flow                                                               |                                                   |
|  <code v-pre>{{ taskrun.startDate }}</code>                | Retrieves the launch date of the Task ID from the Flow ID                                                                    |                                                   |
|  <code v-pre>{{ execution.id }}</code>                     | Return the execution ID of your flow                                                                                         |  Matches numeric (same as [Z0-9_])                |
|  <code v-pre>{{ inputs.string }}</code>                    | Set Input data in String format for the flow                                                                                 |  Matches string (same as [a-zA-Z])                |
|  <code v-pre>{{ inputs.int }}</code>                       | Set Input data in Int format for the flow                                                                                    |  Matches string (same as [0-9])                   |
|  <code v-pre>{{ inputs.float }}</code>                     | Set Input data in Float format for the flow                                                                                  |                                                   |
|  <code v-pre>{{ inputs.instant }}</code>                   | Enable instant input                                                                                                         |                                                   |
|  <code v-pre>{{ inputs.file.content }}</code>              | Reading file contents on input for the flow ex  yaml,txt,....                                                                |                                                   |
|  <code v-pre>{{ inputs.file }}</code>                      | Reading file path on input for the flow     ex  /tmp/file.txt                                                                |                                                   |
|  <code v-pre>{{ inputs.file.uri }}</code>                  | Reading file from URI value for the flow    ex http://stock.io/myfile.txt                                                    |                                                   |
::: warning
TODO
:::