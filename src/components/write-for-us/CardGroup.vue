<template>
    <div v-for="(item, index) in content.items" data-usal="fade-r">
        <div class="card process-card">
            <div class="row p-3">
                <div>
                    <h6 class="fw-light d-flex align-items-center m-0">
                        <span class="item-number">0{{ index + 1 }}</span>
                        <span class="item ms-2">{{ item.title }}</span>
                    </h6>
                    <span>{{ item.description }}</span>
                </div>
            </div>
        </div>
        <div v-if="index !== content.items.length - 1">
            <div class="row">
                <div class="col-1 arrow">
                    <img class="icon" :src="content.icon" :alt="content.title" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CardGroup",

        props: {
            content: {
                type: Object,
                required: true,
                default: () => ({
                    items: [],
                    title: "",
                    icon: "",
                }),
            },
        },
    }
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .process-card {
        background: $black-3;
        color: white;
        box-shadow: none;
    }

    .item-number {
        font-size: $font-size-3xl;
        color: $green-1;
    }

    .item {
        font-size: $h3-font-size;
    }

    .title {
        font-size: $font-size-2xl;
    }
    .icon {
        height: $rem-4;
    }
    .arrow {
        padding-left: 2.75rem;
    }
</style>