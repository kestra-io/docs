<template>
    <div class="header-container">
        <div class="header">
            <img
                :src="isMobile
                    ? '/landing/plugins/plugin-ks-sm.svg'
                    : '/landing/plugins/ks-plugin.svg'"
                alt="ks-plugin-logo"
                class="d-block img-fluid"
            >
            <h1 data-aos="fade-left">Connect anything to everything</h1>
            <h4 data-aos="fade-right">Extend Kestra with {{ totalPlugins }} plugins and integrations</h4>
            <div class="search-input position-relative">
                <input 
                    v-model="searchQuery" 
                    type="text" 
                    class="form-control form-control-lg"
                    :placeholder="`Search across ${totalPlugins} plugins`" 
                />
                <Magnify class="search-icon" />
                <div class="ai-wrapper">
                    <span class="or-text">or</span>
                    <div class="ai-button-inside">
                        <button
                            class="ai-button"
                            title="Ask AI"
                            data-bs-toggle="modal"
                            data-bs-target="#search-ai-modal"
                        >
                            <img src="/docs/icons/ks-ai.svg" alt="Kestra AI" width="28" height="28"/>
                            Ask AI
                        </button>
                    </div>
                </div>
            </div>
            <div class="my-4 categories" data-aos="fade-left">
                <button
                    v-for="category in augmentedCategories"
                    :key="category"
                    class="rounded-button"
                    :class="{ 'active': category === activeCategory }"
                    @click="setActiveCategory(category)"
                >
                    {{ DONT_CAPITALIZE_CATEGORIES.includes(category) ? category : formatPluginName(category.toLowerCase()) }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import { useMediaQuery } from '@vueuse/core'
    import { formatPluginName } from "../../utils/pluginFormat";

    const DONT_CAPITALIZE_CATEGORIES = ["AI", "BI"];

    const isMobile = useMediaQuery('(max-width: 991px)')

    const props = defineProps<{
        totalPlugins: string
        categories: string[]
        activeCategory: string
    }>()

    const emit = defineEmits<{
        'update:activeCategory': [category: string]
    }>()

    const searchQuery = defineModel<string>('searchQuery')

    const augmentedCategories = computed(() => ["All Categories", ...props.categories]);

    const setActiveCategory = (category: string) => {
        emit('update:activeCategory', category);
    };
</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .header-container {
        background: url('/landing/plugins/header-bg.svg') no-repeat center center / cover;
        min-height: 451px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .header {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        max-width: 570px;

        @include media-breakpoint-down(lg) {
            padding: $spacer;
        }

        h1, h4 {
            color: $white;
            text-align: center;
            font-weight: 400;
            margin-bottom: 0;
        }

        h1 {
            font-size: 2rem;
            font-weight: 600;

            @include media-breakpoint-down(lg) {
                max-width: 60%;
                margin-top: 2rem;
                margin-bottom: 1rem;
            }

            @include media-breakpoint-down(sm) {
                font-size: 1.5rem;
            }
        }

        h4 {
            font-size: $font-size-base;
            color: #E1E1E1;
            line-height: 28px;
            margin-top: 4px;


            @include media-breakpoint-down(lg) {
                font-size: 1rem !important;
            }

            @include media-breakpoint-down(sm) {
                max-width: 60%;
                font-size: 0.875rem !important;
                line-height: 20px;
                margin: 0;
            }
        }
    }

    .search-input {
        background: linear-gradient(89.75deg, #9F79F3 0.22%, #658AF9 99.78%);
        padding: 1px;
        border-radius: 24px;
        position: relative;
        margin-top: 2rem;
        width: 100%;

        input {
            width: 100%;
            height: 47px;
            padding: 3px 150px 3px 50px;
            border-radius: 23px;
            border: none;
            background-color: #000;

            &, &::placeholder {
                color: $white;
                font-size: 1rem;
                font-weight: 400;

                @include media-breakpoint-down(sm) {
                    font-size: 0.875rem;
                }
            }

            @include media-breakpoint-down(sm) {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;

                &::placeholder {
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
            }
        }
    }

    .search-icon {
        position: absolute;
        top: 9px;
        left: calc($spacer * 1.125);
        font-size: 25px;
        color: $white;
    }

    .ai-wrapper {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .or-text {
            color: var(--ks-content-tertiary);
            font-size: 1rem;
            font-weight: normal;
        }
    }

    .ai-button-inside {
        --border-angle: 0turn;
        --main-bg: conic-gradient(from calc(var(--border-angle) + 50.37deg) at 50% 50%, #3991FF 0deg, #8C4BFF 124.62deg, #A396FF 205.96deg, #3991FF 299.42deg, #E0E0FF 342.69deg, #3991FF 360deg);
        --gradient-border: conic-gradient(from calc(var(--border-angle) + 50.37deg) at 50% 50%, #3991FF 0deg, #8C4BFF 124.62deg, #A396FF 205.96deg, #3991FF 299.42deg, #E0E0FF 342.69deg, #3991FF 360deg);

        display: flex;
        flex-direction: column;
        align-items: end;
        gap: 0.5rem;
        border: solid 1px transparent;
        border-radius: 90px;
        background: var(--main-bg) padding-box, var(--gradient-border) border-box, var(--main-bg) border-box;
        background-position: center center;
        animation: bg-spin 3s linear infinite;

        .ai-button {
            display: inline-flex;
            align-items: center;
            width: 100%;
            gap: 2px;
            background: var(--ks-button-background-secondary);
            color: $white;
            font-size: 14px;
            line-height: 22px;
            padding: 6px 6px;
            border-radius: 90px;
            border: 1px solid var(--ks-border-primary);
            height: 32px;
            width: 90px;
            box-shadow: 0px 4px 4px 0px #00000040;
            font-weight: 700;
            transition: transform 0.2s ease;

            &:hover {
                background: var(--ks-button-background-secondary-hover);
            }
        }
    }

    .rounded-button {
        height: 32px;
        padding: 4px 21px;
        border-radius: 90px;
        border: 1px solid #FFFFFF1A;
        background: #FFFFFF0D;
        color: $white;
        font-weight: 400;
        font-size: $font-size-sm;
        line-height: 1.375rem;
        transition: transform 0.2s ease;

        &:hover {
            transform: scale(1.05);
        }

        &.active {
            background: #FFFFFF40;
            border-color: #FFFFFF1A;
        }
    }

    .categories {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.875rem;

        @include media-breakpoint-down(sm) {
            gap: 0.35rem;
        }
    }

    @include media-breakpoint-down(lg) {
        .header-container {
            background: url('/landing/plugins/header-sm.svg') no-repeat center center / cover;
        }
    }
</style>