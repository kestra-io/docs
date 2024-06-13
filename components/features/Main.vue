<template>
    <LayoutDetailMainContent
        subtitle="Build your Workflows"
        subtitleAfter="as Code"
        baseline="Kestra allows building workflows as code. This approach facilitates seamless integration with existing CI/CD processes, Infrastructure as Code tools like Terraform, and version control systems like Git."
        :items="mainContent"
    />
</template>

<script>
    import Section from "~/components/layout/Section.vue";

    export default {
        components: {Section},
        data() {
            return {
                mainContent: [
                    {
                        title: 'API-first design with declarative workflow definition',
                        img: '/landing/features/declarative1.svg',
                        imgAlt: 'API-first design with declarative workflow definition',
                        imgWidth: '576px',
                        imgHeight: '429px',
                        content: `
                            <ul>
                                <li>
                                    Strong typing and autocompletion:
                                    <span>
                                        iterate quickly when adding new flows, triggers and tasks.
                                        If something is incorrect in your workflow definition, you
                                        will know in advance thanks to the built-in syntax validation.
                                    </span>
                                </li>
                                <li>
                                    Support for data-mesh:
                                    <span>
                                        thanks to the simple
                                         <a href="/demo" data-aos="zoom-in">
                                            YAML interface.
                                         </a>
                                        built-in documentation and blueprints, domain experts can build their own workflows, too.
                                    </span>
                                </li>
                                <li>
                                    Intuitive UI built not only for engineers:
                                    <span>
                                        when you add workflows directly from the UI, the
                                        live-updating topology view helps you see dependencies
                                         between processes, systems and tasks.
                                    </span>
                                </li>
                            </ul>
                        `
                    },
                    {
                        title: 'Iterate faster without the overhead of CI/CD',
                        img: '/landing/features/execute.svg',
                        imgAlt: 'Iterate faster without the overhead of CI/CD',
                        imgWidth: '426px',
                        imgHeight: '280px',
                        content: `
                            <ul>
                                <li>
                                    Less time spent babysitting orchestration code:
                                    <span>
                                        Seamlessly configure your tasks to run sequentially,
                                        in parallel or only based on a specific condition or presence
                                        of events without having to navigate convoluted orchestration code bases.
                                    </span>
                                </li>
                                <li>
                                    Intuitive dependency management:
                                    <span>
                                        Easily manage task dependencies — defining proper execution order is as
                                        simple as adding a list of tasks in the order you want them to be executed.
                                    </span>
                                </li>
                                <li>
                                    Built-in documentation and blueprints:
                                    <span>
                                         No need to navigate bulky documentation to figure out the right task or trigger
                                         properties — they are available right next to your code editor.
                                    </span>
                                </li>
                            </ul>
                        `
                    },
                    {
                        title: 'Flexible Event-Driven Workflow Execution',
                        img: '/landing/features/flowable.svg',
                        imgAlt: 'Flexible Event-Driven Workflow Execution',
                        imgWidth: '568px',
                        imgHeight: '461px',
                        content: `
                            <ul>
                                <li>
                                    Time-based scheduling:
                                    <span>
                                       Workflows run automatically at specific times, such as daily, weekly,
                                       or monthly without the need for manual intervention or inspecting crontabs.
                                    </span>
                                </li>
                                <li>
                                    Event-based orchestration:
                                    <span>
                                        Automate workflow executions based on real-time events. Trigger workflows
                                        to run automatically in response to events, such as the arrival of new data in a database,
                                        file detection in your cloud storage bucket, new message in a message queue, or the completion of other workflows.
                                    </span>
                                </li>
                            </ul>
                        `
                    },
                    {
                        title: 'Execute and Monitor in Real Time',
                        img: '/landing/features/monitor.svg',
                        imgAlt: 'Execute and Monitor',
                        imgWidth: '604px',
                        imgHeight: '477px',
                        content: `
                            <ul>
                                <li>
                                    Real-time Workflow Monitoring:
                                    <span>
                                       Progress tracking of workflows and individual tasks in real-time.
                                       Troubleshoot failure by replaying failed tasks or doing
                                       a full-text search of the workflow execution logs.
                                    </span>
                                </li>
                                <li>
                                   Actionable Insights:
                                    <span>
                                         you can build custom dashboards to track workflow performance using built-in
                                         outputs and metrics. Thanks to a standardized format that Kestra uses,
                                         all your Kestra metrics can be visualized in Grafana or Kibana.
                                    </span>
                                </li>
                            </ul>
                        `
                    },
                ],
            }
        },
    }
</script>

<style lang="scss" scoped>
</style>
