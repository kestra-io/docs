<template>
    <div class="container">
        <Section
            title="Perks & Benefits"
            subtitle="Committed to Your Well-being"
        >
            <p class="text-center">
                Feeling your best allows you to do your best. We take care of the whole of you.
            </p>

            <div class="row card-group card-centered mb-2">
                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                                <span class="card-icon">
                                    <Earth />
                                </span>
                            <h5 class="card-title">
                                Work from anywhere
                            </h5>
                            <p class="card-text">We're a remote-first and completely distributed team, so you can work wherever home is.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                                <span class="card-icon">
                                    <CalendarClock />
                                </span>
                            <h5 class="card-title">Flexible working hours</h5>
                            <p class="card-text">Flexibility in schedule to be there for life’s important moments.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                                <span class="card-icon">
                                    <ScaleBalance />
                                </span>
                            <h5 class="card-title">Work/life balance</h5>
                            <p class="card-text">Prioritize work-life balance in the way that works best for you and generous vacation policy.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row card-group card-centered mb-2">
                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                                <span class="card-icon">
                                    <MedicalBag />
                                </span>
                            <h5 class="card-title">
                                Expanded health benefits
                            </h5>
                            <p class="card-text">Including premium medical, dental, and vision coverage for employees and their dependent loved ones.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                                <span class="card-icon">
                                    <ChairRolling />
                                </span>
                            <h5 class="card-title">Office costs covered</h5>
                            <p class="card-text">Work from home, or from any other coworking space - we’ll cover the costs.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                                <span class="card-icon">
                                    <Laptop />
                                </span>
                            <h5 class="card-title">Up-to-date always</h5>
                            <p class="card-text">We’ll cover all hardware and software needed so you’re always with the latest versions.</p>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../../components/layout/Section.vue';
    import Earth from "vue-material-design-icons/Earth.vue";
    import CalendarClock from "vue-material-design-icons/CalendarClock.vue";
    import ScaleBalance from "vue-material-design-icons/ScaleBalance.vue";
    import MedicalBag from "vue-material-design-icons/MedicalBag.vue";
    import ChairRolling from "vue-material-design-icons/ChairRolling.vue";
    import Laptop from "vue-material-design-icons/Laptop.vue";

    export default {
        components: {Section, Earth, CalendarClock, ScaleBalance, MedicalBag, ChairRolling, Laptop}
    }
</script>