<template>
    <div class="version-marker mb-3">
        <p class="title">Available on:</p>
        <div class="editions">
            <div class="edition-item" v-for="edition of editions" :style="`background-color: ${edition.color}`">
                <p>
                    {{edition.title}}
                </p>
            </div>
        </div>
        <div class="version" :style="`background-color: ${versionColor}`">
            <p>
                {{ version }}
            </p>
        </div>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section},
        props: {
          editions: {
                type: Array,
                required: true,
          },
          version: {
                type: String,
                required: true
          },
          versionColor: {
            type: String,
            required: true
          }
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .version-marker {
        display: flex;
        padding: calc($spacer * 0.5);
        gap: 0 calc($spacer * 0.5);
        align-items: center;
        border: $block-border;
        width: fit-content;

        .title {
            color: $white;
            font-weight: 500;
            font-size: $font-size-xl;
            margin: 0;
        }

        .editions {
            display: flex;
            justify-content: center;
            gap: calc($spacer * 0.5);

            .edition-item {
                border-radius: calc($spacer / 2);
                padding: calc($spacer / 4) calc($spacer / 2);

                p {
                    color: $white-2;
                    font-size: $font-size-base;
                    font-weight: 400;
                    margin: 0;
                }
            }
        }

        .version {
            border-radius: calc($spacer / 2);
            padding: calc($spacer / 4) calc($spacer / 2);
            p  {
                margin: 0;
            }
        }
    }
</style>