<template>
    <div class="wrapper">
        <div class="ai-copilot container">
            <div class="first-line">
                <div>
                    <div class="what-is-new">What is new in <strong>1.0</strong></div>
                    <h2>AI Copilot</h2>
                    <p>
                        Describe what you want to orchestrate in natural language,
                        and Copilot generates declarative YAML code you can refine,
                        version, and deploy.
                    </p>
                </div>
                <div class="copilot-overview-illustration">
                    <NuxtImg class="illu-code" src="/landing/onezero/Copilot.png" alt="AI Copilot Overview code" width="1042" height="695" />
                    <NuxtImg class="illu-prompt" src="/landing/onezero/prompt.png" alt="AI Copilot Overview prompt" width="1126" height="296" />
                </div>
            </div>

            <div >
                <h3>AI Agent</h3>
                <p>
                    Autonomous, memory-aware tasks that can reason,
                    choose tools (web search, task/flow calling),
                    loop until goals are met, and coordinate multi-step
                    objectives—fully observable and governed.
                </p>
                <NuxtImg src="ai-agent-overview.png" alt="AI Agent Overview" />
            </div>
            <div >
                <h3>Official MCP Server</h3>
                <p>
                    Connect Kestra to AI IDEs & agent frameworks via the Model Context Protocol;
                    manage flows and executions from your AI workspace.
                </p>
                <NuxtImg src="mcp-overview.png" alt="MCP Overview" />
            </div>
            <div class="second-line">
                <h3>AI-Powered Docs Search</h3>
                <p>
                    Get answers to your questions instantly.
                </p>
                <NuxtImg src="ask-kestra-ai.png" alt="AI Prompt reading Ask Kestra AI" />
            </div>
            <div >
                <h3>Enterprise-grade LTS</h3>
                <p>
                    Predictable upgrades, backward compatibility, RBAC,
                    encrypted secrets, tenant isolation proven at scale.
                </p>
                <NuxtImg src="enterprise-lts.png" alt="Network of features" />
            </div>
            <div >
                <h3>900+ Plugins & Safe Upgrades</h3>
                <p>
                    Our extensive ecosystem spans data, AI, and infrastructure.
                    Plugin Versioning allows you to pin and run multiple versions
                    simultaneously for safer, more controlled rollouts.
                </p>
                <NuxtImg src="plugins-logos.png" alt="Community Plugins Logos" />
            </div>
        </div>
        <div class="velocity container">
            <h2><span>Velocity</span> Features</h2>
            <div class="feature-list">
                <div class="feature-item">
                    <h3>Playground (GA)</h3>
                    <p>
                        Reduce friction in complex builds by testing steps independently while keeping production runs clean and consistent.
                    </p>
                </div>
                <div class="feature-item">
                    <h3>Flow-level SLAs</h3>
                    <p>
                        Enforce reliability standards with built-in SLAs that automatically handle long-running or failed executions to keep workflows compliant and predictable.
                    </p>
                </div>
                <div class="feature-item">
                    <h3>New Dependency View</h3>
                    <p>
                        Full visibility into complex workflows with a scalable, intuitive dependency view that makes it easy to trace, explore, and navigate data flows at any scale.
                    </p>
                </div>
            </div>
            <NuxtLink href="1.0" target="_blank" class="btn btn-md btn-primary">Explore the 1.0 Highlights</NuxtLink>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    background-color: #1A1C25;
    color: white;
    padding: 102px 2rem 50px;
}

.ai-copilot{
    display: grid;
    margin-bottom: 200px;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-template-areas:
        "first-line first-line"
        ". ."
        "second-line second-line"
        ". .";
    > div{
        border: 1px solid #333;
        border-right: 0;
        border-left: 0;
        padding: 2rem 0;
        &:nth-child(3n){
            border-left: 1px solid #333;
            padding-left: 2rem;
        }
    }
}

.first-line {
    grid-area: first-line;
    display: flex;
    position: relative;
    .ai-copilot & {
        border: none;
        padding-bottom: 200px;
    }
    &:before{
        display: block;
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: -200px;
        bottom: 150px;
        background-image: radial-gradient(ellipse closest-side,#8205ffb6 0,#ddc4ff00 70%), radial-gradient(ellipse closest-side,#8205ffb6 0,#ddc4ff00 70%);
        background-size: 1000px 400px, 1000px 400px;
        background-repeat: no-repeat, no-repeat;
        background-position: 100% 50%, 110% 240%;
    }
}

.second-line {
    grid-area: second-line;
}

.copilot-overview-illustration {
    margin-left: 2rem;
    position: relative;
    max-width: 90%;
    width: 100%;
    z-index: 1;
    &::before{
        display: block;
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #1A1C25;
        z-index: -1;
    }
    .illu-code {
        width: 100%;
        height: auto;
        /* make the gradient opacity from top to bottom */
        mask-image: linear-gradient(black, transparent);
        position: relative;

    }
    .illu-prompt {
        width: 109%;
        height: auto;
        position: absolute;
        left: -10%;
        bottom: -20%;

    }
}
</style>
