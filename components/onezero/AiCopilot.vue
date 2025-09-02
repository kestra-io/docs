<script lang="ts" setup>
import { NuxtImg } from '#components';


</script>

<template>
 <div class="ai-copilot">
    <div class="block">
        <div class="what-is-new">What is new in <strong>1.0</strong></div>
        <h2>AI Copilot</h2>
        <p>
            Describe what you want to orchestrate in natural language,
            and Copilot generates declarative YAML code you can refine,
            version, and deploy.
        </p>
    </div>
    <div class="block">
        <NuxtImg
            src="ai-copilot-overview.png"
            alt="AI Copilot Overview"
            width="800"
            height="600"
        />
    </div>

    <div class="block">
        <h3>AI Agent</h3>
        <p>
            Autonomous, memory-aware tasks that can reason,
            choose tools (web search, task/flow calling),
            loop until goals are met, and coordinate multi-step
            objectives—fully observable and governed.
        </p>
        <NuxtImg
            src="ai-agent-overview.png"
            alt="AI Agent Overview"
        />
    </div>
    <div class="block">
        <h3>Official MCP Server</h3>
        <p>
            Connect Kestra to AI IDEs & agent frameworks via the Model Context Protocol;
            manage flows and executions from your AI workspace.
        </p>
        <NuxtImg
            src="mcp-overview.png"
            alt="MCP Overview"
        />
    </div>
 </div>
</template>

<style scoped lang="scss">
.what-is-new {
  font-weight: bold;
}
</style>
