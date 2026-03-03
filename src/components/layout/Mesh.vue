<template>
    <section>
        <div class="container">
            <slot />
        </div>
    </section>
</template>

<style lang="scss" scoped>
    section {
        padding: 4rem 1rem;
        background: var(--ks-background-secondary) url('~/assets/header-grid.svg') no-repeat center / cover;

        .container {
            max-width: 1180px;
        }
    }
</style>

