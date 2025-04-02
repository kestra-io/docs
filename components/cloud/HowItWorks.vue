<template>
    <div class="container my-5 how-it-works">
        <h2>How It Works</h2>
        <div class="row my-5 pb-5">
            <div
                v-for="(column, index) in columns"
                :key="index"
                class="col-md-12 col-lg"
            >
                <div class="numbers-wrapper mb-3">
                    <div class="numbers">{{ index + 1 }}</div>
                </div>
                <h6 class="mb-3">{{ column.title }}</h6>
                <p>{{ column.description }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const columns = [
    {
        title: "Request Access",
        description:
            "Complete our short form to request your spot in the program.",
    },
    {
        title: "Selection & Scheduling",
        description:
            "Our team selects qualified participants and schedules a brief call with you.",
    },
    {
        title: "Validation Call",
        description:
            "We'll confirm your participation and outline the details and conditions of your exclusive access.",
    },
    {
        title: "Setup & Launch",
        description:
            "We provision your Kestra Cloud instance so you can start orchestrating workflows immediately.",
    },
    {
        title: "Feedback & Next Steps",
        description:
            "After your exclusive access, we'll collect your feedback and discuss personalized next steps for ongoing use.",
    },
];
</script>

<style scoped lang="scss">
.cloud {
    & .how-it-works::after {
        content: "";
        position: fixed;
        bottom: 0;
        left: -50%;
        width: 100vw;
        height: 100vh;
        background-image: url("./images/gradient_bottom.png");
        background-size: cover;
        background-position: bottom left;
        background-repeat: no-repeat;
        transition: all 0.3s ease;
        z-index: -1;
    }

    @media (max-width: 991.98px) {
        & .how-it-works::after {
            display: none;
        }
    }

    & .numbers {
        font-weight: 600;
        font-size: 12px;
        height: 24px;
        width: 24px;
        border: 1px solid grey;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    & .numbers-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        position: relative;
    }

    & .numbers-wrapper::after {
        content: "";
        flex-grow: 1;
        border-top: 1px dotted white;
        margin-left: 10px;
        height: 0;
    }
}
</style>
