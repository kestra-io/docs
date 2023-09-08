<template>
    <div class="container">
        <Section title="Perks & Benefits">
            <div class="row card-group card-centered mb-2">
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><MedalOutline /></span>
                            <h4 class="card-title">Partner Badge</h4>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><PlaylistStar /></span>
                            <h4 class="card-title">Partner Directory Listing</h4>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><Looks /></span>
                            <h4 class="card-title">Marketing & Co-branding Materials</h4>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><ToggleSwitchOutline /></span>
                            <h4 class="card-title">Partner Enablement</h4>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><ClockFast /></span>
                            <h4 class="card-title">Priority Services Routing</h4>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><GamepadOutline /></span>
                            <h4 class="card-title">Sandbox Enterprise Edition</h4>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><TimerSandEmpty /></span>
                            <h4 class="card-title">Feature Early Access</h4>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    </div>
</template>

<script setup>
    import Section from '../layout/Section.vue'
    import MedalOutline from 'vue-material-design-icons/MedalOutline.vue'
    import PlaylistStar from 'vue-material-design-icons/PlaylistStar.vue'
    import Looks from 'vue-material-design-icons/Looks.vue'
    import ToggleSwitchOutline from 'vue-material-design-icons/ToggleSwitchOutline.vue'
    import ClockFast from 'vue-material-design-icons/ClockFast.vue'
    import GamepadOutline from 'vue-material-design-icons/GamepadOutline.vue'
    import TimerSandEmpty from 'vue-material-design-icons/TimerSandEmpty.vue'
</script>

<style scoped lang="scss">
    .card-group {
        background: none !important;
        justify-content: start;

        .card {
            min-height: 190px;
            padding: 32px 16px;
        }
    }
</style>