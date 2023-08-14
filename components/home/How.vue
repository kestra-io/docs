<template>
    <div class="container">
        <Section
            title="Performant and Scalable Data Operations"
            subtitle="Simpler and Faster Data Workflows"
        >
            <div class="row mb-5">
                <div class="col-md-6 p-5" data-aos="fade-right">
                    <p class="overline">Step 1</p>
                    <h3>Define your workflows</h3>
                    <p>
                        Declare all <NuxtLink href="/features/declarative-data-orchestration">your flows in YAML</NuxtLink>, specify all tasks that need to be executed, the input and output data, and any dependencies between steps.
                    </p>
                </div>
                <div class="col-md-6" data-aos="fade-right">
                    <img class="img-fluid" src="/landing/home/how-1.svg" alt="How to define a flow example" />
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-md-6 order-1 order-md-0" data-aos="fade-left">
                    <img class="img-fluid" src="/landing/home/how-2.svg" alt="Integration with all data stacks" />
                </div>
                <div class="col-md-6 p-5 order-0 order-md-1" data-aos="fade-left">
                    <p class="overline">Step 2</p>
                    <h3>Schedule your workflows</h3>
                    <p>Specify when and how often they should run, and how to trigger them. You can also trigger workflows manually, or run them as part of a larger pipeline.</p>
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-md-6 p-5" data-aos="fade-right">
                    <p class="overline">Step 3</p>
                    <h3>Execute your workflows</h3>
                    <p>
                        When a workflow is triggered, Kestra orchestrates the execution of each step, ensuring that data is processed correctly and dependencies are satisfied.
                    </p>
                </div>
                <div class="col-md-6" data-aos="fade-right">
                    <img class="img-fluid" src="/landing/home/how-3.svg" alt="How to schedule example" />
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-md-6 order-1 order-md-0" data-aos="fade-left">
                    <img class="img-fluid" src="/landing/home/how-4.svg" alt="How to execute a flow example" />
                </div>
                <div class="col-md-6 p-5 order-0 order-md-1" data-aos="fade-left">
                    <p class="overline">Step 4</p>
                    <h3>Integrate with your existing data stack</h3>
                    <p>Kestra integrates with a wide variety of data sources and tools, so you can easily connect your workflows to your existing data stack. This includes support for popular databases, file formats, APIs, and more.</p>
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-md-6 p-5" data-aos="fade-right">
                    <p class="overline">Step 5</p>
                    <h3>Monitor and optimize your workflows</h3>
                    <p>Track the performance of your workflows, identify bottlenecks, and optimize them for speed and efficiency.</p>
                </div>
                <div class="col-md-6 row mb-5" data-aos="fade-right">
                    <img class="img-fluid" src="/landing/home/how-5.svg" alt="Visualization of Kestra monitoring" />
                </div>
            </div>

            <div class="text-center">
                <p class="last-words" data-aos="fade-left">
                    By using Kestra as your orchestrator, you can easily automate complex workflows, integrate with your existing data stack, and improve the speed and efficiency of your data processing.
                </p>
                <NuxtLink href="/docs/getting-started" class="btn btn-primary me-2" data-aos="zoom-in">
                    <Flash /> Get started
                </NuxtLink>
                <a href="https://demo.kestra.io/ui/login?auto" target="_blank" class="btn btn-dark" data-aos="zoom-in">
                    <Console /> Live demo
                </a>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';
    import Flash from "vue-material-design-icons/Flash.vue";
    import Console from "vue-material-design-icons/Console.vue"

    export default {
        components: {Section, Flash, Console}
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
