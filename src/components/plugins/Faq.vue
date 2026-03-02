<template>
    <Faq :items="ITEMS" />
</template>

<script setup lang="ts">
    import Faq from "~/components/common/Faq.vue"

    const ITEMS = [
        {
            question: "What is a Kestra plugin?",
            answer: "A Kestra plugin is a packaged extension that adds new tasks, triggers, or capabilities to the platform. Plugins allow workflows to interact with external systems, run specific types of logic, or expose higher-level platform features without custom code.",
        },
        {
            question: "How is a plugin different from a workflow?",
            answer: "A workflow defines orchestration logic: when things run, in what order, and under which conditions. A plugin provides the execution capability itself. Workflows compose plugins; plugins do not replace workflows.",
        },
        
        {
            question: "Are plugins language-specific?",
            answer: "No. Kestra plugins are language-agnostic from a workflow perspective. A plugin may internally execute SQL, Python, Shell, PowerShell, Terraform, or API calls, but workflows interact with plugins in a uniform YAML syntax, regardless of the underlying runtime.",
        },

        {
            question: "How are plugins configured?",
            answer: "Plugins are configured directly in workflow definitions using YAML. Configuration is explicit, versioned, and can be managed like code (Git, CI/CD, reviews). No external SDKs or code instrumentation are required.",
        },

        {
            question: "Are plugins open source?",
            answer: "Most Kestra plugins are open source and available on GitHub. Some advanced plugins or capabilities are part of the Enterprise Edition, typically when they involve governance, security, or cross-tenant visibility.",
        },

        {
            question: "Can I build my own plugin?",
            answer: "Yes. Kestra provides a plugin SDK that allows teams to build and maintain custom plugins when needed. Custom plugins integrate the same way as native ones and can be shared internally or contributed back to the community.",
        },
    ]
    
</script>