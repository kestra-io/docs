<template>
    <LayoutDetailMainContent
        subtitle="Add New Workflows in Minutes."
        subtitleAfter="No Ops Required."
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
            content: `
                            <ul>
                                <li>
                                    Strong typing and autocompletion:
                                    <span>
                                        iterate quickly when adding new flows, triggers and tasks. If something
                                        is incorrect in your workflow definition, you will know in
                                        advance thanks to the built-in syntax validation.
                                    </span>
                                </li>
                                <li>
                                    Support for data-mesh:
                                    <span>
                                        thanks to the simple
                                         <a href="https://kestra.io/features/declarative-data-orchestration" target="_blank" data-aos="zoom-in">
                                            YAML interface.
                                         </a>
                                         built-in documentation and blueprints, domain experts can
                                          build their own workflows, too.
                                    </span>
                                </li>
                                <li>
                                    Intuitive UI built not only for engineers:
                                    <span>
                                        when you add workflows directly from the UI, the live-updating
                                        topology view helps you see dependencies between processes,
                                        systems and tasks.
                                    </span>
                                </li>
                            </ul>
                        `
          },
          {
            title: 'Iterate faster without the overhead of CI/CD',
            img: '/landing/features/execute.svg',
            imgAlt: 'Iterate faster without the overhead of CI/CD',
            content: `
                            <ul>
                                <li>
                                    Less time spent babysitting orchestration code:
                                    <span>
                                        Seamlessly configure your tasks to run sequentially, in parallel
                                        or only based on a specific condition or presence of events
                                        without having to navigate convoluted orchestration codebases.
                                    </span>
                                </li>
                                <li>
                                    Intuitive dependency management:
                                    <span>
                                        Easily manage task dependencies — defining the sequence of tasks is as simple
                                        as listing them in the order you want them to run.
                                    </span>
                                </li>
                                <li>
                                    Built-in documentation and blueprints:
                                    <span>
                                      No need to navigate bulky documentation to figure out the right task or
                                      trigger properties — they are available right next to your code
                                      editor.
                                    </span>
                                </li>
                            </ul>
                        `
          },
          {
            title: 'Flexible Event-Driven Workflow Execution',
            img: '/landing/features/flowable.svg',
            imgAlt: 'Flexible Event-Driven Workflow Execution',
            content: `
                            <ul>
                                <li>
                                    Time-based scheduling:
                                    <span>
                                        workflows run
                                        automatically at specific times, such as daily, weekly, or
                                        monthly without the need for manual intervention or inspecting
                                        crontabs.
                                    </span>
                                </li>
                                <li>
                                    Event-based orchestration:
                                    <span>
                                        automate your tasks based on real-time events. Trigger workflows to run
                                        automatically in response to events, such as the arrival of new
                                        data in a database, file detection in your S3 bucket,
                                        new message in a message queue, or the completion of other
                                        workflows.
                                    </span>
                                </li>
                            </ul>
                        `
          },
          {
            title: 'Execute and Monitor in Real Time',
            img: '/landing/features/monitor.svg',
            imgAlt: 'Execute and Monitor',
            content: `
                            <ul>
                                <li>
                                    Real-time Workflow Monitoring:
                                    <span>
                                       track workflow execution state and the health of your platform in real-time. Troubleshoot failure by restarting failed workflow executions or run a full-text search on the workflow execution logs to identify the root cause.
                                    </span>
                                </li>
                                <li>
                                   Actionable Insights:
                                    <span>
                                         build custom dashboards to track workflow performance using built-in outputs and metrics. Thanks to a standardized format that Kestra uses, all your workflow metrics can be visualized in Grafana or Kibana.
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