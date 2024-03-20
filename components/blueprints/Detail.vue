<template>
    <div class="row">
        <div class="col-md-10">
            <h3>About this blueprint</h3>
            <div class="title">
                <p>{{ page.title }}</p>
            </div>

            <ContentRendererMarkdown
                class="bd-markdown"
                :value="description"
            />
            <div class="mt-5">
                <ContentRendererMarkdown
                    class="bd-markdown"
                    :value="flow"
                />
            </div>
        </div>
        <div class="col-md-2">
            <div class="plugins-icons" v-if="page.includedTasks && page.includedTasks.length">

                <div class="d-flex justify-content-center flex-column plugins-container">
                    <div class="plugin-icon card bg-dark-2" v-for="icon in page.includedTasks" :key="icon">
                        <CommonTaskIcon :cls="icon"/>
                        <p class="text-center">Plugins Used in this Blueprints</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        page: {
            type: Object,
            required: true
        },
        description: {
            type: Object,
            required: true
        },
        flow: {
            type: Object,
            required: true
        }
    }
}
</script>
<style scoped lang="scss">
    @import "../../assets/styles/variable";

    h3 {
        color: $white;
        font-size: $h2-font-size;
        font-weight: 300;
    }
    div.title {
        margin: 0 auto calc($spacer / 2);

        p {
            color: $purple-36;
            font-family: $font-family-monospace;
            font-size: $font-size-xl;
            font-weight: 700;
            text-transform: uppercase;
            display: inline;
        }
    }

  :deep(.bd-markdown) {
      color: $white;

      a {
        color: $purple-36;
      }
  }

    .plugins-container {
        border-radius: 0.5rem;
        border: $block-border;

        .plugin-icon {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            align-items: center;
            justify-content: center;
            min-width: 134px;
            font-weight: bold;
            font-size: $font-size-sm;
            border-radius: 0;
            border-top: $block-border;
            padding: calc($spacer * 1.063) 0 calc($spacer * 0.75);

            :deep(.icon-wrapper) {
                width: calc($spacer * 2.625);
                height: calc($spacer * 2.625);
            }

            p {
                font-size: calc($font-size-base * 0.875);
                font-weight: 700;
                color: $white;
            }
        }
    }
</style>