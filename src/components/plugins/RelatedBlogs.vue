<template>
	<div v-if="posts && posts.length > 0" class="related-blogs">
		<BlogList
			:posts="posts"
			title="Latest Blog Posts"
			heading-id="latest-blog-posts"
		/>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue"
	import BlogList, { type BlogPost } from "~/components/common/BlogList.vue"

	const props = withDefaults(
		defineProps<{
			posts?: BlogPost[]
		}>(),
		{
			posts: undefined,
		},
	)

	const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
		dateStyle: "long",
	})

	const posts = computed(() => props.posts ?? [])
</script>

<style lang="scss" scoped>
	@import "~/assets/styles/variable";

	.related-blogs {
		padding: 2rem 0;
		border-top: 1px solid var(--kestra-io-token-color-border-secondary);

		@include media-breakpoint-up(lg) {
			margin: 0 -3rem;
			padding: 2rem 3rem;
		}
	}
</style>
