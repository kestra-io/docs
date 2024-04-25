<template>
    <div class="video-container">
        <div class="thumbnail">
            <NuxtImg loading="lazy" format="webp" class="thumbnail-img" :src="video.thumbnail" :alt="video.title" />
            <NuxtImg loading="lazy" class="youtube-icon" src="/landing/tutorial-videos/youtube-icon.svg" alt="youtube icon" />
        </div>
        <p class="category">{{video.category}}</p>
        <h3 class="title">{{video.title}}</h3>
        <p class="video-info" v-if="video.publicationDate">
            {{getYMD(video.publicationDate)}}
        </p>
        <p class="canal-name">{{video.author}}</p>
    </div>
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
            .youtube-icon {
                position: absolute;
                top: calc(50% - 25px);
                right: calc(50% - 35px);
                width: 70px;
                color: #ff0000;
                font-size: 120px;
                path {
                    background-color: white;
                }
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
