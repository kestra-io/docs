<template>
    <div class="container">
        <Section subtitle="Simple Workflow Definition in " subtitle-after="YAML">
            <div class="row card-group mb-2">
                <div class="col-md-4 mb-4">
                    <Card
                        :icon="Typewriter"
                        title="Declarative Orchestration Logic"
                        description="YAML is easy to learn. The simple syntax allows more people in the organization to collaborate on building workflows together."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="BugOutline"
                        title="Fewer Bugs in Production"
                        description="Kestra's built-in syntax validation ensures that your YAML code is error-free before execution, reducing the risk of runtime errors in production."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="Read"
                        title="Easy to Read by Humans and Machines"
                        description="YAML is a superset of JSON, therefore it works extraordinaly well with REST APIs, while remaining human-readable and easy to understand."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="Git"
                        title="Simple Version Control"
                        description="Since you describe your workflow in a single YAML configuration, it's easy to track changes over time, collaborate on pull request reviews, and roll back when needed."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="Lan"
                        title="Platform Independence"
                        description="Due to separation of your orchestration logic from the business logic, you don't need any modifications to your existing code to orchestrate it with Kestra."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="AlertCircleOutline"
                        title="Reduced Maintenance Effort"
                        description="Need to adjust your workflow? Just edit the YAML file. No need for redeploying code and complex code packaging in CI/CD."
                    />
                </div>
            </div>
        </Section>
    </div>
</template>

<script setup lang="ts">
    import Typewriter from "vue-material-design-icons/Typewriter.vue"
    import BugOutline from "vue-material-design-icons/BugOutline.vue"
    import Lan from "vue-material-design-icons/Lan.vue"
    import Read from "vue-material-design-icons/Read.vue"
    import Git from "vue-material-design-icons/Git.vue"
    import AlertCircleOutline from "vue-material-design-icons/AlertCircleOutline.vue"
    import Section from "~/components/layout/Section.vue"
    import Card from "~/components/card/Card.vue"
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";
    :deep(section) {
        .baseline {
            color: $white;
            font-size: $h6-font-size;
            font-weight: 400;
        }
    }
</style>