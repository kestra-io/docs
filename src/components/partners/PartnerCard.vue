<script setup lang="ts">
    import { computed } from "vue"
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue"
    import OpenInNew from "vue-material-design-icons/OpenInNew.vue"
    import type { ListPartner } from "./partners"

    const props = defineProps<{
        partner: ListPartner
    }>()

    const external = computed(() => /^https?:\/\//.test(props.partner.href))
</script>

<template>
    <!-- the plugin card of /plugins, with a partner's logo, type, services and location -->
    <a
        :href="props.partner.href"
        :target="external ? '_blank' : undefined"
        :rel="external ? 'noopener' : undefined"
    >
        <div class="partner">
            <div class="top-row">
                <div class="icon-content">
                    <img
                        :src="props.partner.logo"
                        :alt="props.partner.name"
                        loading="lazy"
                    />
                </div>
                <div class="content">
                    <h6>{{ props.partner.name }}</h6>
                    <p class="description">{{ props.partner.description }}</p>
                </div>
            </div>
            <div class="categories">
                <span class="category-tag kind">{{ props.partner.kind }}</span>
                <span
                    v-for="service in props.partner.services"
                    :key="service"
                    class="category-tag"
                >
                    {{ service }}
                </span>
            </div>
            <div class="footer">
                <hr />
                <div class="bottom-row">
                    <div class="left">
                        <p>
                            {{ props.partner.country }}
                            <span>{{ props.partner.region }}</span>
                        </p>
                    </div>
                    <OpenInNew
                        v-if="external"
                        title="Opens the partner's website"
                    />
                    <ChevronRight v-else />
                </div>
            </div>
        </div>
    </a>
</template>

<style scoped lang="scss">
    a {
        color: inherit;
        text-decoration: none;
    }

    .partner {
        height: 100%;
        min-height: 188px;
        border-radius: 12px;
        border: 1px solid var(--ks-border-secondary);
        padding: $rem-1;
        padding-bottom: 2px;
        background: var(--ks-background-primary);
        display: flex;
        flex-direction: column;
        box-shadow: 2px 3px 16px 0px var(--ks-shadows-light);
        transition: transform 0.4s ease-out;

        &:hover {
            border-color: var(--ks-border-active);
            transform: scale(1.01);
        }

        .top-row {
            display: flex;
            gap: $rem-1;
            margin-bottom: 1rem;
        }

        // wider than the plugin icon tile: partner logos are mostly wordmarks
        .icon-content {
            width: 96px;
            height: 60px;
            padding: 8px 10px;
            background: $white;
            border-radius: 8px;
            border: $block-border;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;

            img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
            }
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            min-width: 0;
        }

        h6 {
            color: var(--ks-content-primary);
            font-size: $font-size-md;
            font-weight: 700;
            margin: 0 0.5rem 0 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .categories {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 0.5rem;

            .category-tag {
                display: inline-block;
                margin-right: 0.25rem;
                background: var(--ks-background-tag-category);
                color: var(--ks-content-tag-category);
                padding: 0.125rem 0.5rem;
                border-radius: 40px;
                font-size: $font-size-xs;
                font-weight: 600;

                // the partner type comes first, in the success colours
                &.kind {
                    background: var(--ks-background-tag-success);
                    color: var(
                        --ks-content-tag-success,
                        var(--ks-content-primary)
                    );
                }
            }
        }

        .description {
            color: var(--ks-content-secondary);
            font-size: $font-size-xs !important;
            line-height: $rem-1;
            margin: 0;
            overflow: hidden;
            display: -webkit-box;
            line-clamp: 2;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        hr {
            border: 1px solid var(--ks-border-secondary);
            margin: 0;
        }

        .footer {
            margin-top: auto;
        }

        .bottom-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 45px;

            p {
                margin: 0;
                font-weight: 700;
                font-size: $font-size-xs !important;
                color: var(--ks-content-primary);

                span {
                    margin-left: 4px;
                    font-weight: normal;
                    color: var(--ks-content-tertiary);
                }
            }

            :deep(svg) {
                font-size: $rem-1;
                color: var(--ks-content-link);
            }
        }
    }
</style>
