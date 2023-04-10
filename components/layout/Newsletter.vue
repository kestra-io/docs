<template>
    <div class="container text-center mb-5">
        <div class="rounded">
            <div>
                <h3><span>Get Kestra updates</span> to your inbox</h3>
                <form class="row row-cols-lg-auto g-3 mt-4 mb-4 justify-content-center">
                    <div class="col-12">
                        <label class="visually-hidden" for="newsletter-email">Email</label>
                        <input type="text" class="form-control form-control-lg" id="newsletter-email" placeholder="Email">
                    </div>

                    <div class="col-12">
                        <button type="submit" class="btn btn-lg btn-primary">Subscribe</button>
                    </div>
                </form>

                <p class="mt-3">Stay up to date with the latest features and changes to Kestra</p>
                <Socials class="mt-4 mb-0 socials" />
            </div>
        </div>
    </div>
</template>

<script>
    import Socials from "./Socials.vue";

    export default {
        components: {Socials}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        > div {
            position: relative;
            background: $purple-8;
            padding: calc($spacer * 3);
            color: var(--bs-primary);

            &:before {
                content: "";
                background: url("/landing/dot2.svg") no-repeat bottom right;
                width: 329px;
                height: 236px;
                position: absolute;
                right: 1rem;
                bottom: 1rem;
                z-index: 1;
            }

            > div {
                position: relative;
                z-index: 2;
            }
        }

        h3 {
            font-size: $h3-font-size;
            font-weight: 800;

            span {
                color: var(--bs-black);
            }
        }

        p {
            font-weight: bold;
        }

        .socials {
            font-size: calc($font-size-base * 2);
        }
    }

</style>