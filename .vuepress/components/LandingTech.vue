<template>
  <section class="section bg-light mt-0 mt-md-5 mb-6">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 text-center">
          <div class="section-title mb-4 pb-2">
            <h4 class="title mb-4">Build with cloud native technologies</h4>
            <p class="text-muted para-desc mx-auto mb-0">Enjoy <span class="text-primary font-weight-bold">infinite scalability</span>
              since <strong>Kestra</strong> was built from inception with cloud native concept and rely on top technologies with no Single Point of Failure.<br />
              Grow from few executions to millions without the pain.
            </p>
          </div>
        </div>
        <!--end col-->
      </div>
      <!--end row-->

      <div class="row justify-content-center">
        <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 tech-avatar">
          <img src="landing/tech/kafka.png" class="avatar" alt="">
        </div>
        <!--end col-->

        <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 tech-avatar">
          <img src="landing/tech/kafka-stream.png" class="avatar" alt="">
        </div>
        <!--end col-->

        <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 tech-avatar">
          <img src="landing/tech/elasticsearch.png" class="avatar" alt="">
        </div>
        <!--end col-->

        <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 tech-avatar">
          <img src="landing/tech/java.png" class="avatar" alt="">
        </div>
        <!--end col-->

        <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 tech-avatar">
          <img src="landing/tech/micronaut.svg" class="avatar" alt="">
        </div>
        <!--end col-->

        <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 tech-avatar">
          <img src="landing/tech/kubernetes.png" class="avatar" alt="">
        </div>
        <!--end col-->

      </div>
      <!--end row-->
    </div>
    <!--end container-->
  </section>
</template>

<script>
  export default {
    data() {
      return {}
    },
    components: {}
  }
</script>


<style lang="scss">
  @import "../styles/landing/variables";

  .tech-avatar {
    height: 50px;
    vertical-align: center;

    img {
      max-height: 50px;
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
