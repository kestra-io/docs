<template>
    <section class="squared">
        <div class="background" />
        <div class="container">
            <slot />
        </div>
    </section>
</template>

<style lang="scss" scoped>
    .squared {
        position: relative;
        padding: 4rem 1rem;
        width: 100%;

        .background {
            position: fixed;
            inset: 0;
            z-index: -1;
            background: var(--ks-background-secondary) url('~/assets/squared-grid.svg') no-repeat top center / 1400px auto;
            pointer-events: none;
        }
    }
</style>
