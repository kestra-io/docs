<template>
    <details data-aos="zoom-in">
        <summary>
            <h3>{{ title }}</h3>
            <span class="icon">
                <ChevronDown/>
                <ChevronUp/>
            </span>
        </summary>
        <div>
            <slot/>
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
    },
  }
</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";

    :deep(svg) {
        color: $black-1;
        font-size: 24px;
    }

    details {
        border-radius: 4px;
        border: 1px solid #000000;
        background: #F5F5F5;
        margin-bottom: 1rem;

        summary {
            padding: 1rem;
            font-weight: bold;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #000000;

            > span:first-child {
                color: var(--bs-purple);
                font-size: $h3-font-size;
                margin-right: 1rem;
            }

            h3 {
                margin-bottom: 0;
                flex-grow: 1;
                color: $black-1;
                font-size: $rem-1 !important;
                font-weight: 700;
                line-height: 24px;
                text-align: left;
            }

            .chevron-up-icon {
                display: none;
            }
        }

        &[open] summary {
            border-bottom: 0;
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