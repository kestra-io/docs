<template>
    <div class="fixed-top">
        <div class="announce">
            <div class="alert alert-primary">
                <p class="text-truncate">
                    🚀 New! <strong>Kestra raises $3 millions to grow</strong> <NuxtLink href="/blogs/2023-10-05-announcing-kestra-funding-to-build-the-universal-open-source-orchestrator">Learn more</NuxtLink>
                </p>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="alertHide">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        methods: {
            alertHide() {
                let cookieRef = useCookie('top-banner', {watch: true});
                cookieRef.value = "ok";
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .fixed-top {
        z-index: 1031;
    }

    .announce {
        width: 100%;

        opacity: 1;
        transition: all 0.2s ease;
        &.hidden {
            opacity: 0;
            display: none;
            top: -100px;
        }

        .alert {
            border-radius: 0;
            border: 0;
            text-align: center;
            background: $primary;
            color: var(--bs-white);
            padding: 0.5rem 0.5rem;
            margin-bottom: 0;

            a {
                text-decoration: underline;
                color: var(--bs-white);
            }

            p {
                margin-bottom: 0;
                margin-right: 15px
            }

            button {
                position: absolute;
                right: 3px;
                top: 3px;
                background: none;
                border: 0;
                font-size: 24px;
                color: var(--bs-white);
            }
        }
    }
</style>