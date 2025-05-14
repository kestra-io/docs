<template>
    <form class="submit-form wrapper" id="newsletter" @submit="checkForm" novalidate>
        <h3>Get Kestra updates</h3>
        <p class="mt-3" data-aos="zoom-in">Stay up to date with the latest features and changes to Kestra</p>
        <div v-if="valid === true && message" class="alert alert-success" v-html="message" />
        <div v-if="valid === false && message" class="alert alert-danger">{{ message }}</div>
        <div class="fields">
            <label class="visually-hidden" for="newsletter-email">Email</label>
            <input name="email" type="email" class="form-control form-control-lg" id="newsletter-email" placeholder="Email" required>
        </div>

        <button type="submit" class="btn btn-primary">Subscribe</button>
    </form>
</template>

<script setup>
    import Twitter from "../components/icons/TwitterXIcon.vue";
    import Youtube from "vue-material-design-icons/Youtube.vue";
    import newsletterSubmit from "../../utils/newsletterSubmit.js";

    const valid = ref(false);
    const message = ref(null);

    function checkForm(e) {
        newsletterSubmit(this, e);
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";


    .wrapper {
        position: relative;
        background: #282B33;
        border-radius: 1rem;
        padding: 1rem;
        color: white;
        border: 1px solid #3D3D3F;
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

            &:-webkit-autofill{
                -webkit-background-clip: text;
                -webkit-text-fill-color: $white-1;
                transition: background-color 5000s ease-in-out 0s;
            }
        }

        h3 {
            font-size: 1.5rem;
            font-weight: 400;
        }

        .fields{
            input {
                width: 100%;
                margin-bottom: 1rem;
            }
        }

        button{
            width:100%
        }

</style>