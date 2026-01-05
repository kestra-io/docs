<template>
    <div class="col-md-8 mb-0">
        <div class="biz-ctn">
            <div class="biz-us">
                <div class="info-ctn">
                    <div class="info-itm w-100">
                        <h3><span class="quote-mk">"</span>{{ story.quote }}<span class="quote-mk">"</span></h3>
                        <p class="auth-name">{{ story.quotePerson }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="story-ctn">
            <ContentRenderer class="bd-markdown" :value="content" />
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        story: {
            quote: string;
            quotePerson: string 
        };
        content: string;
    }>();
</script>

<style scoped lang="scss">
    @import "~/assets/styles/_variable.scss";

    .biz-ctn {
        margin-bottom: 2rem;
        background-color: $white;
        border: 1px solid $white-1;
        border-radius: 8px;
        padding: 6px;

        .biz-us {
            background-color: #F9F9FB;
            border-radius: 4px;
            padding: 2.5rem;

            .info-ctn {
                display: flex;
                flex-direction: column;

                h3 {
                    font-size: 1.5rem;
                    line-height: 1.4;
                    font-weight: 700;
                    font-style: normal;
                    color: $black-2;
                    margin: 0;

                    .quote-mk {
                        color: $primary;
                    }
                }

                .auth-name {
                    font-size: $font-size-base;
                    font-weight: 500;
                    margin-top: 1rem;
                    color: $white-5;
                    margin-bottom: 0;
                }
            }
        }
    }

    .story-ctn {
        :deep(.bd-markdown) {
            p {
                font-size: $h6-font-size;
                line-height: 1.6;
                color: $black-2;
                font-weight: 400;
            }

            a {
                color: $primary !important;
                text-decoration: underline !important;
            }

            h2 {
                margin-top: 3rem;
                margin-bottom: 1rem;
                font-size: 2rem;
                font-weight: 700;
                color: $black-2 !important;
            }

            h3 {
                margin-top: 2rem;
                font-size: 1.5rem;
                font-weight: 600;
                color: $black-2 !important;
            }

            h2 > a, h3 > a {
                color: $black-2 !important;
                text-decoration: none !important;
            }

            strong {
                font-weight: 700;
                color: $black-2;
            }

            ul > li {
                color: $black-2;
                line-height: 1.6;
            }

            ul > li::marker {
                color: $primary;
            }

            blockquote {
                border-left: 4px solid $primary;
                background-color: #F9F9FB;
                padding: 1.5rem;
                margin: 2rem 0;
                border-radius: 0 8px 8px 0;

                p {
                    margin: 0;
                    font-style: italic;
                    color: $black-2;
                }
            }
        }
    }
</style>