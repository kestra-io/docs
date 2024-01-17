<template>
    <div class="how container">
        <Section
            subtitle="Language-Agnostic Workflows"
            subtitle-after="At Any Scale"
        >
            <div class="item workflow-1 row mb-5">
                <div class="col-md-6 p-5" data-aos="fade-right">
                    <h3>Define your workflows</h3>
                    <p>
                        By using Kestra as your orchestrator, you can easily automate complex workflows, integrate with your existing data stack, and improve the speed and efficiency of your data processing.
                    </p>
                </div>
                <div class="col-md-6" data-aos="fade-right">
                    <img class="img-fluid" src="/landing/home/how-1.svg" alt="How to define a flow example" />
                </div>
            </div>

            <div class="item workflow-2 row mb-5">
                <div class="col-md-6 order-1 order-md-0" data-aos="fade-left">
                    <img class="img-fluid" src="/landing/home/how-2.svg" alt="Integration with all data stacks" />
                </div>
                <div class="col-md-6 p-5 order-0 order-md-1" data-aos="fade-left">
                    <h3>Integrate with your stack</h3>
                    <p>Kestra integrates with a wide variety of data sources and tools, so you can easily connect your workflows to your existing data stack. This includes support for popular databases, file formats, APIs, and more.</p>
                </div>
            </div>

            <div class="item workflow-3 row mb-5">
                <div class="col-md-6 p-5" data-aos="fade-right">
                    <h3>Schedule your workflows</h3>
                    <p>Configure your workflows to run on a schedule, in response to event-based triggers, via webhooks, or through APIs.</p>
                </div>
                <div class="col-md-6" data-aos="fade-right">
                    <img class="img-fluid" src="/landing/home/how-3.svg" alt="How to schedule example" />
                </div>
            </div>

            <div class="item workflow-4 row mb-5">
                <div class="col-md-6 order-1 order-md-0" data-aos="fade-left">
                    <img class="img-fluid" src="/landing/home/how-4.svg" alt="How to execute a flow example" />
                </div>
                <div class="col-md-6 p-5 order-0 order-md-1" data-aos="fade-left">
                    <h3>Execute your workflows</h3>
                    <p>
                        When a workflow is triggered, Kestra orchestrates the execution of each step, ensuring that data is processed correctly and dependencies are satisfied.
                    </p>
                </div>
            </div>

            <div class="item workflow-5 row mb-5">
                <div class="col-md-6 p-5" data-aos="fade-right">
                    <h3>Monitor and optimize your workflows</h3>
                    <p>Track the performance of your workflows, identify bottlenecks, and optimize them for speed and efficiency.</p>
                </div>
                <div class="col-md-6 row mb-5" data-aos="fade-right">
                    <img class="img-fluid" src="/landing/home/how-5.svg" alt="Visualization of Kestra monitoring" />
                </div>
            </div>

            <div class="text-center how-footer">
                <p class="last-words" data-aos="fade-left">
                    By using Kestra as your orchestrator, you can easily automate complex workflows, integrate with your existing data stack, and improve the speed and efficiency of your data processing.
                </p>
                <NuxtLink href="/docs/getting-started" class="btn btn-animated btn-purple-animated me-2" data-aos="zoom-in">
                    Get started
                </NuxtLink>
                <a href="https://demo.kestra.io/ui/login?auto" target="_blank" class="btn btn-animated btn-dark-animated me-2" data-aos="zoom-in">
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
        font-size: large;
        text-align: center;

        @include media-breakpoint-up(xl) {
            padding-left: 12rem;
            padding-right: 12rem;
        }
    }

</style>
