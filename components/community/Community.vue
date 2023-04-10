<template>
    <div class="container-fluid bg-body-tertiary">
        <div class="container">
            <div class="row">
                <div class="col-md-6 text-right">
                    <img src="/landing/community/frame_580.png"/>
                    <h3>Kestra is built by the open-source community</h3>
                    <p>
                        Inspire and get inspired. Join our community of maintainers and contributors and help us make Kestra better!
                    </p>
                </div>
                <div class="col-md-6">
                    <table class="community">
                        <tr>
                            <td>
                                <img src="/landing/community/purple_star.png"/>
                                <p>
                                    Stars <br>
                                    <span class="number"><CountTo :endVal="metrics ? metrics.stars : 0" :duration="4000"></CountTo></span>
                                </p>
                            </td>
                            <td>
                                <img src="/landing/community/purple_star.png"/>
                                <p>
                                    Forks <br>
                                    <span class="number"><CountTo :endVal="metrics ? metrics.forks : 0" :duration="4000"></CountTo></span>
                                </p>
                            </td>
                            <td>
                                <img src="/landing/community/purple_star.png"/>
                                <p>
                                    Issues <br>
                                    <span class="number"><CountTo :endVal="metrics ? metrics.issues : 0" :duration="4000"></CountTo></span>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <img src="/landing/community/purple_star.png"/>
                                <p>
                                    Pull requests <br>
                                    <span class="number"><CountTo :endVal="metrics ? metrics.pullRequests : 0" :duration="4000"></CountTo></span>
                                </p>
                            </td>
                            <td>
                                <img src="/landing/community/purple_star.png"/>
                                <p>
                                    Commits <br>
                                    <span class="number"><CountTo :endVal="metrics ? metrics.commits : 0" :duration="4000"></CountTo></span>
                                </p>
                            </td>
                            <td>
                                <img src="/landing/community/purple_star.png"/>
                                <p>
                                    Contributors <br>
                                    <span class="number"><CountTo :endVal="contributors ? contributors.length : 0" :duration="4000"></CountTo></span>
                                </p>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="container text-center community-links">
                <a href="https://github.com/kestra-io/kestra" class="btn btn-lg btn-dark me-2">Follow on GitHub</a>
                <a href="https://github.com/kestra-io/kestra/issues" class="btn btn-lg btn-primary">Find Open Issues</a>
            </div>
        </div>
    </div>
</template>

<script>
    import Section from '../../components/layout/Section.vue';
    import {CountTo} from 'vue3-count-to';
    import axios from "axios";

    export default {
        components: {Section, CountTo},
        data() {
            return {
                metrics: undefined,
                contributors: undefined
            };
        },
        created() {
            axios.get("https://api.kestra.io/v1/communities/github/metrics")
                .then(response => {
                    this.metrics = response.data;
                })

            axios.get("https://api.kestra.io/v1/communities/github/contributors")
                .then(response => {
                    this.contributors = response.data;
                })
        }
    }
</script>


<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: $purple-7;
        color: var(--bs-white);

        .row {
            .text-right {
                text-align: right;
            }
            div {
                padding: calc($spacer * 2);
                padding-top: calc($spacer * 4);
            }
       }
    }

    .container {
        .community-links {
            padding-bottom: calc($spacer * 2);
        }
    }

    table.community {
        width: 100%;

        td {
            text-align: center;
        }

        .number {
            font-size: $h4-font-size;
            margin-top: 0px;
        }
    }
</style>