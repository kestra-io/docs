<template>
    <div class="container-fluid">
        <LayoutDetailMainContent
            :subtitle="subtitle"
            :subtitleBefore="subtitleBefore"
            :baseline="baseline"
            :items="mainContent"
        />
    </div>
</template>

<script>
    export default {
        props: {
            subtitle: {
              type: String,
              required: true,
            },
            subtitleBefore: {
              type: String,
              required: true,
            },
            baseline: {
              type: String,
              required: true,
            },
            mainContent: {
              type: Array,
              required: true,
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../../assets/styles/variable";
    .container-fluid {
        background-color: $black-4;
    }
    :deep(section) {
        div.subtitle {
            @include media-breakpoint-up(lg) {
                max-width: 65%;
            }
        }
    }

    :deep(.feature-img-left) {
        &::before {
            background-size: 62% 100% !important;
            z-index: 0 !important;
        }
    }

    :deep(.feature-img-right) {
        &::before {
            background-size: 45% 100% !important;
            right: -3% !important;
            z-index: 0 !important;
        }
    }

    :deep(.main) {
        div.row  {
            border-bottom: 1px solid #FFFFFF1A;
        }

        div.row:last-child {
            border: none;
        }
    }
</style>
