<template>
    <div>
        <section class="section overflow-hidden">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="section-title text-center pb-2">
                            <h4 class="title mb-4" data-aos="fade-right">Discover plugins or build your own!</h4>
                            <p class="text-muted para-desc mb-0 mx-auto" data-aos="fade-left">
                                <span class="text-primary mb-0 font-weight-bold">Kestra</span> is built on plugin systems.
                                You can find your plugin to interact with your provider; alternatively, you can follow simple steps to develop your own plugin.
                                Here are the official plugins that are available:
                            </p>
                        </div>
                    </div>
                    <!--end col-->
                </div>
                <!--end row-->

                <div class="row">
                    <div class="col-lg-4 col-6 mt-4 pt-2" v-for="plugin in plugins">
                        <router-link :to="'plugins/' + plugin.href + (plugin.section ? '#' + plugin.section + '/' : '')"
                           class="media key-feature align-items-center p-3 rounded-md shadow"
                            data-aos="flip-up"
                        >
                            <div class="icon text-center rounded-circle mr-3 text-primary">
                                <i v-if="plugin.icon && typeof plugin.icon === 'string'" :class="plugin.icon">
                                    <img v-if="plugin.image" :src="'data:image/svg+xml;base64,' + plugin.image"
                                         :alt="plugin.name" />
                                </i>
                                <span class="icon-cpn" v-else-if="plugin.icon" :is="plugin.icon" />
                            </div>
                            <div class="media-body">
                                <h4 class="title mb-0">{{ plugin.name }}</h4>
                            </div>
                        </router-link>
                    </div>
                    <!--end col-->

                    <div class="col-12 mt-4 pt-2 text-center">
                        <div class="row">
                            <div class="col-12 col-md-6 text-md-right" data-aos="zoom-in">
                                <router-link to="/plugins" class="btn btn-primary">
                                    <TextBoxMultiple title="" />
                                    Plugins documentation
                                    <ArrowRight title="" />
                                </router-link>
                            </div>
                            <div class="col-12 col-md-6 text-md-left mt-4 mt-md-0" data-aos="zoom-in">
                                <router-link to="/docs/plugin-developer-guide" class="btn btn-primary">
                                    <LanguageJava title="" />
                                    Create a plugin
                                    <ArrowRight title="" />
                                </router-link>
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
import TextBoxMultiple from 'vue-material-design-icons/TextBoxMultiple'
import ArrowRight from 'vue-material-design-icons/ArrowRight'
import Bash from 'vue-material-design-icons/Bash'
import LanguagePython from 'vue-material-design-icons/LanguagePython'
import LanguageJava from 'vue-material-design-icons/LanguageJava'
import Nodejs from 'vue-material-design-icons/Nodejs'
import Api from 'vue-material-design-icons/Api'
import Network from 'vue-material-design-icons/Network'
import Lock from 'vue-material-design-icons/Lock'
import Kubernetes from 'vue-material-design-icons/Kubernetes'
import ApacheKafka from 'vue-material-design-icons/ApacheKafka'
import Email from 'vue-material-design-icons/Email'
import CodeJson from 'vue-material-design-icons/CodeJson'
import FileDelimited from 'vue-material-design-icons/FileDelimited'
import FileCode from 'vue-material-design-icons/FileCode'


export default {
    components: {
        TextBoxMultiple,
        ArrowRight,
        Bash,
        LanguagePython,
        LanguageJava,
        Nodejs,
        Api,
        Network,
        Lock,
        Kubernetes,
        Email,
        CodeJson,
        FileDelimited,
        FileCode,
    },
    computed: {
        plugins() {
            let plugins = [
                {
                    name: "Bash",
                    icon: Bash,
                    href: "core/tasks/scripts/io.kestra.core.tasks.scripts.Bash",
                },
                {
                    name: "Python",
                    icon: LanguagePython,
                    href: "core/tasks/scripts/io.kestra.core.tasks.scripts.Python",
                },
                {
                    name: "Node",
                    icon: Nodejs,
                    href: "core/tasks/scripts/io.kestra.core.tasks.scripts.Node",
                },
                {
                    name: "Amazon S3",
                    icon: "csicon csicon-s3",
                    href: "plugin-aws",
                    section: "#s3"
                },
                {
                    name: "Amazon DynamoDB",
                    icon: "csicon csicon-dynamodb",
                    href: "plugin-aws",
                    section: "#dynamodb"
                },
                {
                    name: "Amazon SNS",
                    icon: "csicon csicon-sns",
                    href: "plugin-aws",
                    section: "#sns"
                },
                {
                    name: "Amazon SQS",
                    icon: "csicon csicon-sqs",
                    href: "plugin-aws",
                    section: "#sqs"
                },
                {
                    name: "Http",
                    icon: Api,
                    href: "plugin-fs",
                    section: "http"
                },
                {
                    name: "SFTP",
                    icon: Network,
                    href: "plugin-fs",
                    section: "sftp"
                },
                {
                    name: "FTP",
                    icon: Network,
                    href: "plugin-fs",
                    section: "ftp"
                },
                {
                    name: "FTPS",
                    icon: Network,
                    href: "plugin-fs",
                    section: "ftps"
                },
                {
                    name: "Google Cloud Storage",
                    icon: "csicon csicon-gcs",
                    href: "plugin-gcp",
                    section: "gcs"
                },
                {
                    name: "Big Query",
                    icon: "csicon csicon-bigquery",
                    href: "plugin-gcp",
                    section: "bigquery"
                },
                {
                    name: "Firestore",
                    icon: "csicon csicon-firestore",
                    href: "plugin-gcp",
                    section: "firestore"
                },
                {
                    name: "Pub/Sub",
                    icon: "csicon csicon-pubsub",
                    href: "plugin-gcp",
                    section: "pubsub"
                },
                {
                    name: "Vertex AI",
                    icon: "csicon csicon-vertexai",
                    href: "plugin-gcp",
                    section: "vertexai"
                },
                {
                    name: "Google Sheets",
                    icon: "csicon csicon-sheets",
                    href: "plugin-googleworkspace",
                    section: "sheets"
                },
                {
                    name: "Google Drive",
                    icon: "csicon csicon-drive",
                    href: "plugin-googleworkspace",
                    section: "drive"
                },
                {
                    name: "Open PGP",
                    icon: Lock,
                    href: "plugin-crypto",
                    section: "openpgp"
                },
                {
                    name: "ClickHouse",
                    icon: "csicon csicon-clickhouse",
                    href: "plugin-jdbc-clickhouse"
                },
                {
                    name: "Debezium MySQL",
                    icon: "csicon csicon-debezium-mysql",
                    href: "plugin-debezium-mysql"
                },
                {
                    name: "MySQL",
                    icon: "csicon csicon-mysql",
                    href: "plugin-jdbc-mysql"
                },
                {
                    name: "Redshift",
                    icon: "csicon csicon-redshift",
                    href: "plugin-jdbc-redshift"
                },
                {
                    name: "Oracle",
                    icon: "csicon csicon-oracle",
                    href: "plugin-jdbc-oracle"
                },
                {
                    name: "Postgres",
                    icon: "csicon csicon-postgres",
                    href: "plugin-jdbc-postgres"
                },
                {
                    name: "Trino",
                    icon: "csicon csicon-trino",
                    href: "plugin-jdbc-trino"
                },
                {
                    name: "Rockset",
                    icon: "csicon csicon-rockset",
                    href: "plugin-jdbc-rockset"
                },
                {
                    name: "Pinot",
                    icon: "csicon csicon-pinot",
                    href: "plugin-jdbc-pinot"
                },
                {
                    name: "DuckDb",
                    icon: "csicon csicon-duckdb",
                    href: "plugin-jdbc-duckdb"
                },
                {
                    name: "Snowflake",
                    icon: "csicon csicon-snowflake",
                    href: "plugin-jdbc-snowflake"
                },
                {
                    name: "Debezium Postgres",
                    icon: "csicon csicon-debezium-postgres",
                    href: "plugin-debezium-postgres"
                },
                {
                    name: "Debezium SQL Server",
                    icon: "csicon csicon-debezium-sqlserver",
                    href: "plugin-debezium-sqlserver"
                },
                {
                    name: "Vertica",
                    icon: "csicon csicon-vertica",
                    href: "plugin-jdbc-vertica"
                },
                {
                    name: "Vectorwise",
                    icon: "csicon csicon-vectorwise",
                    href: "plugin-jdbc-vectorwise"
                },
                {
                    name: "Microsoft SQL Server",
                    icon: "csicon csicon-sqlserver",
                    href: "plugin-jdbc-sqlserver"
                },
                {
                    name: "Kubernetes",
                    icon: Kubernetes,
                    href: "plugin-kubernetes"
                },
                {
                    name: "Kafka",
                    icon: ApacheKafka,
                    href: "plugin-kafka"
                },
                {
                    name: "Slack",
                    icon: "csicon csicon-slack",
                    href: "plugin-notifications",
                    section: "slack"
                },
                {
                    name: "Soda",
                    icon: "csicon csicon-soda",
                    href: "plugin-soda",
                },
                {
                    name: "Singer",
                    icon: "csicon csicon-singer",
                    href: "plugin-singer",
                },
                {
                    name: "Email",
                    icon: Email,
                    href: "plugin-notifications",
                    section: "mail"
                },
                {
                    name: "Avro",
                    icon: "csicon csicon-avro",
                    href: "plugin-serdes",
                    section: "avro"
                },
                {
                    name: "JSON",
                    icon: CodeJson,
                    href: "plugin-serdes",
                    section: "json"
                },
                {
                    name: "CSV",
                    icon: FileDelimited,
                    href: "plugin-serdes",
                    section: "csv"
                },
                {
                    name: "Parquet",
                    icon: "csicon csicon-parquet",
                    href: "plugin-serdes",
                    section: "parquet"
                },
                {
                    name: "Nashorn",
                    icon: "csicon csicon-nashorn",
                    href: "plugin-scripts-nashorn"
                },
                {
                    name: "Groovy",
                    icon: "csicon csicon-groovy",
                    href: "plugin-scripts-groovy"
                },
                {
                    name: "Jython",
                    icon: "csicon csicon-jython",
                    href: "plugin-scripts-jython"
                },
                {
                    name: "XML",
                    icon: FileCode,
                    href: "plugin-serdes",
                    section: "xml"
                },
                {
                    name: "ElasticSearch",
                    icon: "csicon csicon-elasticsearch",
                    href: "plugin-elasticsearch"
                },
                {
                    name: "MongoDb",
                    icon: "csicon csicon-mongodb",
                    href: "plugin-mongodb"
                },
                {
                    name: "Spark",
                    icon: "csicon csicon-spark",
                    href: "plugin-spark"
                },
                {
                    name: "Dbt",
                    icon: "csicon csicon-dbt",
                    href: "plugin-dbt"
                },
                {
                    name: "Cassandra",
                    icon: "csicon csicon-cassandra",
                    href: "plugin-cassandra"
                },
                {
                    name: "MQTT",
                    icon: "csicon csicon-mqtt",
                    href: "plugin-mqtt"
                },
                {
                    name: "Azure Blob Storage",
                    icon: "csicon csicon-abs",
                    href: "plugin-azure",
                    section: "storage-blob"
                },
                {
                    name: "Tika",
                    icon: "csicon csicon-tika",
                    href: "plugin-tika"
                },
                {
                    name: "Power BI",
                    icon: "csicon csicon-powerbi",
                    href: "plugin-powerbi"
                },
                {
                    name: "ServiceNow",
                    icon: "csicon csicon-servicenow",
                    href: "plugin-servicenow"
                },
                {
                    name: "Pulsar",
                    icon: "csicon csicon-pulsar",
                    href: "plugin-pulsar"
                },
                {
                    name: "Airbyte",
                    icon: "csicon csicon-airbyte",
                    href: "plugin-airbyte"
                },
                {
                    name: "Fivetran",
                    icon: "csicon csicon-fivetran",
                    href: "plugin-fivetran"
                },
                {
                    name: "Redis",
                    icon: "csicon csicon-redis",
                    href: "plugin-redis"
                },
                {
                    name: "Amqp",
                    icon: "csicon csicon-amqp",
                    href: "plugin-amqp"
                },
                {
                    name: "Neo4j",
                    icon: "csicon csicon-neo4j",
                    href: "plugin-neo4j"
                },
            ];

            // Order by publish date, desc
            // plugins = plugins.concat(this.$site.pages
            //     .filter(item => item.path.startsWith("/plugins/plugin-singer/tasks/"))
            //     .filter(item => !item.path.includes("Postgres") &&
            //         !item.path.includes("Mysql") &&
            //         !item.path.includes("Redshift") &&
            //         !item.path.includes("BigQuery") &&
            //         !item.path.includes("Csv") &&
            //         !item.path.includes("Json") &&
            //         !item.path.includes("Slack") &&
            //         !item.path.includes("MongoDb")
            //     )
            //     .map(r => {
            //         return {
            //             name: r.title.replace("Pipelinewise", "").replace("Meltano", ""),
            //             icon: "csicon",
            //             image: r.frontmatter && r.frontmatter.icon ? r.frontmatter.icon : null,
            //             href: r.path.replace("/plugins/", ""),
            //         }
            //     })
            // );

            return plugins.sort((a, b) => (a.name > b.name) ? 1 : -1);
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../../theme/styles/variables";

i.csicon {
    height: 45px;
    width: 45px;
    display: block;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
    //filter: grayscale(100%) brightness(30%) sepia(100%) hue-rotate(-180deg) saturate(300%) contrast(0.8);

    img {
        max-width: 35px;
        max-height: 35px;
    }

    &.csicon-avro {
        background-image: url("../../assets/home/avro.png");
    }

    &.csicon-parquet {
        background-image: url("../../assets/home/parquet.svg");
    }

    &.csicon-bigquery {
        background-image: url("../../assets/home/bigquery.svg");
    }

    &.csicon-firestore {
        background-image: url("../../assets/home/firestore.svg");
    }

    &.csicon-pubsub {
        background-image: url("../../assets/home/pubsub.svg");
    }

    &.csicon-clickhouse {
        background-image: url("../../assets/home/clickhouse.png");
    }

    &.csicon-gcs {
        background-image: url("../../assets/home/gcs.svg");
    }

    &.csicon-drive {
        background-image: url("../../assets/home/gcs.svg");
    }

    &.csicon-sheets {
        background-image: url("../../assets/home/sheets.svg");
    }

    &.csicon-drive {
        background-image: url("../../assets/home/drive.svg");
    }

    &.csicon-mysql {
        background-image: url("../../assets/home/mysql.png");
    }

    &.csicon-postgres {
        background-image: url("../../assets/home/postgres.png");
    }

    &.csicon-s3 {
        background-image: url("../../assets/home/s3.png");
    }

    &.csicon-dynamodb {
        background-image: url("../../assets/home/dynamodb.png");
    }

    &.csicon-sns {
        background-image: url("../../assets/home/sns.png");
    }

    &.csicon-sqs {
        background-image: url("../../assets/home/sqs.png");
    }

    &.csicon-redshift {
        background-image: url("../../assets/home/redshift.svg");
    }

    &.csicon-slack {
        background-image: url("../../assets/home/slack.png");
    }

    &.csicon-vertica {
        background-image: url("../../assets/home/vertica.png");
    }

    &.csicon-jython {
        background-image: url("../../assets/home/jython.png");
    }

    &.csicon-groovy {
        background-image: url("../../assets/home/groovy.png");
    }

    &.csicon-nashorn {
        background-image: url("../../assets/home/nashorn.png");
    }

    &.csicon-oracle {
        background-image: url("../../assets/home/oracle.svg");
    }

    &.csicon-singer {
        background-image: url("../../assets/home/singer.svg");
    }

    &.csicon-soda {
        background-image: url("../../assets/home/soda.svg");
    }

    &.csicon-elasticsearch {
        background-image: url("../../assets/home/elasticsearch.svg");
    }

    &.csicon-mongodb {
        background-image: url("../../assets/home/mongodb.svg");
    }

    &.csicon-vectorwise {
        background-image: url("../../assets/home/vectorwise.png");
    }

    &.csicon-sqlserver {
        background-image: url("../../assets/home/sqlserver.svg");
    }

    &.csicon-debezium-mysql {
        background-image: url("../../assets/home/debezium-mysql.svg");
    }

    &.csicon-debezium-postgres {
        background-image: url("../../assets/home/debezium-postgres.svg");
    }

    &.csicon-debezium-sqlserver {
        background-image: url("../../assets/home/debezium-sqlserver.svg");
    }

    &.csicon-snowflake {
        background-image: url("../../assets/home/snowflake.svg");
    }

    &.csicon-spark {
        background-image: url("../../assets/home/spark.svg");
    }

    &.csicon-dbt {
        background-image: url("../../assets/home/dbt.svg");
    }

    &.csicon-cassandra {
        background-image: url("../../assets/home/cassandra.svg");
    }

    &.csicon-mqtt {
        background-image: url("../../assets/home/mqtt.svg");
    }

    &.csicon-abs {
        background-image: url("../../assets/home/abs.svg");
    }

    &.csicon-vertexai {
        background-image: url("../../assets/home/vertexai.svg");
    }

    &.csicon-tika {
        background-image: url("../../assets/home/tika.svg");
    }

    &.csicon-powerbi {
        background-image: url("../../assets/home/powerbi.svg");
    }

    &.csicon-servicenow {
        background-image: url("../../assets/home/servicenow.svg");
    }

    &.csicon-trino {
        background-image: url("../../assets/home/trino.svg");
    }

    &.csicon-rockset {
        background-image: url("../../assets/home/rockset.svg");
    }

    &.csicon-pinot {
        background-image: url("../../assets/home/pinot.svg");
    }

    &.csicon-pulsar {
        background-image: url("../../assets/home/pulsar.svg");
    }

    &.csicon-duckdb {
        background-image: url("../../assets/home/duckdb.svg");
    }

    &.csicon-airbyte {
        background-image: url("../../assets/home/airbyte.svg");
    }

    &.csicon-fivetran {
        background-image: url("../../assets/home/fivetran.svg");
    }

    &.csicon-redis {
        background-image: url("../../assets/home/redis.svg");
    }

    &.csicon-amqp {
        background-image: url("../../assets/home/amqp.svg");
    }

    &.csicon-neo4j {
        background-image: url("../../assets/home/neo4j.svg");
    }
}

</style>
