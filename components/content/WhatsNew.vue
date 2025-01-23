<template>
  <div>
        <h2>{{title}}</h2>
        <div class="list-of-posts">
            <template v-for="(post, index) of posts" :key="post._path" >
                <hr v-if="index > 0" />
                <NuxtLink :to="post._path" class="post-card">
                    <img :src="post.image" class="card-img-left" alt="blog.title" />
                    <div class="card-body">
                        <div class="card-details">
                            <span class="card-category">{{ post.category }}</span>
                            <span class="card-date">{{ dateTimeFormat.format(new Date(post.date)) }}</span>
                        </div>
                        <p class="card-title">{{ post.title }}</p>
                    </div>
                </NuxtLink>
            </template>
        </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  }
})

const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
  })

const {data: posts} = await useAsyncData(
    `Blog-Page-Short-List`,
    () => queryContent("/blogs/").sort({date:-1}).limit(4).find()
);
</script>

<style lang="scss" scoped>
@import "../../assets/styles/_variable.scss";
h2{
    font-size: $font-size-xl;
    margin-top: 3rem;
    margin-bottom: 1rem;
    padding: 0;
    font-weight: 600;
}
.list-of-posts{
    display: flex;
    flex-direction: column;
    gap:.125rem
    hr{
        width: 100%;
        border: none;
        border-top: 1px solid $black-3;
        margin: 0;
    }
}
.post-card{
    display: flex;
    gap: 1rem;
    align-items: start;
    padding: .5rem 0;
    &:hover{
        background-image: radial-gradient(circle, rgba($primary,.3) 0%, #13172500 30%);
        background-position: -280px center;
        background-repeat: no-repeat;
    }
}

.card-img-left{
    width: 125px;
    height: 70px;
    object-fit: cover;
    border-radius: .25rem;
    border: 1px solid $black-3;
}
.card-body{
    display: flex;
    flex-direction: column;
}
.card-details{
    font-size: $font-size-xs;
}
.card-category{
    color: $purple-36;
    margin-right: 1rem;
}
.card-date{
    color: $white-3;
}
.card-title{
    font-size: $font-size-sm;
    font-weight: normal;
}
</style>