<template>
    <div class="container">
        <Section
            subtitle="Reasons to integrate with"
            subtitle-after="Kestra"
        >
            <div class="row card-group mb-2">
                <div class="col-12 col-sm-6 col-md-4 col-xl-3 mb-4">
                    <Card
                        :icon="MedalOutline"
                        title="Partner Badge"
                    />
                </div>

                <div class="col-12 col-sm-6 col-md-4 col-xl-3 mb-4">
                    <Card
                        :icon="PlaylistStar"
                        title="Partner Directory Listing"
                    />
                </div>

                <div class="col-12 col-sm-6 col-md-4 col-xl-3 mb-4">
                    <Card
                        :icon="Looks"
                        title="Marketing & Co-branding Materials"
                    />
                </div>

                <div class="col-12 col-sm-6 col-md-4 col-xl-3 mb-4">
                    <Card
                        :icon="ToggleSwitchOutline"
                        title="Partner Enablement"
                    />
                </div>

                <div class="col-12 col-sm-6 col-md-4 col-xl-3 mb-4">
                    <Card
                        :icon="ClockFast"
                        title="Priority Services Routing"
                    />
                </div>

                <div class="col-12 col-sm-6 col-md-4 col-xl-3 mb-4">
                    <Card
                        :icon="GamepadOutline"
                        title="Sandbox Enterprise Edition"
                    />
                </div>

                <div class="col-12 col-sm-6 col-md-4 col-xl-3 mb-4">
                    <Card
                        :icon="TimerSandEmpty"
                        title="Feature Early Access"
                    />
                </div>
            </div>
        </Section>
    </div>
</template>

<script setup>
    import Section from '../layout/Section.vue'
    import Card from '../card/Card.vue';
    import MedalOutline from 'vue-material-design-icons/MedalOutline.vue'
    import PlaylistStar from 'vue-material-design-icons/PlaylistStar.vue'
    import Looks from 'vue-material-design-icons/Looks.vue'
    import ToggleSwitchOutline from 'vue-material-design-icons/ToggleSwitchOutline.vue'
    import ClockFast from 'vue-material-design-icons/ClockFast.vue'
    import GamepadOutline from 'vue-material-design-icons/GamepadOutline.vue'
    import TimerSandEmpty from 'vue-material-design-icons/TimerSandEmpty.vue'
</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .container {
        border-bottom: $block-border;
    }

    .card-group {
        justify-content: start;
    }
</style>