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
                        <a :href="'plugins/' + plugin.href + (plugin.section ? '#' + plugin.section : '')" class="media key-feature align-items-center p-3 rounded-md shadow">
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
                        <div class="row">
                            <div class="col-12 col-md-6 text-md-right">
                                <a href="/plugins/" class="btn btn-primary">
                                    <i class="mdi mdi-text-box-multiple"></i>
                                    Plugins documentation
                                    <i class="mdi mdi-arrow-right"></i>
                                </a>
                            </div>
                            <div class="col-12 col-md-6 text-md-left mt-4 mt-md-0">
                                <a href="/docs/plugin-developer-guide/" class="btn btn-primary">
                                    <i class="mdi mdi-language-java"></i>
                                    Create a plugin
                                    <i class="mdi mdi-arrow-right"></i>
                                </a>
                            </div>
                        </div>
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
        components: {
        },
        computed: {
            plugins: () => {
                return [
                    {
                        name: "Bash",
                        icon: "mdi mdi-bash",
                        href: "core/tasks/scripts/org.kestra.core.tasks.scripts.Bash",
                    },
                    {
                        name: "Python",
                        icon: "mdi mdi-language-python",
                        href: "core/tasks/scripts/org.kestra.core.tasks.scripts.Python",
                    },
                    {
                        name: "Node",
                        icon: "mdi mdi-nodejs",
                        href: "core/tasks/scripts/org.kestra.core.tasks.scripts.Node",
                    },
                    {
                        name: "Amazon S3",
                        icon: "csicon csicon-s3",
                        href: "task-aws",
                        section: "#s3"
                    },
                    {
                        name: "Http",
                        icon: "mdi mdi-api",
                        href: "task-fs",
                        section: "http"
                    },
                    {
                        name: "SFTP",
                        icon: "mdi mdi-network",
                        href: "task-fs",
                        section: "sftp"
                    },
                    {
                        name: "Google Cloud Storage",
                        icon: "csicon csicon-gcs",
                        href: "task-gcp",
                        section: "gcs"
                    },
                    {
                        name: "Big Query",
                        icon: "csicon csicon-bigquery",
                        href: "task-gcp",
                        section: "bigquery"
                    },
                    {
                        name: "Open PGP",
                        icon: "mdi mdi-lock",
                        href: "task-crypto",
                        section: "openpgp"
                    },
                    {
                        name: "ClickHouse",
                        icon: "csicon csicon-clickhouse",
                        href: "task-jdbc-clickhouse"
                    },
                    {
                        name: "MySQL",
                        icon: "csicon csicon-mysql",
                        href: "task-jdbc-mysql"
                    },
                    {
                        name: "Postgres",
                        icon: "csicon csicon-postgres",
                        href: "task-jdbc-postgres"
                    },
                    {
                        name: "Vertica",
                        icon: "csicon csicon-vertica",
                        href: "task-jdbc-vertica"
                    },
                    {
                        name: "Kubernetes",
                        icon: "mdi mdi-kubernetes",
                        href: "task-kubernetes"
                    },
                    {
                        name: "Slack",
                        icon: "csicon csicon-slack",
                        href: "task-notifications",
                        section: "slack"
                    },
                    {
                        name: "Email",
                        icon: "mdi mdi-email",
                        href: "task-notifications",
                        section: "mail"
                    },
                    {
                        name: "Avro",
                        icon: "csicon csicon-avro",
                        href: "task-serdes",
                        section: "avro"
                    },
                    {
                        name: "JSON",
                        icon: "mdi mdi-code-json",
                        href: "task-serdes",
                        section: "json"
                    },
                    {
                        name: "CSV",
                        icon: "mdi mdi-file-delimited",
                        href: "task-serdes",
                        section: "csv"
                    },
                    {
                        name: "Nashorn",
                        icon: "csicon csicon-nashorn",
                        href: "task-scripts-nashorn"
                    },
                    {
                        name: "Groovy",
                        icon: "csicon csicon-groovy",
                        href: "task-scripts-groovy"
                    },
                    {
                        name: "Jython",
                        icon: "csicon csicon-jython",
                        href: "task-scripts-jython"
                    },

                ].sort((a, b) => (a.name > b.name) ? 1 : -1)
            }
        }
    }
</script>

<style lang="scss">
@import "../styles/landing/variables";

i.csicon {
    height: 45px;
    width: 45px;
    display: block;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
    //filter: grayscale(100%) brightness(30%) sepia(100%) hue-rotate(-180deg) saturate(300%) contrast(0.8);

    &.csicon-avro {
        background-image: url("./LandingPlugins/avro.png");
    }

    &.csicon-bigquery {
        background-image: url("./LandingPlugins/bigquery.png");
    }

    &.csicon-clickhouse {
        background-image: url("./LandingPlugins/clickhouse.png");
    }

    &.csicon-gcs {
        background-image: url("./LandingPlugins/gcs.png");
    }

    &.csicon-mysql {
        background-image: url("./LandingPlugins/mysql.png");
    }

    &.csicon-postgres {
        background-image: url("./LandingPlugins/postgres.png");
    }

    &.csicon-s3 {
        background-image: url("./LandingPlugins/s3.png");
    }

    &.csicon-slack {
        background-image: url("./LandingPlugins/slack.png");
    }

    &.csicon-vertica {
        background-image: url("./LandingPlugins/vertica.png");
    }

    &.csicon-jython {
        background-image: url("./LandingPlugins/jython.png");
    }

    &.csicon-groovy {
        background-image: url("./LandingPlugins/groovy.png");
    }

    &.csicon-nashorn {
        background-image: url("./LandingPlugins/nashorn.png");
    }
}

</style>
