<template>
    <div class="container" id="positions">
        <Section
            title="Our open positions"
            subtitle="It's a Match"
        >
            <p class="text-center">
                We are looking for talented open-source enthusiasts working remotely from anywhere. Browse our open positions, find a job you love, say goodbye to imposter syndrome, and apply.
            </p>
            <div class="card blog rounded border-0 shadow overflow-hidden mb-3">
                <div class="row align-items-center no-gutters">
                    <div class="card-body content">
                        <p class="mb-0 jobs-offers">
                            <span>
                                <NuxtLink href="/company/careers/senior-full-stack-engineer">Senior Full-Stack Engineer</NuxtLink>
                            </span>
                            <span class="badge badge-info">Engineering</span>
                        </p>
                    </div>
                </div>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../../components/layout/Section.vue';

    export default {
        components: {Section}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .jobs-offers {
        font-weight: bold;

        .badge {
            background-color: $purple-18;
            margin-left: $spacer;
        }
    }
</style>