<template>
    <section>
        <div class="container d-flex justify-content-center">
            <div class="outer">
                <div class="inner text-center">
                    <div class="d-flex flex-column align-items-center gap-2">
                        <img :src="logo" alt="Newsletter" />
                        <h3 class="title">Get Kestra updates to your inbox</h3>
                        <p class="description">Stay up to date with the latest features and changes to Kestra</p>
                    </div>

                    <div v-if="valid === true && message" class="alert alert-success" v-html="message" />
                    <div v-if="valid === false && message" class="alert alert-danger">
                        {{ message }}
                    </div>

                    <form class="needs-validation d-flex flex-column align-items-center gap-1" ref="newsletter"
                        id="newsletter" @submit="checkForm" novalidate>
                        <input name="email" type="email" class="form-control" id="email"
                            placeholder="Enter your email" required />
                        <button type="submit" class="btn btn-gradient">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
    import logo from "~/assets/email-newsletter.svg?url"
    import { ref } from "vue"
    import newsletterSubmit from "~/utils/newsletterSubmit.js"

    const valid = ref(false)
    const message = ref(null)
    const newsletter = ref(null)

    function checkForm(e: SubmitEvent) {
        newsletterSubmit({ newsletter, valid, message }, e)
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    section {
        padding: $rem-3 0;
        
        .outer {
            @include media-breakpoint-up(md) {
                max-width: 933px;
                height: 417px;
            }
            width: 100%;
            border-radius: 13px;
            border: 1px solid var(--ks-border-primary);
            padding: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .inner {
            @include media-breakpoint-up(md) {
                max-width: 921px;
                height: 405px;
            }
            width: 100%;
            padding: 50px 64px;
            border-radius: 9px;
            background: linear-gradient(0deg, var(--ks-background-secondary), var(--ks-background-secondary)),
                        linear-gradient(180deg, rgba(39, 32, 86, 0.005) 0%, rgba(0, 0, 0, 0) 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 32px;

            .title {
                color: var(--ks-content-primary);
                margin: 0;
            }

            .description {
                color: var(--ks-content-primary);
                margin: 0;
            }

            form {
                width: 100%;
                max-width: 328px;

                input {
                    text-align: center;
                    height: 3rem;
                    border-radius: $border-radius;
                    border: $block-border;
                    background: var(--ks-background-input);
                    color: var(--ks-content-primary);
                    &::placeholder {
                        color: var(--ks-content-tertary);
                    }
                }

                .btn {
                    width: 100%;
                    color: $white;
                }
            }
        }
    }
</style>