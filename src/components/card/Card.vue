<template>
    <div class="card " :class="number ? 'number-card' : ''" data-usal="zoomin">
        <component :is="href ? 'a' : 'div'" :href="href" class="card-link-wrapper">
            <div class="card-body">
                <div class="title-block">
                    <span v-if="icon || $slots.icon" class="ks-card-icon">
                        <slot name="icon">
                            <component :is="icon" />
                        </slot>
                        <svg width="0" height="0">
                            <defs>
                                <linearGradient
                                    id="featureiconsgradient"
                                    x1="4.99595"
                                    y1="6.83411"
                                    x2="31.2214"
                                    y2="33.0161"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop offset="0.015625" stop-color="#F2D5FF" />
                                    <stop offset="1" stop-color="#CB5AFF" />
                                </linearGradient>
                                <linearGradient
                                    id="featureiconsgradientRed"
                                    x1="17.9873"
                                    y1="0.5"
                                    x2="17.9873"
                                    y2="35.5"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stop-color="#E3262F" />
                                    <stop offset="1" stop-color="#ED5D63" />
                                </linearGradient>
                                <linearGradient
                                    id="featureiconsgradientBlue"
                                    x1="9.76058"
                                    y1="9.99753"
                                    x2="38.9"
                                    y2="39.0887"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop offset="0.015625" stop-color="#A7EAFF" />
                                    <stop offset="1" stop-color="#10C2FB" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </span>
                    <span v-if="img" class="card-icon">
                        <img :src="img" :alt="imgAlt" />
                    </span>
                    <span v-if="number" class="card-icon">
                        <p class="number">{{ number }}</p>
                    </span>
                    <div v-if="cardInfo" class="card-info">
                        <h3 v-if="cardInfo.title" class="card-title">
                            {{ cardInfo.title }}
                        </h3>
                        <p v-if="cardInfo.description" class="card-text">
                            {{ cardInfo.description }}
                        </p>
                        <div
                            v-if="cardInfo.descriptionHtml"
                            class="card-text"
                            v-html="cardInfo.descriptionHtml"
                        ></div>
                    </div>
                    <h3 v-if="title" class="card-title">{{ title }}</h3>
                    <h3 v-if="titleHtml" class="card-title" v-html="titleHtml"></h3>
                </div>
                <div v-if="bottomMenuBar && bottomMenuBar.length" class="bottom-menu">
                    <div
                        class="bottom-menu-item"
                        v-for="menuItem in bottomMenuBar"
                        @click="() => (isClickable ? (menuItem.active = !menuItem.active) : null)"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 25 25"
                            fill="none"
                        >
                            <path
                                d="M14.9891 17.3359V13.3359H6.06906L6.03906 11.3259H14.9891V7.33594L19.9891 12.3359L14.9891 17.3359Z"
                                :fill="menuItem.active ? '#CDD5EF' : '#9CA1DE'"
                            />
                        </svg>
                        <span :class="menuItem.active && 'active'">{{ menuItem.text }}</span>
                    </div>
                </div>
                <p v-if="description" class="card-text">{{ description }}</p>
                <div v-if="descriptionHtml" class="card-text" v-html="descriptionHtml" />
                <p v-if="$slots.descriptionHtml" class="card-text">
                    <slot name="descriptionHtml"></slot>
                </p>
            </div>
        </component>
    </div>
</template>
<script lang="ts" setup>
    withDefaults(
        defineProps<{
            icon?: any
            img?: string
            imgAlt?: string
            title?: string
            titleHtml?: string
            description?: string
            descriptionHtml?: string
            number?: string
            bottomMenuBar?: Array<{
                text: string
                active: boolean
            }>
            style?: string
            cardInfo?: {
                title?: string
                description?: string
                descriptionHtml?: string
            }
            isClickable?: boolean
            href?: string
        }>(),
        {
            isClickable: true,
        },
    )
</script>
<style lang="scss" scoped>


    .card {
        border-radius: calc($spacer / 2);
        border: $block-border;
        color: var(--ks-content-primary);
        padding: 0;
        height: 100%;
        overflow: hidden;
        .card-link-wrapper {
            display: block;
            height: 100%;
            text-decoration: none;
            color: var(--ks-content-primary);
            padding: 2rem;
            background-color: var(--ks-background-input);
            @include media-breakpoint-down(lg) {
                padding: 1rem;
            }
        }
        .card-body {
            padding: 0;
            display: flex;
            gap: 1rem;
            flex-direction: column;
            .title-block {
                @include media-breakpoint-down(md) {
                    flex-wrap: nowrap;
                }
            }
            .card-title {
                font-weight: 500;
                font-size: $font-size-md;
                margin: 0;
            }
            .card-text {
                color: var(--ks-content-secondary);
                font-size: $font-size-sm;
                font-weight: 400;
            }
            .card-info {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: calc($spacer / 2);
                .card-title {
                    margin: 0;
                }
                .card-text {
                    text-align: start;
                }
            }
            .ks-card-icon {
                display: block;
                margin-bottom: .5rem;
                font-size: 24px;;

                :deep(.material-design-icon) {
                    svg path {
                        fill: url(#featureiconsgradient);
                    }
                }
                .number {
                    font-size: $h2-font-size;
                    background: linear-gradient(90deg, #e151f7 2.16%, #5c47f5 65.09%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin: 0;
                }
            }
            .bottom-menu {
                display: flex;
                flex-direction: column;
                gap: calc($spacer * 0.5);
                min-width: calc($spacer * 18.5);
                .bottom-menu-item {
                    display: flex;
                    align-items: center;
                    gap: calc($spacer * 0.5);
                    color: #9ca1de;
                    .active {
                        color: #cdd5ef;
                    }
                }
            }
        }
    }
</style>