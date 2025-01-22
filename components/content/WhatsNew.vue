<template>
  <div>
        <h2>{{title}}</h2>
        <div class="list-of-posts">
            <template v-for="(post, index) of posts" :key="post.slug" >
                <hr v-if="index > 0" />
                <NuxtLink :to="`/blogs/${post.slug}`" class="post-card">
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
    font-size: 17pt;
    margin-bottom: 2rem;
    font-weight: 600;
}
.list-of-posts{
    display: flex;
    flex-direction: column;
    gap: .125rem;
    hr{
        width: 100%;
        border: none;
        border-top: 1px solid $black-3;
    }
}
.post-card{
    display: flex;
    gap: 1rem;
    align-items: start;
    padding-right: 1rem;
    transition: all .3s;
    background-image: linear-gradient(-90deg, rgba($primary,.5) 0%, $primary .3%,rgba($primary,.5) .6%, rgba(black, 0) 1%, rgba(black, 0) 100%);
}

.card-img-left{
    width: 125px;
    height: 70px;
    object-fit: cover;
}
.card-body{
    display: flex;
    flex-direction: column;
}
.card-details{
    font-size: 10pt;
}
.card-category{
    color: $purple-36;
    margin-right: 1rem;
}
.card-date{
    color: $white-3;
}
.card-title{
    font-size: 12pt;
    font-weight: normal;
}
</style>