<template>
    <div class="container">
        <Section
            subtitle="Build Your Flows in"
            subtitle-after="YAML"
            baseline="YAML is a human-readable data serialization language designed for simplicity and ease of use. By using YAML to define declarative data workflows, Kestra offers numerous benefits:"
        >
            <div class="row card-group mb-2">
                <div class="col-md-4 mb-4">
                    <Card
                        :icon="Typewriter"
                        title="Simplified Workflow Creation"
                        description="YAML syntax allows more people in the organization to collaborate on data workflows."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="BugOutline"
                        title="Reduced Maintenance Effort"
                        description="Changes can be made directly within the YAML file, eliminating the need for CI/CD."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="Read"
                        title="Enhanced Readability"
                        description="YAML format works well with REST APIs while remaining human-readable and easy to understand."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="Git"
                        title="Version Control"
                        description="Track changes, collaborate on updates, and maintain a history of modifications."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="Lan"
                        title="Platform Agnostic"
                        description="Easily switch between tools by swapping plugins in your workflow."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="AlertCircleOutline"
                        title="Reduced error rates"
                        description="YAML workflow definition validates syntax during creation, ensuring correctness before execution."
                    />
                </div>
            </div>
        </Section>
    </div>
</template>

<script setup>
    import Typewriter from "vue-material-design-icons/Typewriter.vue";
    import BugOutline from "vue-material-design-icons/BugOutline.vue";
    import Lan from "vue-material-design-icons/Lan.vue";
    import Read from "vue-material-design-icons/Read.vue";
    import Git from "vue-material-design-icons/Git.vue";
    import AlertCircleOutline from "vue-material-design-icons/AlertCircleOutline.vue";
</script>

<script>
    import Section from '../../layout/Section.vue';
    import Card from '../../card/Card.vue';

    export default {
        components: {Section, Card}
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/styles/variable";
    :deep(section) {
        .baseline {
            color: $white;
            font-size: $h6-font-size;
            font-weight: 400;
        }
    }
</style>
