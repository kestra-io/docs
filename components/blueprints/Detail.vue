<template>
    <div class="row">
        <div class="col-md-10">
            <h3>Source</h3>
            <div class="mt-4 relative code mb-3" :class="{ hide: hideCode }">
                <ContentRendererMarkdown
                    class="bd-markdown"
                    :value="flow"
                />
                <div class="show-more" :class="{ hide: !hideCode }">
                    <a href="" @click.prevent="hideCode = !hideCode">
                        See more
                        <ChevronDown v-if="hideCode"/>
                        <ChevronUp v-else/>
                    </a>
                </div>
            </div>
            <h3>About this blueprint</h3>
            <div class="title">
                <p>{{ tagsList }}</p>
            </div>
            <ContentRendererMarkdown
                class="bd-markdown"
                :value="description"
            />
        </div>
        <div class="col-md-2">
            <div class="plugins-icons" v-if="page.includedTasks && page.includedTasks.length">

                <div class="d-flex justify-content-center flex-column plugins-container">
                    <div class="plugin-icon card bg-dark-2" v-for="icon in page.includedTasks" :key="icon">
                        <CommonTaskIcon :cls="icon"/>
                        <p class="text-center">{{getLastWord(icon)}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
import ChevronUp from "vue-material-design-icons/ChevronUp.vue";

export default {
    components: {
      ChevronUp,
      ChevronDown
    },
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
        },
        tags: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
          hideCode: true
        };
    },
    computed: {
      tagsList() {
        if (this.tags && this.page.tags) {
          return this.tags.filter(t => this.page.tags.includes(t.id)).map(t => t.name).join(' ')
        }
        return ""
      }
    },
    methods: {
        getLastWord(value) {
          if (!value) return '';
          const lastWord = value.substring(value.lastIndexOf('.') + 1);
          const formattedLastWord = lastWord.replace(/([a-z])([A-Z])/g, '$1 $2');
          return formattedLastWord;
        }
    }
}
</script>
<style scoped lang="scss">
    @import "../../assets/styles/variable";
    .code {
        overflow: hidden;
        position: relative;
        border: 1px solid #252526;
        border-radius: 0.5rem;
        box-sizing: content-box;
        transition: max-height 0.5s ease;
        &.hide {
            max-height: 258px;
        }
        :deep(.code-block) {
            padding-bottom: 50px;
            margin-bottom: 0!important;
        }
        .show-more {
            border-bottom-right-radius: 13px;
            border-bottom-left-radius: 13px;
            position: absolute;
            bottom: 0;
            left: 1px;
            right: 1px;
            display: flex;
            justify-content: center;
            background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(22, 22, 23, 0.52), rgba(22, 22, 23, 0.96), $black-2);
            padding: 56px  0 10px 0;
            &.hide {
                background-image: unset;
            }
            a {
                color: $white;
                font-family: $font-family-monospace;
            }
        }
    }

    h3 {
        color: $white;
        font-size: $h2-font-size;
        font-weight: 500;
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
      .code-block {
          border: 1px solid #252526;
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