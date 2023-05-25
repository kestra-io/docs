<template>
    <div class="container">
        <Section
            title="Benefits of Using YAML for Declarative Orchestration"
            subtitle="Build Your Flows in YAML"
            baseline="YAML is a human-readable data serialization language designed for simplicity and ease of use. By using YAML to define declarative data workflows, Kestra offers numerous benefits:"
        >
            <div class="row card-group mb-2">
                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <div class="cart-title-container">
                                <span class="card-icon"><Typewriter /></span>
                                <h4 class="card-title">Simplified Workflow Creation</h4>
                            </div>
                            <p class="card-text">YAML syntax allows more people in the organization to collaborate on data workflows.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <div class="cart-title-container">
                                <span class="card-icon"><BugOutline /></span>
                                <h4 class="card-title">Reduced Maintenance Effort</h4>
                            </div>
                            <p class="card-text">Changes can be made directly within the YAML file, eliminating the need for CI/CD.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <div class="cart-title-container">
                                <span class="card-icon"><Read /></span>
                                <h4 class="card-title">Enhanced Readability</h4>
                            </div>
                            <p class="card-text">YAML format works well with REST APIs while remaining human-readable and easy to understand.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <div class="cart-title-container">
                                <span class="card-icon"><Git /></span>
                                <h4 class="card-title">Version Control</h4>
                            </div>
                            <p class="card-text">Track changes, collaborate on updates, and maintain a history of modifications.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <div class="cart-title-container">
                                <span class="card-icon"><Lan /></span>
                                <h4 class="card-title">Platform Agnostic</h4>
                            </div>
                            <p class="card-text">Easily switch between tools by swapping plugins in your workflow.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <div class="cart-title-container">
                                <span class="card-icon"><AlertCircleOutline /></span>
                                <h4 class="card-title">Reduced error rates</h4>
                            </div>
                            <p class="card-text">YAML workflow definition validates syntax during creation, ensuring correctness before execution.</p>
                        </div>
                    </div>
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

    export default {
        components: {Section}
    }
</script>
