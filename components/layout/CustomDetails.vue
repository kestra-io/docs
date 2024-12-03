<template>
    <details data-aos="zoom-in">
        <summary>
            <h3>{{ title }}</h3>
            <span class="icon">
                <ChevronDown />
                <ChevronUp />
            </span>
        </summary>
        <div>
            <slot />
        </div>
    </details>

</template>

<script setup>
    import HelpCircleOutline from "vue-material-design-icons/HelpCircleOutline.vue";
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue";
</script>

<script>
    export default {
        props: {
            title: {
                type: String,
                required: true,
            },
        }
    }
</script>

<style scoped lang="scss">

    @import "../../assets/styles/variable";

    details {
        background: #121217 !important;
        padding: 1rem;
        border: none !important;
        border-bottom: 1px solid #252526 !important;
        margin-bottom: 1rem;

        summary {
            font-weight: bold;
            display: flex;
            align-items: center;

            > span:first-child {
                color: var(--bs-purple);
                font-size: $h3-font-size;
                margin-right: 1rem;
            }

            :deep(.material-design-icon > .material-design-icon__svg) {
                bottom: 0;
            }

            h3 {
                font-size: var(--bs-body-font-size);
                margin-bottom: 0;
                flex-grow: 1;
                font-weight: 400;

                @include media-breakpoint-down(lg) {
                    font-size: 18px !important;
                    font-weight: 400;
                }
            }

            .chevron-up-icon {
                display: none;
            }

        }

        > div {
            margin-top: 1rem;
            border-left: 1px solid var(--bs-indigo);
            padding-left: 1rem;
            margin-left: 3rem;
        }

        &[open] summary .icon {
            .chevron-down-icon {
                display: none;
            }

            .chevron-up-icon {
                display: block;
            }
        }
    }

    h6 {
        font-weight: 700;
        color: var(--bs-black)
    }


</style>