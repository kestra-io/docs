<template>
    <div class="container">
        <Section
            subtitle="Language-Agnostic Workflows"
            subtitle-after="At Any Scale"
        >
            <div class="item workflow-1 row pb-5">
                <div class="col-md-6 px-3 px-md-5 py-0 py-md-5 position-relative">
                    <div class="connection-line-1">
                        <HomeConnectionLine :lineN="1" :strokeDasharray="strokeDasharray1"/>
                    </div>
                    <h3>Define your workflows</h3>
                    <p>
                        By using Kestra as your orchestrator, you can easily automate complex workflows, integrate with your existing data stack, and improve the speed and efficiency of your data processing.
                    </p>
                </div>
                <div class="col-md-6">
                    <div class="code">
                        <div class="code-header">
                            <img src="/landing/3dot-home.svg" alt="code">
                        </div>
                        <div class="code-content" ref="codeContainer">
                            <button class="btn content-copy-icon p-0" ref="copyBtn" @click="copyCodeContext" data-toggle="tooltip"  data-placement="top" :title="copyCodeText">
                                <img src="/landing/content_copy.svg" alt="content_copy">
                            </button>
                            <span>id:</span> api_python_sql
                            <br />
                            <span>namespace:</span> dev
                            <br />
                            <br />
                            <span>tasks:</span><br/>
                            <span>- id:</span> extract_from_api<br/>
                            <span>type:</span> io.kestra.plugin.fs.http.Request<br/>
                            <span>uri:</span> https://dummyjson.com/products<br/>
                            <br/>
                            <span>- id:</span> python_transform<br/>
                            <span>type:</span> io.kestra.plugin.scripts.python.Script<br/>
                            <span>docker:</span><br/>
                            <span>image:</span> ghcr.io/kestra-io/pydata:latest <br/>
                            <span>script:</span>|<br/>
                            import polars as pl<br/>
                            ...
                            <br/>
                            <br/>
                            <span>- id:</span> load_sql<br/>
                            <span>type:</span> io.kestra.plugin.gcp.bigquery.Load<br/>
                            <span>from:</span> {{ output }}<br/>
                            <span>destinationTable: </span>gcp_project.dataset.table<br/>
                            <br/>
                            <span>triggers:</span><br/>
                            <span>- id:</span> daily<br/>
                            <span>type:</span> io.kestra.core.models.triggers.types.Schedule<br/>
                            <span>cron:</span> "@daily"<br/>
                        </div>
                    </div>
                </div>
            </div>

            <div class="item workflow-2 row mb-5">
                <div class="col-md-6 order-1 order-md-0">
                    <img class="img-fluid" src="/landing/how/how-2.svg" alt="Integration with all data stacks" />
                </div>
                <div class="col-md-6 px-3 px-md-5 py-0 py-md-5 order-0 order-md-1 position-relative">
                    <div class="connection-line-2">
                        <HomeConnectionLine :lineN="2" :strokeDasharray="strokeDasharray2"/>
                    </div>
                    <h3>Integrate with your stack</h3>
                    <p>Kestra integrates with a wide variety of data sources and tools, so you can easily connect your workflows to your existing data stack. This includes support for popular databases, file formats, APIs, and more.</p>
                </div>
            </div>

            <div class="item workflow-3 row mb-s mb-2 mb-md-5">
                <div class="col-md-6 px-3 px-md-5 py-0 py-md-5 position-relative">
                    <div class="connection-line-3">
                        <HomeConnectionLine :lineN="3" :strokeDasharray="strokeDasharray3"/>
                    </div>
                    <h3>Schedule your workflows</h3>
                    <p>Configure your workflows to run on a schedule, in response to event-based triggers, via webhooks, or through APIs.</p>
                </div>
                <div class="col-md-6">
                    <img class="img-fluid" src="/landing/how/how-3.svg" alt="How to schedule example" />
                </div>
            </div>

            <div class="item workflow-4 row pb-5">
                <div class="col-md-6 order-1 order-md-0">
                    <img class="img-fluid" src="/landing/how/how-4.svg" alt="How to execute a flow example" />
                </div>
                <div class="col-md-6 px-3 px-md-5 py-0 py-md-5 order-0 order-md-1 position-relative">
                    <div class="connection-line-4">
                        <HomeConnectionLine :lineN="4" :strokeDasharray="strokeDasharray4"/>
                    </div>
                    <h3>Execute your workflows</h3>
                    <p>
                        When a workflow is triggered, Kestra orchestrates the execution of each step, ensuring that data is processed correctly and dependencies are satisfied.
                    </p>
                </div>
            </div>

            <div class="item workflow-5 row mb-5">
                <div class="col-md-6 px-3 px-md-5 py-0 py-md-5 position-relative">
                    <div class="connection-line-5">
                        <HomeConnectionLine :lineN="5" :strokeDasharray="strokeDasharray5"/>
                    </div>
                    <h3>Monitor and optimize your workflows</h3>
                    <p>Track the performance of your workflows, identify bottlenecks, and optimize them for speed and efficiency.</p>
                </div>
                <div class="col-md-6 row mb-5">
                    <img class="img-fluid" src="/landing/how/how-5.svg" alt="Visualization of Kestra monitoring" />
                </div>
            </div>
            <div class="text-center footer position-relative">
                <div class="connection-line-6">
                    <HomeConnectionLine :lineN="6" :strokeDasharray="strokeDasharray6"/>
                </div>
                <p class="last-words">
                    By using Kestra as your orchestrator, you can easily automate complex workflows, integrate with your existing data stack, and improve the speed and efficiency of your data processing.
                </p>
                <div class="text-center mt-5 d-flex align-items-center justify-content-center flex-wrap gap-3">
                    <NuxtLink href="https://demo.kestra.io/ui/login?auto" target="_blank" class="btn btn-animated btn-dark-animated" data-aos="zoom-in">
                        Live demo
                    </NuxtLink>
                    <NuxtLink href="/docs/getting-started" class="btn btn-animated btn-purple-animated" data-aos="zoom-in">
                        Get started
                    </NuxtLink>
                </div>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section},
        data() {
            return {
                strokeDasharray1: 1,
                strokeDasharray2: 1,
                strokeDasharray3: 1,
                strokeDasharray4: 1,
                strokeDasharray5: 1,
                strokeDasharray6: 1,
                output: `"{{ outputs.python.outputFiles['products.csv'] }}"`,
                copyCodeText: "Copy to clipboard"
            };
        },
        methods: {
            getConnectionLineOffset (lineN) {
                const connectionLine  = document.querySelector(`.connection-line-${lineN}`);
                const bodyRect = document.body.getBoundingClientRect();
                const connectionLineOffsetTop =  connectionLine.getBoundingClientRect().top - bodyRect.top - 250;
                const connectionLineOffsetBottom = connectionLineOffsetTop + connectionLine.offsetHeight - 30;
                return { top: connectionLineOffsetTop, bottom: connectionLineOffsetBottom, lineN };
            },
            connectionLineAnimation ({ top, bottom, lineN }) {
                if (window.scrollY >= top && window.scrollY <= bottom && this[`strokeDasharray${lineN}`] >= 0 && this[`strokeDasharray${lineN}`] <= 1) {
                    this[`strokeDasharray${lineN}`] = window.scrollY / 35000;
                }else if (window.scrollY > bottom) {
                    this[`strokeDasharray${lineN}`] = 0;
                } else if (window.scrollY < top) {
                    this[`strokeDasharray${lineN}`] = 1;
                }
            },
           copyCodeContext () {
              const codeToCopy = this.$refs.codeContainer.innerText;
              const copyTextArea = document.createElement('textarea');
              copyTextArea.value = codeToCopy;
              document.body.appendChild(copyTextArea);
              copyTextArea.select();
              document.execCommand('copy');
              document.body.removeChild(copyTextArea);
              this.copyCodeText = "Copied!";
              setTimeout(() => {
                this.copyCodeText = "Copy to clipboard";
              }, 1000);
           }
        },
        mounted() {
            const connectionLine1 =  this.getConnectionLineOffset(1);
            const connectionLine2 =  this.getConnectionLineOffset(2);
            const connectionLine3 =  this.getConnectionLineOffset(3);
            const connectionLine4 =  this.getConnectionLineOffset(4);
            const connectionLine5 =  this.getConnectionLineOffset(5);
            const connectionLine6 =  this.getConnectionLineOffset(6);
            window.onscroll = () => {
                this.connectionLineAnimation(connectionLine1);
                this.connectionLineAnimation(connectionLine2);
                this.connectionLineAnimation(connectionLine3);
                this.connectionLineAnimation(connectionLine4);
                this.connectionLineAnimation(connectionLine5);
                this.connectionLineAnimation(connectionLine6);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        :deep(section) {
            .subtitle {
                margin: 0 !important;
                max-width: 52%;

                @include media-breakpoint-down(lg) {
                    max-width: 100%;
                }

                p {
                    text-align: left !important;
                }
            }
        }

        .item {
            h3 {
                color: $white;
                font-family: $font-family-sans-serif;
                font-size: calc($font-size-base * 3.125);
                font-style: normal;
                font-weight: 300;
                line-height: calc($spacer * 3.375);
                @include media-breakpoint-down(sm) {
                    font-size: calc($font-size-base * 1.625);
                    line-height: calc($spacer * 2);
                }
            }

            p {
                color: #DEE0E4;
                font-family: $font-family-sans-serif;
                font-size: $h6-font-size;
                font-style: normal;
                font-weight: 400;
                line-height: calc($spacer * 1.625);
            }

        }

        .workflow {
            &-1, &-2, &-3, &-4, &-5 {
                position: relative;
                h3 {
                    position: relative;
                }
                @include media-breakpoint-down(md) {
                    margin-top: 0 !important;
                    padding-top: 0 !important;

                    h3:before {
                        display: none !important;
                    }
                }
                .connection-line {
                    &-1, &-2, &-3, &-4, &-5 {
                        position: absolute;
                    }

                    &-1 {
                        top: -33%;
                        left: 30.5%;


                        @include media-breakpoint-down(xxl) {
                            top: -27%;
                            left: 16%;
                        }

                        @include media-breakpoint-down(xl) {
                            top: -54%;
                            left: 12%;
                        }

                        @include media-breakpoint-down(lg) {
                            top: -50%;
                            left: 40%;
                        }

                        @include media-breakpoint-down(md) {
                            display: none;
                        }
                    }
                    &-2 {
                        bottom: 91%;
                        right: 63%;

                        @include media-breakpoint-down(xxl) {
                            top: -78%;
                            left: -81%;
                        }

                        @include media-breakpoint-down(xl) {
                            top: -97%;
                            left: -84%;
                        }

                        @include media-breakpoint-down(lg) {
                            top: -89%;
                            left: -55%;
                            :deep(svg) {
                                width: calc($spacer * 27.813);
                            }
                        }

                        @include media-breakpoint-down(md) {
                            display: none;
                        }
                    }

                    &-3 {
                        top: -60%;
                        left: 31%;

                        @include media-breakpoint-down(xxl) {
                            top: -67%;
                            left: 30%;
                            :deep(svg) {
                                width: calc($spacer * 37.5);
                            }
                        }

                        @include media-breakpoint-down(xl) {
                            top: -68%;
                            left: 53%;
                            :deep(svg) {
                                width: calc($spacer * 31.875);
                            }

                        }

                        @include media-breakpoint-down(lg) {
                            top: -83%;
                            left: 50%;
                            :deep(svg) {
                                width: calc($spacer * 25.938);
                            }
                        }

                        @include media-breakpoint-down(md) {
                            display: none;
                        }
                    }

                    &-4 {
                        top: -200%;
                        left: -66%;

                        @include media-breakpoint-down(xxl) {
                            top: -162%;
                            left: -68%;
                            :deep(svg) {
                                width: calc($spacer * 31.875);
                            }
                        }

                        @include media-breakpoint-down(xl) {
                            top: -135%;
                            left: -44.5%;
                            :deep(svg) {
                                width: calc($spacer * 25.625);
                            }
                        }

                        @include media-breakpoint-down(lg) {
                            left: -47%;
                            top: -159%;
                        }

                        @include media-breakpoint-down(md) {
                            display: none;
                        }
                    }

                    &-5 {
                        top: -57%;
                        left: 27.5%;

                        @include media-breakpoint-down(xxl) {
                            top: -58%;
                            left: 26.5%;
                            :deep(svg) {
                                width: calc($spacer * 33.125);
                            }
                        }

                        @include media-breakpoint-down(xl) {
                            top: -66%;
                            left: 43.4%;
                            :deep(svg) {
                                width: calc($spacer * 28.75);
                            }
                        }

                        @include media-breakpoint-down(lg) {
                            top: -78%;
                            left: 37%;
                        }

                        @include media-breakpoint-down(md) {
                            display: none;
                        }
                    }
                }

            }

            &-1 {
                padding-top: calc($spacer * 7.188);
                background: url("/landing/how/bg-1.svg") no-repeat right;
                background-size: 50%;
            }

            &-2 {
                margin-top: calc($spacer * 6.25);


                @include media-breakpoint-down(xxl) {
                    margin-top: calc($spacer * 10.938);
                }

                @include media-breakpoint-down(xl) {
                    margin-top: calc($spacer * 15.313);
                }

                @include media-breakpoint-down(lg) {
                    margin-top: calc($spacer * 8.125);
                }
            }

            &-3 {
                margin-top: calc($spacer * 7.625);
                @include media-breakpoint-down(xxl) {
                    margin-top: calc($spacer * 9.125);
                }
            }

            &-4 {
                padding-top: 6rem;
                background: url("/landing/how/bg-4.svg") no-repeat left;
                background-size: 45%;

                @include media-breakpoint-down(lg) {
                    padding-top: calc($spacer * 16.875);
                }
            }

            &-5 {
                padding-top: calc($spacer * 11.625);
                background: url("/landing/how/bg-5.svg") no-repeat right;
                background-size: 64%;

                @include media-breakpoint-down(xxl) {
                    padding-top: calc($spacer * 9.063);
                }

                @include media-breakpoint-down(xl) {
                    padding-top: calc($spacer * 6.813);
                }

            }
        }

        .footer {
            border-radius: calc($spacer * 0.5);
            border: 1px solid $black-6;
            background: $black-2;
            padding: calc($spacer * 2);
            position: relative;
            margin: calc($spacer * 11.75) auto 0;
            width: 64%;
            position: relative;
            @include media-breakpoint-down(sm) {
                padding: calc($spacer * 0.5);
            }
            .connection-line-6 {
                position: absolute;
                top: -223%;
                left: -5%;

                @include media-breakpoint-down(xxl) {
                    top: -185%;
                    left: -6.2%;
                    :deep(svg) {
                        width: calc($spacer * 24.688);
                    }
                }

                @include media-breakpoint-down(xl) {
                    top: -154%;
                    left: 7.2%;
                    :deep(svg) {
                        width: calc($spacer * 15.625);
                    }
                }

                @include media-breakpoint-down(lg) {
                    top: -133%;
                    left: 2%;
                    :deep(svg) {
                        width: calc($spacer * 12.875);
                    }
                }

                @include media-breakpoint-down(md) {
                    display: none;
                }
            }
            @include media-breakpoint-down(md) {
                margin: 0;
                width: 100%;
            }

            p {
                color: $white !important;
                text-align: center;
                font-family: $font-family-sans-serif;
                font-size: $font-size-base;
                font-style: normal;
                font-weight: 400;
                line-height: calc($spacer * 1.5);
            }
        }

        .last-words {
            color: #343434;
            font-size: large;
            text-align: center;
        }
    }

    .code {
        position: relative;
        overflow: hidden;
        border-radius: calc($spacer * 0.5);
        border: 1px solid #3D3D3F;
        .code-content {
            padding: calc($spacer * 2);
            font-family: var(--bs-font-monospace);
            color: #F2AF7D;
            white-space: pre;
            font-size: calc($font-size-base * .625);

            span {
                color: #03DABA;
            }

            @include media-breakpoint-down(xl) {
                font-size: $font-size-sm;
            }

            @include media-breakpoint-down(lg) {
                font-size: calc($font-size-base * 0.625);
            }

            @include media-breakpoint-down(md) {
                font-size: $font-size-sm;
            }

            @include media-breakpoint-down(sm) {
                font-size: calc($font-size-base * 0.563);
                padding: calc($spacer * 2) $spacer;
            }

            .content-copy-icon {
                position: absolute;
                top: calc($spacer * 1.25);
                right: calc($spacer * 1.25);
                cursor: pointer;
            }
        }

        .code-content, .code-header {
            --border-size: 1px;
            position: relative;
            z-index: 0;
            overflow: hidden;
            border: 1px solid #3D3D3F;
            background: $black-2;
            &::after {
                content: '';
                position: absolute;
                z-index: -1;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 0 0 0.5rem 0.5rem;
                transition: background-color 0.2s ease;
            }

            &::before {
                background: conic-gradient(#B010FB,
                    #DE97FF 10%,
                    #A227DB,
                    transparent 50%,
                    #A610EC);
            }
        }

        .code-header {
            padding: 0.75rem 1rem;

            &::after {
                content: '';
                position: absolute;
                z-index: -1;
                left: 1px;
                top: 1px;
                width: calc(100% - 2px);
                height: calc(100% - 2px);
                border-radius: 0.5rem 0.5rem 0 0;
                transition: background-color 0.2s ease;
            }
        }

        .text-success {
            color: #2C3F3A !important;
        }
    }
</style>
