<template>
    <section class="section bg-white overflow-hidden">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 text-center">
                    <div class="section-title mb-4 pb-2">
                        <h4 class="title mb-4" data-aos="fade-left">Loved & trusted by leading enterprises worldwide</h4>
                    </div>
                </div>
            </div>

            <div class="row justify-content-center">
                <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 company-avatar">
                    <div data-aos="fade-right">
                        <img src="../../assets/home/companies/tencent.svg" class="avatar" alt="">
                    </div>
                </div>

                <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 company-avatar">
                    <div data-aos="fade-right">
                        <img src="../../assets/home/companies/dnb.png" class="avatar" alt="">
                    </div>
                </div>

                <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 company-avatar">
                    <div data-aos="fade-right">
                        <img src="../../assets/home/companies/ntico.png" class="avatar" alt="">
                    </div>
                </div>

                <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 company-avatar">
                    <div data-aos="fade-right">
                        <img src="../../assets/home/companies/huawei.svg" class="avatar" alt="">
                    </div>
                </div>

                <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 company-avatar">
                    <div data-aos="fade-right">
                        <img src="../../assets/home/companies/iqtig.jpg" class="avatar" alt="">
                    </div>
                </div>

                <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 company-avatar">
                    <div data-aos="fade-right">
                        <img src="../../assets/home/customers/lm.svg" class="avatar" alt="">
                    </div>
                </div>
            </div>
        </div>
        <Shape class="text-dark" />
    </section>
</template>

<script>
import Shape from "../layout/Shape";
export default {
    data() {
        return {}
    },
    components: {Shape}
}
</script>

<style lang="scss" scoped>
@import ".vuepress/theme/styles/variables";

section {
    padding: 50px 0 100px 0;

    /deep/ .shape {
        bottom: -100px;
    }
}

.company-avatar {
    height: 50px;
    align-items: center;
    justify-content: center;
    display: flex;
    a {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    img {
        display: flex;
        max-height:50px;
        filter: grayscale(1);
        transition: 0.2s;
    }

    &:hover {
        img {
            filter: grayscale(0);
        }
    }
}
</style>
