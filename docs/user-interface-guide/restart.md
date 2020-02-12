
# Restart

::: tip Note
When an execution is beeing retried, a new execution is generated with same exact input data that were used for current execution. It is entirely indemendent, however it is related to the retried execution with a `parentId` property in the new execution that references the retried execution id.
:::