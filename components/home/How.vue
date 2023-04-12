<template>
    <div class="container">
        <Section
            title="High-Performance Automation and Integration for Optimized Data Operations"
            subtitle="Master Data Workflows"
        >
            <div class="row mb-5">
                <div class="col-md-6 p-5">
                    <h6>Step 1</h6>
                    <h5>Define your workflows</h5>
                    <p>
                        Declare all your flows in Yaml, specify all tasks that need to be executed, the input and output data and any dependencies between steps.
                    </p>
                </div>
                <div class="col-md-6">
                    <img class="img-fluid" src="/landing/home/how-1.svg" alt="" />
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-md-6">
                    <img class="img-fluid" src="/landing/home/how-2.svg" alt="" />
                </div>
                <div class="col-md-6 p-5">
                    <h6>Step 2</h6>
                    <h5>Schedule your workflows</h5>
                    <p>Specify when and how often they should run, and how to trigger them. You can also trigger workflows manually, or run them as part of a larger pipeline.</p>
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-md-6 p-5">
                    <h6>Step 3</h6>
                    <h5>Execute your workflows</h5>
                    <p>
                        When a workflow is triggered, Kestra orchestrates the execution of each step, ensuring that data is processed correctly and dependencies are satisfied.
                    </p>
                </div>
                <div class="col-md-6">
                    <img class="img-fluid" src="/landing/home/how-3.svg" alt="" />
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-md-6">
                    <img class="img-fluid" src="/landing/home/how-4.svg" alt="" />
                </div>
                <div class="col-md-6 p-5">
                    <h6>Step 4</h6>
                    <h5>Integrate with your existing data stack</h5>
                    <p>Kestra integrates with a wide variety of data sources and tools, so you can easily connect your workflows to your existing data stack. This includes support for popular databases, file formats, APIs, and more.</p>
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-md-6 p-5">
                    <h6>Step 5</h6>
                    <h5>Monitor and optimize your workflows</h5>
                    <p>Track the performance of your workflows, identify bottlenecks, and optimize them for speed and efficiency.</p>
                </div>
                <div class="col-md-6 row mb-5">
                    <img class="img-fluid" src="/landing/home/how-5.svg" alt="" />
                </div>
            </div>

            <div class="text-center">
                <p class="last-words">
                    By using Kestra as your orchestrator, you can easily automate complex workflows, integrate with your existing data stack, and improve the speed and efficiency of your data processing.
                </p>
                <NuxtLink href="/docs/getting-started" class="btn btn-lg btn-primary me-2">
                    Get started
                </NuxtLink>
                <a href="https://demo.kestra.io" target="_blank" class="btn btn-lg btn-secondary">
                    Live demo
                </a>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .last-words {
        color: #343434;
        padding-left: calc($spacer * 8);
        padding-right: calc($spacer * 8);
        font-size: large;
    }

</style>
