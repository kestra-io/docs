<template>
    <div class="container">
        <Section subtitle="Centralized Data Control for Improved Efficiency" title="Data at Heart with Internal Storage">
            <div class="row card-group card-centered mb-2">
                <div class="col-md-3 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <span class="card-icon"><LightbulbOutline /></span>
                            <h4 class="card-title">Abstraction of Files</h4>
                            <p class="card-text">The internal Storage feature abstracts files, enabling each task to produce or consume files without needing to know the server's current location.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <span class="card-icon"><Lifebuoy /></span>
                            <h4 class="card-title">Stateless Servers</h4>
                            <p class="card-text">Allows easy destruction, restart from scratch or restart a previous execution without any hassle.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <span class="card-icon"><PhonePlus /></span>
                            <h4 class="card-title">Metadata Storage</h4>
                            <p class="card-text">Metadata from the flow is stored on a database and Kestra's Internal Storage for transparent file systems.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <span class="card-icon"><CodeTags /></span>
                            <h4 class="card-title">Strongly Typed</h4>
                            <p class="card-text">Ensure each piece of data is the right type and well-defined, a date must be a date, an int must be an int, and so on…</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <span class="card-icon"><DeveloperBoard /></span>
                            <h4 class="card-title">Amazon Ion Integration</h4>
                            <p class="card-text">Handles more types than JSON, to enable easy mixing of tasks usage without any pain.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <span class="card-icon"><ContentDuplicate /></span>
                            <h4 class="card-title">Communication Between Tasks</h4>
                            <p class="card-text">Each task can easily communicate with all others, making it simple to mix tasks usage without any problems.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <span class="card-icon"><BellOutline /></span>
                            <h4 class="card-title">Task Switch flexibility</h4>
                            <p class="card-text">All switch between tasks, such as BigQuery to MySQL or BigQuery to Redshift, without needing specific operators.</p>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    </div>
</template>

<script setup>
    import BellOutline from "vue-material-design-icons/BellOutline.vue"
    import LightbulbOutline from "vue-material-design-icons/LightbulbOutline.vue"
    import Lifebuoy from "vue-material-design-icons/Lifebuoy.vue"
    import PhonePlus from "vue-material-design-icons/PhonePlus.vue"
    import CodeTags from "vue-material-design-icons/CodeTags.vue"
    import DeveloperBoard from "vue-material-design-icons/DeveloperBoard.vue"
    import ContentDuplicate from "vue-material-design-icons/ContentDuplicate.vue"
</script>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section}
    }
</script>
