<template>
    <NuxtLink class="video-container" href="resources/2024-06-27-realtime-triggers">
        <div class="thumbnail">
            <NuxtImg loading="lazy" format="webp" class="thumbnail-img" :src="video.thumbnail" :alt="video.title" />
        </div>
        <h3 class="title">{{video.title}}</h3>
        <p class="video-info" v-if="video.publicationDate">
            {{getYMD(video.publicationDate)}}
        </p>
    </NuxtLink>
</template>

<script>
  import Youtube from "vue-material-design-icons/Youtube.vue";
  export default {
    name: "TutorialVideo",
    components: {Youtube},
    props: {
      video: {
        type: Object,
        required: true
      },
      getYMD: {
        type: Function,
        required: true
      }
    },
  };
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .video-container {
        display: flex;
        flex-direction: column;
        gap:  calc($spacer * 0.25);
        cursor: pointer;

        .thumbnail {
            border: 1px solid $black-6;
            border-radius: calc($spacer * 0.5);
            position: relative;
            overflow: hidden;
            height: 225px;
            .thumbnail-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        p {
            margin: 0;
            font-size: $font-size-sm;
            line-height: calc($spacer * 1.375);
            font-weight: 400;
        }

        p.category {
            color: $purple-36;
        }

        h3.title {
            font-size: $font-size-base;
            font-weight: 400;
            line-height: calc($spacer * 1.5);
            color: $white;
            margin: 0;
        }

        p.video-info {
            color: $white-3;
        }

        p.canal-name {
            color: $black-8;
        }
    }
</style>
