<template>
    <form
        ref="newsletter"
        class="submit-form wrapper"
        id="newsletter"
        @submit="checkForm"
        novalidate
    >
        <h3>Get Kestra updates</h3>
        <p class="mt-3" data-usal="zoomin">
            Stay up to date with the latest features and changes to Kestra
        </p>
        <div v-if="valid === true && message" class="alert alert-success" v-html="message" />
        <div v-if="valid === false && message" class="alert alert-danger">
            {{ message }}
        </div>
        <div class="fields">
            <template v-if="mounted">
                <label class="visually-hidden" for="newsletter-email">Email</label>
                <input
                    name="email"
                    type="email"
                    class="form-control form-control-lg"
                    id="newsletter-email"
                    placeholder="Email"
                    required
                />
            </template>
        </div>

        <button type="submit" class="btn btn-primary">Subscribe</button>
    </form>
</template>

<script setup lang="ts">
    import { ref, onMounted } from "vue"

    import newsletterSubmit from "~/utils/newsletterSubmit.js"

    const valid = ref(false)
    const message = ref(null)
    const newsletter = ref(null)
    const mounted = ref(false)

    onMounted(() => {
        mounted.value = true
    })

    function checkForm(e: any) {
        newsletterSubmit({ newsletter, valid, message }, e)
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .wrapper {
        position: relative;
        background: #282b33;
        border-radius: 1rem;
        padding: 1rem;
        color: white;
        border: 1px solid #3d3d3f;
        // necessary to make gradient border appear
        z-index: 0;

        @include media-breakpoint-down(md) {
            padding: calc($spacer * 0.5);
        }

        > div {
            position: relative;
            z-index: 2;
        }
    }

    input {
        border: 1px solid #242427;
        background: $black-4;
        color: $white-1;
        font-size: 15px;
        padding: 13px;

        &::placeholder {
            color: $white-1;
        }

        &:focus {
            background: $black-4;
            color: $white-1;
        }

        &:-webkit-autofill {
            -webkit-background-clip: text;
            -webkit-text-fill-color: $white-1;
            transition: background-color 5000s ease-in-out 0s;
        }
    }

    h3 {
        font-size: 1.5rem;
        font-weight: 400;
    }

    .fields {
        input {
            width: 100%;
            margin-bottom: 1rem;
        }
    }

    button {
        width: 100%;
    }
</style>