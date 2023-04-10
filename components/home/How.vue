<template>
    <div class="container">
        <Section
            title="Powerful Event Based Workflow Automation"
            subtitle="How?"
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
                <div class="col-md-6">
                    <img class="img-fluid" src="/landing/home/how-5.svg" alt="" />
                </div>
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
