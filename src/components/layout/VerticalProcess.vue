<template>
    <section>
        <div class="container">
            <h2 data-usal="fade-l" class="mb-4" v-html="content.title"></h2>
        </div>
        <div v-for="(item, index) in content.items" :key="index" data-usal="fade-r" class="container">
            <div class="card process-card">
                <div class="row p-3">
                    <div>
                        <h6 class="fw-light d-flex align-items-center m-0">
                            <span class="item-number">0{{ Number(index) + 1 }}</span>
                            <h3 class="ms-3 mb-0">{{ item.title }}</h3>
                        </h6>
                        <p>{{ item.description }}</p>
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
    </section>
</template>

<script setup lang="ts">

defineProps<{
    content: {
        title: string;
        items: {
            title: string;
            description: string;
        }[];
        icon: string;
    }
}>();
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";


    section {
        padding: $rem-4 0;
        h3 {
            font-weight: 500;
        }
    }
    .container {
        max-width: 800px;
    }

    .process-card {
        background: var(--ks-background-secondary);
        color: var(--ks-content-primary);
        box-shadow: none;
    }

    .item-number {
        font-size: $font-size-3xl;
        color: var(--ks-content-tag-success);
    }

    .icon {
        height: $rem-4;
    }
    .arrow {
        padding-left: 2.75rem;
    }
</style>