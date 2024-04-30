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
                                src="/landing/features/language/python/power-python-code.svg"
                                alt="Power Your Projects"
                            />
                        </div>
                        <div class="col-lg-6 col-sm-12 text-content">
                            <h2><span>Power Your Projects</span> with Python</h2>
                            <p>
                                Python scripts are the backbone of many automations, data processing, and web applications. With
                                Python, you can analyze massive datasets, or even build complex machine-learning models. Kestra,
                                with its robust orchestration capabilities, unlocks Python’s potential by managing these scripts
                                effectively.
                            </p>
                            <p>
                                Whether you are automating data ingestion, running nightly builds, or orchestrating complex
                                workflows in real time, Kestra streamlines these processes, making it easier and faster to deliver
                                results.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
  import Section from '../../../layout/Section.vue';
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