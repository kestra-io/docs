<template>
  <div class="container my-5">
    <div class="d-flex justify-content-center">
      <img
        class="img-fluid "
        src="/landing/features/scheduling/feature/Artworks_Features.svg"
        alt="A screenshot of the Scheduling Page"
      />
    </div>
    <section >
        <h2 >Build, Schedule, and Automate </h2>
        <h2 class="heading-animate">All Your Workflows</h2>
        <p  class="baseline" >
            Kestra simplifies your scheduling and automation tasks through its declarative language, making workflow management straightforward. Build to meet the high standards of software engineers, it's designed to be user-friendly for both engineers and business stakeholders.
        </p>
    </section>
  </div>
</template>
<style scoped lang="scss">
@import "../../../assets/styles/variable";
    section {
        // padding: calc($spacer * 4) 0;    
        
        line-height: 58px;
        h2 {
          text-align: center;
          font-weight: 300 !important;
            margin-bottom: 0;
            font-size: $font-size-3xl;
        }

        p.baseline {
            text-align: center;
            font-size: $font-size-base !important;
            max-width: $baseline-max-width;
            margin: $spacer auto 0;
            line-height: 24px;
            font-weight: 400;
            font-size: $h6-font-size;
        }


    }
.heading-animate{
    background: linear-gradient(90deg, #E151F7 24.82%, #5C47F5 76.81%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>