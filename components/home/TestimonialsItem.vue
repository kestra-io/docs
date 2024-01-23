<template>
    <div class="card mb-3 bg-dark-2">
        <div class="card-body d-flex flex-column justify-content-between">
            <p>
                {{ item.message }}
            </p>
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
        border: 1px solid $black-3;
        height: 259px;
        max-height: 259px;
        .card-body {
            padding: $rem-2;
            text-align: left;
            p, .footer a {
                color: $white-6 !important;
            }

            p {
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 4;
                line-clamp: 4;
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
