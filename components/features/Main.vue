<template>
    <div class="container">
        <Section
            title="Finally an orchestrator that get it right"
            subtitle="The Ultimate Orchestrator for Reliable Data Workflows"
        >
            <div class="row mb-5">
                <div class="col-md-6">
                    <img class="img-fluid" src="/landing/features/declarative.svg" alt="" />
                </div>
                <div class="col-md-6 p-5">
                    <h5>Declarative code for creating flows</h5>
                    <ul>
                        <li>
                            <strong>Easy Workflow Creation:</strong> Build custom workflows quickly and with minimal coding using YAML
                        </li>
                        <li>
                            <strong>Intuitive User Interface:</strong> visualize and manipulate workflow directly from the UI.
                        </li>
                    </ul>
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-md-6 p-5">
                    <h5>Quick and Easy Workflow Building</h5>
                    <ul>
                        <li>
                            <strong>Optimized Task Management:</strong> Seamless task execution in a variety of ways including sequential, parallel, and conditional execution.
                        </li>
                        <li>
                            <strong>Intuitive Orchestration:</strong> Easily manage task dependencies and ensure proper execution order.
                        </li>
                        <li>
                            <strong>Flexible Workflow Control:</strong> Full control of workflows orchestration, ensuring tasks are running efficiently.
                        </li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <img class="img-fluid" src="/landing/features/execute.svg" alt="" />
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-md-6">
                    <img class="img-fluid" src="/landing/features/flowable.svg" alt="" />
                </div>
                <div class="col-md-6 p-5">
                    <h5>Flexible Workflow Scheduling</h5>
                    <ul>
                        <li>
                            <strong>Time-based scheduling:</strong> Worflows run automatically at specific times, such as daily, weekly, or monthly for a regular execution without the need for manual intervention.
                        </li>
                        <li>
                            <strong>Event-based scheduling:</strong> Trigger workflows to run automatically in response to events, such as the arrival of new data or the completion of other workflows. Automate workflows executions based on real-time events.
                        </li>
                    </ul>
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-md-6 p-5">
                    <h5>Execute and Monitor in Real Time</h5>
                    <ul>
                        <li>
                            <strong>Real-time Workflow Monitoring:</strong> Progress tracking of workflows and individual tasks in real-time.
                        </li>
                        <li>
                            <strong>Actionable Insights:</strong> insights of workflows performances using built-in logs and metrics.
                        </li>
                        <li>
                            <strong>Intuitive User Interface:</strong> Quick Workflow execution and view of the state of tasks directly from the UI.
                        </li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <img class="img-fluid" src="/landing/features/monitor.svg" alt="" />
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
