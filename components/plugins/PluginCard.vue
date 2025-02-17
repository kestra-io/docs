<template>
    <NuxtLink :href="`/plugins/${plugin.name}`">
        <div class="plugin d-flex align-items-center gap-2 bg-dark-2" ref="root" data-bs-toogle="tooltip"
             data-bs-html="true" data-bs-custom-class="plugin-tooltip" :data-bs-original-title="plugin.tooltipContent">
            <div class="icon-content">
                <img :src="`/icons/${plugin.subGroup || plugin.group}.svg`" :alt="plugin.title">
            </div>
            <h6>
                {{ plugin.title }}
            </h6>
        </div>
    </NuxtLink>
</template>
<script setup>
    const {$bootstrap} = useNuxtApp()
    const props = defineProps({
        plugin: {
            type: Object,
            required: true
        },
        icons: {
            type: Object,
            default: undefined
        },
    });

    const root = ref(null);

    onMounted(() => {
      if (process.client) {
        new $bootstrap.Tooltip(root.value, {
          trigger: 'manual',
          boundary: 'window'
        });

        root.value.addEventListener('mouseenter', () => {
            const tooltip = $bootstrap.Tooltip.getInstance(root.value);
            if (tooltip) {
                removeAllTooltips();
                tooltip.show();
                tooltip.tip.addEventListener('mouseleave', () => {
                tooltip.hide();
                });
            }
        });
      }
    });

    onBeforeUnmount(() => {
        if (process.client) {
            const tooltip = $bootstrap.Tooltip.getInstance(root.value);
            if (tooltip) {
                tooltip.dispose();
            }
        }
    });

    function removeAllTooltips() {
      const tooltips = document.querySelectorAll('.tooltip');
      tooltips.forEach(tooltip => {
        tooltip.parentNode.removeChild(tooltip);
      });
    }
</script>


<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .plugin {
        border-radius: 4px;
        border: $block-border;
        padding: calc($rem-1 / 2) $rem-2;

        .icon-content img {
            width: 32px;
            height: 32px;
        }

        h6 {
            color: $white;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-transform: capitalize;
            font-size: $font-size-md;
            font-weight: 400;
            margin-bottom: 0;
        }
    }
</style>