<template>
    <span v-if="title">{{ title }}</span>
    <div class="companies-container w-100 overflow-hidden">
        <div class="companies d-flex align-items-center">
            <template v-for="(company, index) in [...COMPANIES, ...COMPANIES]" :key="index">
                <img
                    :src="logos[`/src/assets/landing/infrastructure/companies/${company.name}.svg`].default.src"
                    :alt="company.name"
                    :width="logos[`/src/assets/landing/infrastructure/companies/${company.name}.svg`].default.width"
                    :height="logos[`/src/assets/landing/infrastructure/companies/${company.name}.svg`].default.height"
                    loading="lazy"
                    :class="{ 'd-lg-none': index >= COMPANIES.length }"
                />
            </template>
        </div>
    </div>
</template>

<script setup>
    const logos = import.meta.glob("/src/assets/landing/infrastructure/companies/*.svg", { eager: true });

    const COMPANIES = [
        { name: "brainlab" },
        { name: "bloomberg" },
        { name: "fila" },
        { name: "apple" },
        { name: "toyota" },
        { name: "apoteket" },
    ];

    defineProps({
        title: {
            type: String,
            default: ""
        }
    });
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    span {
        font-family: $font-family-jetbrains-mono;
        font-size: $font-size-xs;
        color: $white;
    }

    .companies-container {
        @include media-breakpoint-down(sm) {
            margin-top: 1rem;
            -webkit-mask-image: linear-gradient(
                to right,
                transparent,
                black 10%,
                black 90%,
                transparent
            );
            mask-image: linear-gradient(
                to right,
                transparent,
                black 10%,
                black 90%,
                transparent
            );
        }

        .companies {
            @include media-breakpoint-up(sm) {
                gap: 2px;
                margin-left: -14px;
            }

            @include media-breakpoint-down(lg) {
                gap: 2rem;
                width: max-content;
                animation: marquee 20s linear infinite;
            }

            img {
                flex-shrink: 0;
                object-fit: contain;
            }
        }
    }

    @keyframes marquee {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-50%);
        }
    }
</style>
