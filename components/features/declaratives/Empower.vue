<template>
    <div class="container">
        <div class="row mt-5 mb-5">
            <div class="col-md-6" data-aos="fade-right">
                <img class="img-fluid" src="/landing/features/declarative/features_1.svg" alt="A YAML sample of code for declarative language and construction of Kestra's flows" />
            </div>
            <div class="col-md-6 p-5" data-aos="fade-right">
                <h3>Deep Dive into YAML's Features</h3>
                <ul>
                    <li>
                        <strong>Data Structures:</strong> YAML supports various data structures, such as mappings, sequences, and scalars, allowing for the flexible representation of complex data workflows.
                    </li>
                    <li>
                        <strong>Comments:</strong> Inline comments in YAML files facilitate better communication and documentation within data teams, ensuring clarity and understanding of workflow logic.
                    </li>
                    <li>
                        <strong>Custom Tags and Types:</strong> YAML allows for the definition of custom tags and types, enabling the creation of domain-specific languages and abstractions tailored to your data orchestration needs.
                    </li>
                </ul>
            </div>
        </div>

        <div class="row mb-5">
            <div class="col-md-6 p-5 order-1 order-md-0" data-aos="fade-left">
                <h3>Empower Your Data Team with Declarative Orchestration</h3>
                <ul>
                    <li>
                        <strong>Accelerate Time to Value:</strong> Declarative orchestration modernized the creation and maintenance of data pipelines, enabling data teams to deliver results faster and more efficiently.
                    </li>
                    <li>
                        <strong>Increase Agility:</strong> By using a declarative approach, data teams can quickly adapt to changing business requirements without the need to overhaul complex procedural code.
                    </li>
                    <li>
                        <strong>Reduce Error Rates:</strong> Declarative workflows help minimize errors by allowing data teams to focus on defining the desired outcome, while Kestra's orchestrator takes care of the execution.
                    </li>
                </ul>
            </div>
            <div class="col-md-6 order-0 order-md-1" data-aos="fade-left">
                <img class="img-fluid" src="/landing/features/declarative/features_2.svg" alt="Image of execution of a task on Kestra with event or time based triggering" />
            </div>
        </div>
    </div>
</template>

<script>
    import Section from '../../layout/Section.vue';
    export default {
        components: {Section}
    }
</script>
