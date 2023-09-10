<template>
    <div class="container">
        <Section
            title="Finally, no dependency conflicts. It just works!"
            subtitle="Add new workflows in minutes. No ops required."
        >
            <div class="row mb-5">
                <div class="col-md-6" data-aos="fade-right">
                    <img class="img-fluid" src="/landing/features/declarative.svg" alt="A YAML sample of code for declarative language and construction of Kestra's flows" />
                </div>
                <div class="col-md-6 p-5" data-aos="fade-right">
                    <h3>API-first design with declarative workflow definition</h3>
                    <ul>
                        <li>
                            <strong>Strong typing and autocompletion:</strong> iterate quickly when adding new flows, triggers and tasks. If something is incorrect in your workflow definition, you will know in advance thanks to the built-in syntax validation.
                        </li>
                        <li>
                            <strong>Support for data-mesh:</strong> thanks to the simple <NuxtLink href="/features/declarative-data-orchestration"> YAML interface</NuxtLink>, built-in documentation and blueprints, domain experts can build their own workflows, too.
                        </li>
                        <li>
                            <strong>Intuitive UI built not only for engineers:</strong> when you add workflows directly from the UI, the live-updating topology view helps you see dependencies between processes, systems and tasks. 
                        </li>
                    </ul>
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-md-6 p-5 order-1 order-md-0" data-aos="fade-left">
                    <h3>Iterate faster without the overhead of CI/CD</h3>
                    <ul>
                        <li>
                            <strong>Less time spent babysitting orchestration code:</strong> Seamlessly configure your tasks to run sequentially, in parallel or only based on a specific condition or presence of events without having to navigate convoluted orchestration code bases. 
                        </li>
                        <li>
                            <strong>Intuitive dependency management:</strong> Easily manage task dependencies — defining proper execution order is as simple as adding a list of tasks in the order you want them to be executed.
                        </li>
                        <li>
                            <strong>Built-in documentation and blueprints:</strong> No need to navigate bulky documentation to figure out the right task or trigger properties — they are available right next to your code editor.
                        </li>
                    </ul>
                </div>
                <div class="col-md-6 order-0 order-md-1" data-aos="fade-left">
                    <img class="img-fluid" src="/landing/features/execute.svg" alt="Image of execution of a task on Kestra with event or time based triggering" />
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-md-6" data-aos="fade-right">
                    <img class="img-fluid" src="/landing/features/flowable.svg" alt="A list of flowable tasks such as sequential, parallel, loop, switch, pause and template" />
                </div>
                <div class="col-md-6 p-5" data-aos="fade-right">
                    <h3>Flexible Event-Driven Workflow Execution</h3>
                    <ul>
                        <li>
                            <strong>Time-based scheduling:</strong> Workflows run automatically at specific times, such as daily, weekly, or monthly without the need for manual intervention or inspecting crontabs.
                        </li>
                        <li>
                            <strong>Event-based orchestration:</strong> Automate workflow executions based on real-time events. Trigger workflows to run automatically in response to events, such as the arrival of new data in a database, file detection in your cloud storage bucket, new message in a message queue, or the completion of other workflows. 
                        </li>
                    </ul>
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-md-6 p-5 order-1 order-md-0" data-aos="fade-left">
                    <h3>Execute and Monitor in Real Time</h3>
                    <ul>
                        <li>
                            <strong>Real-time Workflow Monitoring:</strong> Progress tracking of workflows and individual tasks in real-time. Troubleshoot failure by replaying failed tasks or doing a full-text search of the workflow execution logs.
                        </li>
                        <li>
                            <strong>Actionable Insights:</strong> you can build custom dashboards to track workflow performance using built-in outputs and metrics. Thanks to a standardized format that Kestra uses, all your Kestra metrics can be visualized in Grafana or Kibana.
                        </li>
                    </ul>
                </div>
                <div class="col-md-6 order-0 order-md-1" data-aos="fade-left">
                    <img class="img-fluid" src="/landing/features/monitor.svg" alt="Stylized view of a monitoring dashboard" />
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
