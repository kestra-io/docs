<template>
    <section class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="container">
                    <div class="row d-flex justify-content-center align-items-center">
                        <div class="col-lg-6 col-sm-12">
                            <NuxtImg
                                class="w-100"
                                loading="lazy"
                                format="webp"
                                data-aos="fade-up"
                                data-aos-delay="100"
                                :src="source"
                                alt="Power Your Projects"
                            />
                        </div>
                        <div class="col-lg-6 col-sm-12 text-content">
                            <h2><span>Power Your Projects</span><br> {{title}}</h2>
                            <p v-for="desc in description">{{desc}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
  export default {
      props: {
        title: {
          type: String,
          default: undefined,
        },
        description: {
          type: Array,
          default: null,
          required: true,
        },
        source: {
          type: String,
          default: undefined,
        },
      },
  }
</script>
<style scoped lang="scss">
    @import "../../../../assets/styles/variable";

    .container-fluid {
        background-color: $black-1;
        .text-content {
            padding-bottom: 77px;
            padding-top: 77px;
            h2 {
                font-weight: 600;
                font-size: $h2-font-size;
                font-family: $font-family-sans-serif;
                color: $white;

                span {
                    background: linear-gradient(90deg, #E151F7 2.16%, #5C47F5 65.09%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    color: $white;
                }
            }
            p {
                font-weight: 400;
                font-size: $font-size-md;
                color: $white;
            }
        }
    }
</style>