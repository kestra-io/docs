<template>
    <div class="container-fluid bg-dark-1 my-5">
        <div class="container">
            <div class="git-options" data-usal="zoomin">
                <div class="options-item">
                    <div class="title-bar">
                        <h2 class="title">GitOps with Kestra</h2>
                        <p class="desc">
                            Kestra's Git capabilities ensure your projects are always synchronized
                            and up-to-date.
                        </p>
                    </div>
                    <div class="img-bar">
                        <NuxtImg
                            loading="lazy"
                            format="webp"
                            width="492px"
                            height="314px"
                            src="/landing/features/language/git-with-kestra.svg"
                            alt="GitOps with Kestra"
                        />
                    </div>
                </div>
                <div class="options-item">
                    <div class="card-item">
                        <h6 class="title">Git Sync for Continuous GitOps</h6>
                        <p class="desc">
                            Synchronize your code changes between Git and Kestra in both directions
                            — sync code from Git or push your code built in Kestra’s IDE to Git.
                            Keeps your code up-to-date and enables seamless collaboration via Pull
                            Requests.
                        </p>
                    </div>
                    <div class="card-item">
                        <h6 class="title">Flexibility Across Development Environments</h6>
                        <p class="desc">
                            From the Kestra UI to VS Code extensions and Terraform providers, choose
                            the tools that fit your deployment pattern. Our platform's API-first
                            approach ensures you can easily interface with Git, no matter your
                            preferred environment.
                        </p>
                    </div>
                </div>
                <div class="options-footer">
                    <h2 class="title">Single Source of Truth</h2>
                    <p class="desc">
                        Whether you're developing directly in the Kestra UI or prefer coding in your
                        favorite IDE, our Git integration ensures your workflows are
                        version-controlled, reviewable, and easy to deploy.
                    </p>
                    <a
                        class="btn btn-animated btn-purple-animated"
                        href="https://kestra.io/docs/version-control-cicd/git"
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
            height: 100%;
            background: url("/landing/features/language/git-with-kestra-bg.svg") no-repeat;
            z-index: -1;
            background-size: 92% 136%;
            top: -12%;
            left: 5%;

            @include media-breakpoint-down(lg) {
                width: 165%;
                height: 165%;
                top: -76%;
                left: -13%;
            }

            @include media-breakpoint-down(sm) {
                top: -90%;
            }
        }
    }
    .git-options {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        padding: calc($spacer * 4.688) calc($spacer * 5);

        @include media-breakpoint-down(xl) {
            padding: calc($spacer * 4.688) 0;
        }

        .options-item {
            display: flex;
            justify-content: space-between;
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