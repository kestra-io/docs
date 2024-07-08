<template>
    <div class="container">
        <Section
            subtitle="Language-Agnostic Workflows"
            subtitle-after="At Any Scale"
        >
            <div class="item workflow-1 row pb-5">
                <div class="col-md-6 px-3 px-md-5 py-0 py-md-5 position-relative d-flex flex-column justify-content-center">
                    <div class="connection-line-1">
                        <HomeConnectionLine :lineN="1" :strokeDasharray="strokeDasharray1"/>
                    </div>
                    <h3>Define your workflows</h3>
                    <p>
                        By using Kestra as your orchestrator, you can easily automate complex workflows, integrate with your existing data stack, and improve the speed and efficiency of your data processing.
                    </p>
                </div>
                <div class="col-md-6 code-container">
                    <div class="code">
                        <div class="code-header">
                            <img src="/landing/3dot-home.svg" alt="code">
                        </div>
                        <div class="code-content" ref="codeContainer">
                            <div class="copied-block">
                                <div ref="copyTooltip" v-if="!!copyIconResetTimer" id="copied-tooltip" role="tooltip">
                                    Copied!
                                    <div id="arrow" data-popper-arrow></div>
                                </div>
                            </div>
                            <button class="btn content-copy-icon p-0" ref="copyBtn" @click="copyCodeContext" data-toggle="tooltip"  data-placement="top" :title="copyCodeText">
                                <img src="/landing/content_copy.svg" alt="content_copy">
                            </button>
                            <span>id:</span> api_python_sql
                            <br />
                            <span>namespace:</span> company.team
                            <br />
                            <br />
                            <span>tasks:</span><br/>
                            <div class="ms-1">
                                <span class="ms-1">- id:</span> extract_from_api<br/>
                                <span class="ms-3">type:</span> io.kestra.plugin.core.http.Request<br/>
                                <span class="ms-3">uri:</span> https://dummyjson.com/products<br/>
                                <br/>
                                <span class="ms-1">- id:</span> python_transform<br/>
                                <span class="ms-3">type:</span> io.kestra.plugin.scripts.python.Script<br/>
                                <span class="ms-3">docker:</span><br/>
                                <span class="ms-4">image:</span> ghcr.io/kestra-io/pydata:latest <br/>
                                <span class="ms-3">script:</span>|<br/>
                                <i class="fst-normal ms-3">
                                    import polars as pl
                                </i>
                                <br>
                                <i class="ms-3">
                                    ...
                                </i>
                                <br/>
                                <br/>
                                <span class="ms-1">- id:</span> load_sql<br/>
                                <span class="ms-3">type:</span> io.kestra.plugin.gcp.bigquery.Load<br/>
                                <span class="ms-3">from:</span> {{ output }}<br/>
                                <span class="ms-3">destinationTable: </span>gcp_project.dataset.table<br/>
                                <br/>
                            </div>
                            <span>triggers:</span><br/>
                            <div class="ms-1">
                                <span class="ms-1">- id:</span> daily<br/>
                                <span class="ms-3">type:</span> io.kestra.plugin.core.trigger.Schedule<br/>
                                <span class="ms-3">cron:</span> "@daily"<br/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="item workflow-2 row mb-5">
                <div class="col-md-6 order-1 order-md-0">
                    <div class="img-container">
                        <NuxtImg width="100%" loading="lazy" format="webp" class="img-fluid" src="/landing/how/how-2.svg" alt="Integration with all data stacks" />
                    </div>
                </div>
                <div class="col-md-6 px-3 px-md-5 py-0 py-md-5 order-0 order-md-1 position-relative d-flex flex-column justify-content-center">
                    <div class="connection-line-2">
                        <HomeConnectionLine :lineN="2" :strokeDasharray="strokeDasharray2"/>
                    </div>
                    <h3>Integrate with your stack</h3>
                    <p>Kestra integrates with a wide variety of data sources and tools, so you can easily connect your workflows to your existing data stack. This includes support for popular databases, file formats, APIs, and more.</p>
                </div>
            </div>

            <div class="item workflow-3 row mb-s mb-2 mb-md-5">
                <div class="col-md-6 px-3 px-md-5 py-0 py-md-5 position-relative d-flex flex-column justify-content-center">
                    <div class="connection-line-3">
                        <HomeConnectionLine :lineN="3" :strokeDasharray="strokeDasharray3"/>
                    </div>
                    <h3>Schedule your workflows</h3>
                    <p><p>Configure your workflows to run on a schedule, in response to event-based triggers, via webhooks, through APIs, or in real-time with milliseconds latency.</p>
                </div>
                <div class="col-md-6">
                    <div class="img-container">
                        <NuxtImg width="100%" loading="lazy" format="webp" class="img-fluid" src="/landing/how/how-3.svg" alt="How to schedule example" />
                    </div>
                </div>
            </div>

            <div class="item workflow-4 row pb-5">
                <div class="col-md-6 order-1 order-md-0">
                    <div class="img-container">
                        <NuxtImg width="100%" loading="lazy" format="webp" class="img-fluid" src="/landing/how/how-4.svg" alt="How to execute a flow example" />
                    </div>
                </div>
                <div class="col-md-6 px-3 px-md-5 py-0 py-md-5 order-0 order-md-1 position-relative d-flex flex-column justify-content-center">
                    <div class="connection-line-4">
                        <HomeConnectionLine :lineN="4" :strokeDasharray="strokeDasharray4"/>
                    </div>
                    <h3>Execute your workflows</h3>
                    <p>
                        When a workflow is triggered, Kestra orchestrates the execution of each step, ensuring that data is processed correctly and dependencies are satisfied. With built-in scalability, Kestra handles growing workloads, and offers robust retry options to ensure reliable execution even in the face of failures.
                    </p>
                </div>
            </div>

            <div class="item workflow-5 row mb-5">
                <div class="col-md-6 px-3 px-md-5 py-0 py-md-5 position-relative d-flex flex-column justify-content-center">
                    <div class="connection-line-5">
                        <HomeConnectionLine :lineN="5" :strokeDasharray="strokeDasharray5"/>
                    </div>
                    <h3>Monitor and optimize your workflows</h3>
                    <p>Track the performance of your workflows, identify bottlenecks, and optimize them for speed and efficiency.</p>
                </div>
                <div class="col-md-6 mb-5">
                    <div class="img-container">
                        <NuxtImg width="100%" loading="lazy" format="webp" class="img-fluid" src="/landing/how/how-5.svg" alt="Visualization of Kestra monitoring" />
                    </div>
                </div>
            </div>
            <div class="text-center footer position-relative">
                <div class="connection-line-6">
                    <HomeConnectionLine :lineN="6" :strokeDasharray="strokeDasharray6"/>
                </div>
                <p class="last-words">
                 15,000+ engineers trust Kestra to declartively build their workflows. Be the next!
                </p>
                <div class="text-center mt-5 d-flex align-items-center justify-content-center flex-wrap gap-3">
                    <NuxtLink href="https://github.com/kestra-io/kestra" target="_blank" class="btn btn-animated btn-dark-animated" data-aos="zoom-in">
                        Get started
                    </NuxtLink>
                    <NuxtLink href="/docs/getting-started" class="btn btn-animated btn-purple-animated" data-aos="zoom-in">
                        Read the docs
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
                copyCodeText: "Copy to clipboard",
               copyIconResetTimer: undefined,
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
              this.copyIconResetTimer = setTimeout(() => {
                this.copyIconResetTimer = undefined;
              }, 2000)
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
                        top: -27%;
                        left: -5%;

                        :deep(svg) {
                            width: calc($spacer * 40);
                            height: calc($spacer * 15);
                        }

                        @include media-breakpoint-down(xxl) {
                            top: -29%;
                            left: -20.5%;
                        }

                        @include media-breakpoint-down(xl) {
                            top: -23%;
                            left: -21.5%;
                        }

                        @include media-breakpoint-down(lg) {
                            top: -25%;
                            left: 16.5%;

                            :deep(svg) {
                                width: calc($spacer * 15);
                                height: calc($spacer * 9);
                            }
                        }

                        @include media-breakpoint-down(md) {
                            display: none;
                        }
                    }
                    &-2 {
                        bottom: 73%;
                        right: 66.5%;

                        @include media-breakpoint-down(xxl) {
                            top: -68%;
                            left: -81.5%;
                        }

                        @include media-breakpoint-down(xl) {
                            top: -105%;
                            left: -75.5%;
                            :deep(svg) {
                                width: calc($spacer * 35);
                            }
                        }

                        @include media-breakpoint-down(lg) {
                            top: -95%;
                            left: -67%;
                            :deep(svg) {
                                width: calc($spacer * 25);
                            }
                        }

                        @include media-breakpoint-down(md) {
                            display: none;
                        }
                    }

                    &-3 {
                        top: -36%;
                        left: 27.5%;

                        @include media-breakpoint-down(xxl) {
                            top: -46%;
                            left: 31%;
                            :deep(svg) {
                                width: calc($spacer * 37.5);
                            }
                        }

                        @include media-breakpoint-down(xl) {
                            top: -55%;
                            left: 28%;
                            :deep(svg) {
                                width: calc($spacer * 33);
                            }

                        }

                        @include media-breakpoint-down(lg) {
                            top: -80%;
                            left: 17%;
                            :deep(svg) {
                                width: calc($spacer * 28);
                            }
                        }

                        @include media-breakpoint-down(md) {
                            display: none;
                        }
                    }

                    &-4 {
                        top: -137%;
                        left: -70%;
                        :deep(svg) {
                            height: calc($spacer * 29);
                        }

                        @include media-breakpoint-down(xxl) {
                            top: -123%;
                            left: -66.5%;
                            :deep(svg) {
                                width: calc($spacer * 35);
                            }
                        }

                        @include media-breakpoint-down(xl) {
                            top: -106%;
                            left: -69%;
                            :deep(svg) {
                                width: calc($spacer * 33);
                            }
                        }

                        @include media-breakpoint-down(lg) {
                            left: -80%;
                            top: -123%;
                        }

                        @include media-breakpoint-down(md) {
                            display: none;
                        }
                    }

                    &-5 {
                        top: -48%;
                        left: 39%;

                        @include media-breakpoint-down(xxl) {
                            top: -52%;
                            left: 37%;
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
                            left: 36%;
                        }

                        @include media-breakpoint-down(md) {
                            display: none;
                        }
                    }
                }

            }

            &-1 {
                padding-top: calc($spacer * 7.188);
                background: url("/landing/how/bg-1.webp") no-repeat right;
                background-size: 50%;
            }

            &-2 {
                margin-top: calc($spacer * 6.25);

                .img-container {
                    height: calc($spacer * 31.3);
                    img {
                        height: 100%;
                    }
                }

                @include media-breakpoint-down(xxl) {
                    margin-top: calc($spacer * 10.938);
                    .img-container {
                        height: calc($spacer * 31.2);
                    }
                }

                @include media-breakpoint-down(xl) {
                    margin-top: calc($spacer * 15.313);
                    .img-container {
                        height: calc($spacer * 26);
                    }
                }

                @include media-breakpoint-down(lg) {
                    margin-top: calc($spacer * 8.125);
                    .img-container {
                        height: calc($spacer * 19.1);
                    }
                }

                @include media-breakpoint-down(md) {
                    .img-container {
                        height: calc($spacer * 29.4);
                        img {
                            width: 100%;
                        }
                    }
                }
            }

            &-3 {
                margin-top: calc($spacer * 7.625);

                .img-container {
                    height: calc($spacer * 41.2);
                    img {
                        height: 100%;
                    }

                    @include media-breakpoint-down(xxl) {
                        height: calc($spacer * 35.4);
                    }

                    @include media-breakpoint-down(xl) {
                        height: calc($spacer * 41.1);
                    }

                    @media only screen and (max-width: 1200px) {
                        height: calc($spacer * 29.5);
                    }

                    @include media-breakpoint-down(lg) {
                        height: calc($spacer * 21.6);
                    }

                    @include media-breakpoint-down(md) {
                        height: calc($spacer * 33.4);
                        width: 100%;
                        img {
                            width: 100%;
                        }
                    }
                }

                @include media-breakpoint-down(xxl) {
                    margin-top: calc($spacer * 9.125);
                }
            }

            &-4 {
                padding-top: 6rem;
                background: url("/landing/how/bg-4.webp") no-repeat left;
                background-size: 45%;
                .img-container {
                    height: calc($spacer * 19.1);
                    img {
                        height: 100%;
                    }

                    @include media-breakpoint-down(xl) {
                        height: calc($spacer * 15.7);
                    }

                    @include media-breakpoint-down(lg) {
                        height: calc($spacer * 11.5);
                    }

                    @include media-breakpoint-down(md) {
                        height: calc($spacer * 17.8);
                        width: 100%;
                        img {
                            width: 100%;
                        }
                    }
                }

                @include media-breakpoint-down(lg) {
                    padding-top: calc($spacer * 16.875);
                }
            }

            &-5 {
                padding-top: calc($spacer * 11.625);
                background: url("/landing/how/bg-5.webp") no-repeat right;
                background-size: 64%;

                .img-container {
                    height: calc($spacer * 29.7);
                    img {
                        height: 100%;
                    }
                }

                @include media-breakpoint-down(xxl) {
                    padding-top: calc($spacer * 9.063);
                    .img-container {
                        height:calc($spacer * 25.3);
                    }
                }

                @include media-breakpoint-down(xl) {
                    padding-top: calc($spacer * 6.813);
                    .img-container {
                        height: calc($spacer * 20.8);
                    }
                }

                @include media-breakpoint-down(lg) {
                    .img-container {
                        height: calc($spacer * 17.7);
                    }
                }

                @include media-breakpoint-down(md) {
                    .img-container {
                        height: calc($spacer * 23.8);
                        width: 100%;
                        img {
                            width: 100%;
                        }
                    }
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
                top: -194%;
                left: -1%;
                :deep(svg) {
                    height: calc($spacer * 22);
                }

                @include media-breakpoint-down(xxl) {
                    top: -190%;
                    left: 1.8%;
                    :deep(svg) {
                        width: calc($spacer * 20.688);
                    }
                }

                @include media-breakpoint-down(xl) {
                    top: -150%;
                    left: 6.2%;
                    :deep(svg) {
                        width: calc($spacer * 15.625);
                    }
                }

                @include media-breakpoint-down(lg) {
                    top: -146%;
                    left: 1%;
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

    .code-container {
        position: relative;
        z-index: 10;

        &::before,
        &::after
        {
            content: "";
            position: absolute;
            width: calc($spacer * 12.5);
            height: calc($spacer * 12.5);
            background: linear-gradient(140deg, rgba(70, 24, 255, 0) -41.95%, #7e1cfa 77.28%);
            filter: blur(100px);
            z-index: -5;
        }

        &::before {
            left: -4rem;
            top: 3rem;
        }

        &::after {
            right: -1rem;
            bottom: 0;
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

            .copied-block {
                position: absolute;
                right: calc($spacer * 2.938);
                top: $spacer;

                #copied-tooltip {
                    border-radius: $border-radius;
                    background: #5A3ABC;
                    padding:  calc($spacer * 0.6) 0;
                    font-size: calc($font-size-base * 0.625);
                    margin-right: $popper-margin !important;
                    color: $white;

                    #arrow,
                    #arrow::before {
                        position: absolute;
                        width: calc($spacer * 0.5);
                        height: calc($spacer * 0.5);
                        background: inherit;
                    }

                    #arrow {
                        visibility: hidden;
                        visibility: hidden;
                        right: 0;
                        top: calc($spacer * 0.813);
                    }

                    #arrow::before {
                        visibility: visible;
                        content: '';
                        transform: rotate(45deg);
                    }
                }
            }
            .content-copy-icon {
                position: absolute;
                top: $spacer;
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
        }

        .code-header {
            padding: 0.75rem 1rem;
        }

        .text-success {
            color: #2C3F3A !important;
        }
    }
</style>
