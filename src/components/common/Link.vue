<!--
    A common styled Link component to be used across all pages of the Kestra website.
    Displays text with an animated arrow icon that animates and changes from a chevron to an arrow on hover.
-->
<template>
    <a :href="href" class="link">
        {{ text }}
        <svg viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg" class="arrow-icon">
            <g class="arrow-head">
                <path
                    d="M1 1C4.5 4 5 4.38484 5 4.5C5 4.61516 4.5 5 1 8"
                    stroke="currentColor"
                    stroke-width="2"
                />
            </g>
            <g class="arrow-body">
                <path d="M3.5 4.5H0" stroke="currentColor" stroke-width="2" />
            </g>
        </svg>
    </a>
</template>

<script setup lang="ts">
    /**
     * @param href - The URL the link points to
     * @param text - The text content of the link
     */

    defineProps<{
        href: string
        text: string
    }>()
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    $button-transition-timing: 100ms;

    .link {
        color: $black;
        font-weight: bold;
        text-decoration: none;
        transition: all $button-transition-timing ease-in-out;
        display: inline-flex;
        align-items: center;

        .arrow-icon {
            overflow: visible;
            width: 12px;
            height: 12px;
            margin-top: 0.15rem;
            margin-left: 0.3rem;

            .arrow-head {
                transform: translateX(0);
                transition: transform $button-transition-timing ease-in-out;
            }

            .arrow-body {
                opacity: 0;
                transform: scaleX(1);
                transition:
                    transform $button-transition-timing ease-in-out,
                    opacity $button-transition-timing ease-in-out;
            }
        }

        &:hover {
            .arrow-icon {
                .arrow-head {
                    transform: translateX(3px);
                }

                .arrow-body {
                    opacity: 1;
                    transform: scaleX(2);
                }
            }
        }
    }
</style>