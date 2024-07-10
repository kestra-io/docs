<template>
    <div ref="container" class="container-fluid bg-dark-4">
        <div class="container">
            <div class="mb-5">
                <h2 class="title">Plugin-Powered <span>Flexibility</span></h2>
                <p class="desc">Choose from over 400 plugins that offer direct integration with third-party services, databases, messaging systems, and more.</p>
                <LayoutPlugins />
            </div>
        </div>
    </div>
</template>

<script>

  export default {
    data() {
      return {
        active: 1,
      };
    },
  }
</script>

<style lang="scss" scoped>
    @import "../../../assets/styles/variable";

    .container-fluid {
        background: url("/landing/home/plugins/background.svg") no-repeat center;
        color: var(--bs-white);
        padding: 0;

        .container {
            padding: 4rem 0;
        }

        .title {
            margin: 0;
            color: var(--bs-white);
            text-align: center;
            font-family: $font-family-sans-serif;
            font-size: calc($font-size-base * 3.125);
            font-style: normal;
            font-weight: 400;
            line-height: 4rem;
            padding: 0 20%;
            @include media-breakpoint-down(sm) {
                font-size: 1.875rem;
                line-height: 2.563rem;
            }

            @include media-breakpoint-down(lg) {
                padding: 0;
            }

            span {
                background: linear-gradient(91deg, #E151F7 43.87%, #5C47F5 55.51%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        .desc {
            text-align: center;
            font-size: $h6-font-size;
            font-weight: 300;
            margin: auto;
            max-width: 40%;

            @include media-breakpoint-down(lg) {
                max-width: 100%;
            }
        }

        .row {
            div:nth-child(2) {
                @include media-breakpoint-up(lg) {
                    padding: calc($spacer * 4) calc($spacer * 4) 0;
                }

                h2 {
                    margin-bottom: calc($spacer * 2);
                    background: linear-gradient(90.03deg, #E151F7 2.16%, #5C47F5 65.09%);
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-fill-color: transparent;
                }

                p {
                    font-size: $font-size-lg;
                }
            }
        }
    }


</style>