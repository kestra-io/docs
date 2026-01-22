<template>
    <div class="container-fluid bg-dark-1 my-5">
        <div class="container">
            <div class="workflow-options row" data-usal="fade-l">
                <div class="options-item col-12 col-md-12 col-lg-6">
                    <div class="img-bar">
                        <NuxtImg
                            loading="lazy"
                            format="webp"
                            width="453px"
                            height="336px"
                            src="/landing/features/apifirst/workflow-integration.svg"
                            alt="GitOps with Kestra"
                        />
                    </div>
                    <div class="title-bar">
                        <h2 class="title">Workflow Integration and Automation</h2>
                    </div>
                </div>
                <div class="options-item col-12 col-md-12 col-lg-4">
                    <div class="card-item">
                        <h6 class="title">In-Flow HTTP Requests</h6>
                        <p class="desc">
                            Utilize the <span>HTTP Request</span> task within your workflows to
                            connect to external APIs, fetch data or trigger actions within your
                            Kestra flows.
                        </p>
                    </div>
                    <div class="card-item">
                        <h6 class="title">Event-Driven Triggers</h6>
                        <p class="desc">
                            The <span>HTTP Trigger</span> opens your workflows for integration with
                            any external events.
                        </p>
                    </div>
                    <a
                        class="btn btn-animated btn-purple-animated"
                        href="https://kestra.io/plugins/triggers/http/io.kestra.plugin.core.http.Trigger"
                        data-usal="zoomin"
                    >
                        Learn more
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .container-fluid {
        position: relative;
        z-index: 1;

        &::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 103%;
            z-index: -1;
            background: url("/landing/features/apifirst/workflow-bg.svg");
            background-size: 92% 136%;
            top: -3%;
            left: 5%;

            @include media-breakpoint-down(lg) {
                width: 165%;
                height: 165%;
                top: -69%;
                left: -13%;
            }

            @include media-breakpoint-down(sm) {
                top: -90%;
            }
        }
    }
    .workflow-options {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        padding: calc($spacer * 4.688) calc($spacer * 5);

        @include media-breakpoint-down(xl) {
            padding: calc($spacer * 4.688) 0;
        }

        @include media-breakpoint-down(lg) {
            flex-direction: column;
        }

        .options-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;

            @include media-breakpoint-down(lg) {
                flex-direction: column;
                gap: 1rem;
            }

            .title-bar {
                color: $white;
                display: flex;
                flex-direction: column;
                gap: calc($spacer * 1.563);

                .title {
                    font-size: $h2-font-size;
                    font-weight: 600;
                    text-align: center;
                    margin: 0;
                }

                .desc {
                    font-size: $h6-font-size;
                    font-weight: 300;
                    line-height: calc($spacer * 1.625);
                    margin: 0;
                    max-width: 68%;
                }

                @include media-breakpoint-down(lg) {
                    align-items: center;
                    .desc {
                        max-width: 100%;
                        text-align: center;
                    }
                }
            }

            .img-bar > img {
                max-width: 100%;
            }

            .card-item {
                display: flex;
                padding: 2rem;
                flex-direction: column;
                gap: calc($spacer * 0.5);
                border-radius: calc($spacer * 0.5);
                color: $white;
                background-color: $black-4;
                border: 1px solid $black-6;
                min-width: 100%;

                .title {
                    font-size: $h6-font-size;
                    font-weight: 600;
                    text-align: center;
                    margin: 0;
                }

                .desc {
                    font-size: $font-size-base;
                    font-weight: 300;
                    line-height: calc($spacer * 1.5);
                    margin: 0;
                    text-align: center;

                    span {
                        color: #03daba;
                    }
                }
            }
        }

        .options-item:first-child {
            padding: 0 calc($spacer * 4.156);

            @include media-breakpoint-down(xl) {
                padding: 0;
            }
        }

        .options-footer {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 2rem;
            align-items: center;
            color: $white;
            padding: 0 calc($spacer * 13.063);
            text-align: center;

            @include media-breakpoint-down(lg) {
                padding: 0;
            }

            .title {
                font-size: $h2-font-size;
                font-weight: 300;
                margin: 0;
            }

            .desc {
                font-size: $h6-font-size;
                font-weight: 300;
                line-height: calc($spacer * 1.625);
                margin: 0;
            }
        }
    }
</style>