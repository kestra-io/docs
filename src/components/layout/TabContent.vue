<template>
    <div class="business-details-container">
        <ul class="nav nav-tabs w-100 d-md-flex d-none">
            <li class="nav-item" v-for="(navLink, index) in navLinks" :key="navLink.id">
                <button
                    :class="`nav-link ${activeTabIndex === index ? 'active' : ''}`"
                    @click="setTab(index)"
                >
                    {{ navLink.tabText }}
                </button>
            </li>
        </ul>
        <div class="dropdown d-md-none d-block w-100">
            <button
                class="btn btn-secondary dropdown-toggle w-100"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {{ navLinks[activeTabIndex].tabText }}
            </button>
            <ul class="dropdown-menu dropdown-menu-bar">
                <li class="nav-item" v-for="(navLink, index) in navLinks" :key="navLink.id">
                    <button
                        :class="`nav-link ${activeTabIndex === index ? 'active' : ''}`"
                        @click="setTab(index)"
                    >
                        {{ navLink.tabText }}
                    </button>
                </li>
            </ul>
        </div>
        <div class="tab-content">
            <div class="active-tab-content">
                <NuxtImg
                    loading="lazy"
                    format="webp"
                    width="765px"
                    :src="navLinks[activeTabIndex].imgHref"
                    :alt="navLinks[activeTabIndex].imgAlt"
                    class="zoom"
                />
                <p>{{ navLinks[activeTabIndex].text }}</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            navLinks: {
                type: Array,
                required: true,
            },
        },
        data() {
            return {
                activeTabIndex: 1,
            }
        },
        methods: {
            setTab(index) {
                if (this.activeTabIndex !== index) {
                    this.activeTabIndex = index
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .business-details-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: transparent;
        border-radius: calc($spacer * 0.5);
        border: $block-border;
        margin-bottom: calc($spacer * 2.8);
        overflow: hidden;
        @include media-breakpoint-down(md) {
            border: none;
            overflow: unset;
        }
        ul {
            background-color: var(--ks-background-secondary);
            overflow: hidden;
            flex-wrap: nowrap;
            justify-content: center;
            border: none;
            border-bottom: $block-border;
            li {
                border-right: $block-border;
                padding: 0;
                flex: 1;
                .active {
                    color: var(--ks-content-primary);
                    background: #4b0aaa;
                    border: none;
                    border-radius: 0;
                }
                button {
                    width: 100%;
                    height: 100%;
                    color: var(--ks-content-primary);
                    padding: 2rem;
                    border: none;
                    &:hover,
                    &:focus {
                        border: none;
                    }
                    @include media-breakpoint-down(lg) {
                        padding: 1rem;
                    }
                    @include media-breakpoint-down(md) {
                        padding: calc($spacer * 0.5);
                        font-size: calc($font-size-base * 0.8);
                    }
                    @include media-breakpoint-down(sm) {
                        padding: calc($spacer * 0.1);
                        font-size: calc($font-size-base * 0.8);
                    }
                }
            }
            li:last-child {
                border: none;
            }
        }
        .tab-content {
            width: 100%;
            display: flex;
            justify-content: center;
            padding: 4rem calc($spacer * 1.8) 2rem;
            position: relative;
            z-index: 10;
            overflow: hidden;
            &::before,
            &::after {
                content: "";
                position: absolute;
                width: calc($spacer * 10);
                height: calc($spacer * 11);
                background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117ff 100%);
                filter: blur(100px);
                z-index: -5;
            }
            &::before {
                left: 58rem;
                top: 25rem;
            }
            &::after {
                right: 57rem;
                bottom: 30rem;
            }
            @include media-breakpoint-down(lg) {
                &::before {
                    left: 32rem;
                    top: 22rem;
                }
                &::after {
                    right: 29rem;
                    bottom: 26rem;
                }
            }
            @include media-breakpoint-down(md) {
                padding: $spacer 0;
                overflow: unset;
                &::before {
                    left: 0;
                    top: -25%;
                }
                &::after {
                    right: 0;
                    bottom: 25%;
                }
            }
            .active-tab-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: calc($spacer * 1.8);
                p {
                    font-size: $h6-font-size;
                    font-weight: 300;
                    color: var(--ks-content-primary);
                    margin: 0;
                }
                img {
                    max-width: 100%;
                }
            }
        }
        .dropdown {
            .dropdown-toggle {
                position: relative;
                z-index: 14;
                color: var(--ks-content-primary);
                font-style: $font-size-base;
                line-height: calc($spacer * 1.6);
                border-radius: calc($spacer * 0.5);
                border: 1px solid var(--ks-content-tertiary);
                &::after {
                    width: calc($spacer * 12);
                    height: calc($spacer * 12);
                    right: calc($spacer * -10);
                    top: calc($spacer * 0.7);
                    position: absolute;
                    content: "";
                    border: none;
                    background: url("/landing/ee/business-details/keyboard_arrow_down.svg");
                    background-repeat: no-repeat;
                }
            }
            .dropdown-menu-bar {
                width: 100%;
                color: var(--ks-content-primary);
                border-radius: calc($spacer * 0.5);
                border: 1px solid var(--ks-content-tertiary);
            }
        }
    }
</style>