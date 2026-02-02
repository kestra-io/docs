<template>
    <section class="main-header">
        <div class="container">
            <div class="text-block">
                <p>
                    By using Kestra as your orchestrator, you can easily automate complex workflows,
                    integrate with your
                    <br />
                    existing data stack, and improve the speed and efficiency of your data
                    processing.
                </p>
                <div class="buttons">
                    <a href="/demo" class="btn btn-secondary mb-2" target="_blank"> Talk to us </a>
                    <a href="/docs/quickstart#start-kestra" class="btn btn-primary ms-3 mb-2">
                        Get Started!
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .main-header {
        background: #f7f7f8;

        .container {
            padding-top: 1rem;
            padding-bottom: 2rem;
        }

        .text-block {
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            width: 100%;
            align-items: center;
            gap: 10px;
        }

        p {
            max-width: fit-content;
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;
            text-align: center;
            color: $black-1;
            text-wrap: unset;
        }

        .buttons {
            text-align: center;
            white-space: nowrap;

            .btn {
                border-radius: 8px;
            }
        }
    }
</style>