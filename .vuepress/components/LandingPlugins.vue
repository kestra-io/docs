<template>
    <div>
        <section class="section">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="section-title text-center pb-2">
                            <h4 class="title mb-4">Discover plugins or build yours !</h4>
                            <p class="text-muted para-desc mb-0 mx-auto">
                                <span class="text-primary mb-0 font-weight-bold">Kestra</span> is build upon a plugins systems.
                                Find your plugin to interact with your provider or develop easily yours.

                                Here is the official plugins available :
                            </p>
                        </div>
                    </div>
                    <!--end col-->
                </div>
                <!--end row-->

                <div class="row">
                    <div class="col-lg-4 col-md-6 mt-4 pt-2" v-for="plugin in plugins">
                        <a :href="'plugins/' + plugin.href + '/'" class="media key-feature align-items-center p-3 rounded-md shadow">
                            <div class="icon text-center rounded-circle mr-3 text-primary">
                                <i :class="plugin.icon"></i>
                            </div>
                            <div class="media-body">
                                <h4 class="title mb-0">{{ plugin.name }}</h4>
                            </div>
                        </a>
                    </div>
                    <!--end col-->

                    <div class="col-12 mt-4 pt-2 text-center">
                        <a href="/plugins/" class="btn btn-primary mr-4">
                            <i class="mdi mdi-text-box-multiple"></i>
                            Plugins documentation
                            <i class="mdi mdi-arrow-right"></i>
                        </a>

                        <a href="/docs/plugin-developer-guide/" class="btn btn-primary">
                            <i class="mdi mdi-language-java"></i>
                            Create a plugin
                            <i class="mdi mdi-arrow-right"></i>
                        </a>
                    </div>
                    <!--end col-->
                </div>
                <!--end row-->
            </div>
            <!--ed container-->
        </section>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                plugins: [
                    {
                        name: "Core",
                        icon: "mdi mdi-heart",
                        href: "core"
                    },
                    {
                        name: "Amazon AWS",
                        icon: "mdi mdi-aws",
                        href: "task-aws"
                    },
                    {
                        name: "File systems",
                        icon: "mdi mdi-harddisk",
                        href: "task-fs"
                    },
                    {
                        name: "Google Cloud Platform",
                        icon: "mdi mdi-google-cloud",
                        href: "task-gcp"
                    },
                    {
                        name: "Cryptography",
                        icon: "mdi mdi-lock",
                        href: "task-crypto"
                    },
                    {
                        name: "JDBC MySQL",
                        icon: "mdi mdi-database-settings",
                        href: "task-jdbc-mysql"
                    },
                    {
                        name: "JDBC Postgres",
                        icon: "mdi mdi-database-settings-outline",
                        href: "task-jdbc-postgres"
                    },
                    {
                        name: "Kubernetes",
                        icon: "mdi mdi-kubernetes",
                        href: "task-kubernetes"
                    },
                    {
                        name: "Notifications",
                        icon: "mdi mdi-alarm",
                        href: "task-notifications"
                    },
                    {
                        name: "Serialization",
                        icon: "mdi mdi-translate",
                        href: "task-serdes"
                    },
                ]
            }
        },
        components: {
        }
    }
</script>
