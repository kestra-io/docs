<template>
    <div class="video-container">
        <iframe
            width="366"
            height="212"
            :src="video.iframeUrl"
            :title="video.title"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
        />
        <p class="category">{{video.category}}</p>
        <h3 class="title">{{video.title}}</h3>
        <p class="video-info" v-if="video.publicationDate">
            {{getYMD(video.publicationDate)}}
        </p>
        <p class="canal-name">{{video.author}}</p>
    </div>
</template>

<script>
  export default {
    name: "TutorialVideo",
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

        iframe {
            border: 1px solid $black-6;
            border-radius: calc($spacer * 0.5);
            width: 100%;
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
