<script lang="ts" setup>
    import { ref } from "vue"
    import newsletterSubmit from "~/utils/newsletterSubmit.js"

    const valid = ref(false)
    const message = ref(null)
    const newsletter = ref(null)

    function checkForm(e: any) {
        newsletterSubmit({ newsletter, valid, message }, e)
    }
</script>

<template>
    <div class="subscription-wrapper">
        <h4>Get Kestra Updates</h4>
        <form
            ref="newsletter"
            class="subscription-box"
            @submit.prevent="checkForm"
            novalidate
        >
            <input
                name="email"
                type="email"
                placeholder="Enter your email"
                required
            />
            <button type="submit" class="btn btn-sm btn-primary">
                Subscribe
            </button>
        </form>
        <div
            v-if="message"
            class="alert mb-0 padding-0"
            :class="valid ? 'text-success' : 'text-danger'"
        >
            <p class="mb-0" v-html="message"></p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .subscription-wrapper {
        display: flex;
        align-items: center;
        gap: 3rem;
        > h4 {
            margin-bottom: 0;
            white-space: nowrap;
        }
        .subscription-box {
            display: flex;
            align-items: center;
            height: 48px;
            padding: 4px 5px 4px 14px;
            border-radius: 8px;
            background: var(--ks-background-input);
            border: 1px solid var(--ks-border-secondary);
            @include media-breakpoint-up(lg) {
                min-width: 498px;
            }
            @include media-breakpoint-down(md) {
                width: -webkit-fill-available;
            }
            input {
                flex-grow: 1;
                border: none;
                background: transparent;
                height: 100%;
                font-size: $font-size-sm;
                color: var(--ks-content-primary);
                outline: none;
                &::placeholder {
                    color: var(--ks-content-tertiary);
                }
            }
            .btn {
                height: 100%;
                border-radius: 6px;
                padding: 0 1.5rem;
                display: flex;
                align-items: center;
                font-weight: 600;
            }
        }
    }
</style>
