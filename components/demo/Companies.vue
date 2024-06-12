<template>
    <div class="container-fluid">
        <div class="container">
            <p class="title">TRUSTED BY</p>
            <div class="companies">
                <template v-for="(img, index) in companies" :key="index">
                    <NuxtImg
                        data-aos="fade-up"
                        :class="{'inverted': inverted}"
                        :data-aos-delay="index*50"
                        :src="'/landing/companies/' + img.name  + '.svg'"
                        :alt="img.name"
                        :width="img.width"
                        :heigth="img.heigth"
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<script>
  export default defineComponent({

    props: {
      inverted: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      companies() {
        return [
          { name: "acxiom", width: "130px", height: "29px" },
          { name: "bouygues-immobilier", width: "132px", height: "53px" },
          { name: "leroymerlin", width: "63px", height: "39px" },
          { name: "experian", width: "116px", height: "37px" },
          { name: "sophia-genetics", width: "119px", height: "37px" },
          { name: "cleverconnect", width: "136px", height: "29px" },
          { name: "tencent", width: "189px", height: "25px" },
          { name: "gorgias", width: "118px", height: "29px" },
          { name: "jcdecaux", width: "140px", height: "53px" },
          { name: "aimtec", width: "134px", height: "35px" },
          { name: "hcl", width: "77px", height: "11px" },
          { name: "clever-cloud", width: "117px", height: "29px" },
          { name: "quadis", width: "117px", height: "23px" },
          { name: "huawei", width: "54px", height: "53px" },
          { name: "ca", width: "63px", height: "45px" },
          { name: "accredible", width: "167px", height: "27px" },
          { name: "merkle", width: "140px", height: "19px" },
          { name: "renault", width: "135px", height: "33px" },
        ]
          .sort(() => .5 - Math.random())
      },
    }
  });
</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .title {
        text-transform: uppercase;
        font-size: 14px;
        font-weight: 600;
        line-height: 28px;
        color: $white-1;
        text-align: center;
    }

    .companies {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
    }
</style>