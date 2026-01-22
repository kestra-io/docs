<template>
    <div class="container">
        <Section
            subtitle="Committed to"
            subtitle-after="Excellence"
            baseline="We take care of everything you need to help you grow and do the best work of your career."
        >
            <div class="row card-group no-shadow mb-2">
                <div class="col-md-4 mb-4">
                    <Card
                        :icon="Earth"
                        title="Work from anywhere"
                        description="We're a remote-first and completely distributed team, so you can work wherever home is."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="CalendarClock"
                        title="Flexible working hours"
                        description="Flexibility in schedule to be there for life’s important moments."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="ScaleBalance"
                        title="Work/life balance"
                        description="Prioritize work-life balance in the way that works best for you and a generous vacation policy."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="MedicalBag"
                        title="Expanded health benefits"
                        description="Including premium medical, dental, and vision coverage for employees and their dependent loved ones."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="ChairRolling"
                        title="Office costs covered"
                        description="Work from home or any other coworking space - we’ll cover the costs."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="Laptop"
                        title="Up-to-date always"
                        description="We’ll cover all hardware and software needed so you’re always with the latest versions."
                    />
                </div>
            </div>
        </Section>
    </div>
</template>
<script lang="ts" setup>
    import Earth from "vue-material-design-icons/Earth.vue"
    import CalendarClock from "vue-material-design-icons/CalendarClock.vue"
    import ScaleBalance from "vue-material-design-icons/ScaleBalance.vue"
    import MedicalBag from "vue-material-design-icons/MedicalBag.vue"
    import ChairRolling from "vue-material-design-icons/ChairRolling.vue"
    import Laptop from "vue-material-design-icons/Laptop.vue"
    import Section from "~/components/layout/Section.vue"
    import Card from "~/components//card/Card.vue"
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    :deep(section) {
        .baseline {
            font-size: $h6-font-size;
        }
    }
</style>