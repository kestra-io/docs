<template>
    <div class="card mb-3 bg-dark-2">
        <div class="card-body d-flex flex-column justify-content-between">
            <div class="d-flex flex-column">
                <div class="w-100 d-flex justify-content-between align-items-center">
                    <span class="card-quote">“</span>
                    <NuxtImg
                        class="company-icon"
                        data-aos="fade-up"
                        :src="'/landing/companies/' + item.imgName  + '.svg'"
                        :alt="item.imgName"
                    />
                </div>
                <p class="mt-3">
                    {{ item.message }}
                </p>
            </div>
            <div class="footer">
                <div />
                <span>
                    <a :href="item.link" target="_blank">{{ item.name }}</a><br />
                    {{ item.designation }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            item: {
                type: Object
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .card {
        border: $block-border;
        height: 100%;

        .card-body {
            height: 100%;
            padding: $rem-2;
            text-align: left;
            .card-quote {
                color: $purple-35;
                font-size: calc($font-size-base * 4.625);
                line-height: calc($spacer * 3.75);;
                height: 22px;
            }

            .company-icon {
                height: 1.25rem;
            }

            p, .footer a {
                color: $white-6 !important;
            }

            p {
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 10;
                line-clamp: 10;
                -webkit-box-orient: vertical;
            }

            .footer {
                div {
                    height: 5px;
                    width: 25px;
                    background-color: $purple;
                    margin-bottom: $rem-1;
                }

                span {
                    color: $purple;
                }
            }
        }
    }
</style>
