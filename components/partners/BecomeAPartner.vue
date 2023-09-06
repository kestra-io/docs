<template>
    <div class="container-fluid">
        <Section
            title="Become a Partner"
            baseline="If you are interested in becoming a Kestra partner, please contact us with any questions."
        >
            <div class="d-flex justify-content-center">
                <PartnersBecomeAPartnerForm data-aos="fade-left" />
            </div>
        </Section>
    </div>
</template>

<script setup>
import Section from "../layout/Section.vue";
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";
.container-fluid {
    background: $purple-13;
    :deep(h2) {
        font-size: $h3-font-size;
    }
    :deep(p.baseline) {
        font-size: $font-size-base;
    }
}
</style>
