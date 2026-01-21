<template>
	<div class="mt-5">
		<div class="header-container">
			<div class="header container d-flex flex-column align-items-center gap-3">
				<h1 data-usal="fade-l">Blueprints</h1>
				<h4 data-usal="fade-r">
					The first step is always the hardest. Explore blueprints to kick-start your next
					flow
				</h4>
				<div class="col-12 search-input position-relative">
					<input
						type="text"
						class="form-control form-control-lg"
						placeholder="Search across 250+ blueprints"
						v-model="searchQuery"
					/>
					<Magnify class="search-icon" />
				</div>
			</div>
		</div>
		<div class="mt-5" data-usal="fade-l">
			<button
				v-for="tag in orderedTags"
				:key="tag.name"
				:class="{
					active: activeTags.some((item) => item.name === tag.name),
				}"
				@click="setTagBlueprints(tag)"
				class="m-1 rounded-button"
			>
				{{ tag.name }}
			</button>
		</div>
		<div class="row my-5">
			<div
				v-if="blueprintsPaginated && blueprintsPaginated.length > 0"
				class="col-lg-4 col-md-6 mb-4"
				v-for="blueprint in blueprintsPaginated"
				:key="blueprint.id"
				data-usal="zoomin"
			>
				<BlueprintsListCard
					:blueprint="blueprint"
					:tags="tags"
					:href="generateCardHref(blueprint)"
				/>
			</div>

			<div
				v-else
				class="col-12 d-flex flex-column align-items-center justify-content-center py-5"
			>
				<h4 class="text-white mb-4">No blueprints for your selection</h4>
				<button class="rounded-button active" @click="resetFilters">Reset all tags</button>
			</div>

			<CommonPaginationContainer
				:current-url="currentUrl"
				:total-items="filteredBlueprints?.length"
				@update="
					(payload) => {
						currentPage = payload.page
						itemsPerPage = payload.size
						changePage()
					}
				"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, onMounted, ref, watch } from "vue"
	import Magnify from "vue-material-design-icons/Magnify.vue"
	import BlueprintsListCard from "~/components/blueprints/ListCard.vue"
	import CommonPaginationContainer from "~/components/common/PaginationContainer.vue"

	const currentPage = ref<number>(1)
	const itemsPerPage = ref<number>(24)
	const blueprints = ref<Blueprint[]>([])
	const activeTags = ref<BlueprintTag[]>([{ name: "All tags" }])
	const tags = ref<BlueprintTag[]>([])
	const totalPages = ref<number>(0)
	const totalBlueprints = ref<number>(0)
	const searchQuery = ref<string>("")

	const props = defineProps<{
		tags: BlueprintTag[]
		currentUrl: string
		allBlueprints: Blueprint[]
	}>()

	const CUSTOM_ORDER = [
		"Getting Started",
		"Core",
		"Infrastructure",
		"Data",
		"AI",
		"Business",
		"Cloud",
	]
	const orderedTags = computed(() => {
		const sortedTags = [...props.tags].sort((a, b) => {
			let indexA = CUSTOM_ORDER.indexOf(a.name)
			let indexB = CUSTOM_ORDER.indexOf(b.name)
			if (indexA === -1) indexA = 999
			if (indexB === -1) indexB = 999
			return indexA - indexB
		})
		return [{ name: "All tags" }, ...sortedTags]
	})

	const activeTagIds = computed(() => {
		return activeTags.value
			.filter((tag) => tag.name !== "All tags" && tag.id)
			.map((tag) => tag.id)
			.join(",")
	})

	const filteredBlueprints = computed(() => {
		let filtered = props.allBlueprints

		if (
			activeTags.value.length &&
			!(activeTags.value.length === 1 && activeTags.value[0].name === "All tags")
		) {
			filtered = filtered.filter((blueprint) =>
				activeTags.value.every((tag) => {
					return blueprint.tags?.some((blueprintTag) => blueprintTag === tag.id)
				}),
			)
		}

		if (searchQuery.value.length) {
			const q = searchQuery.value.toLowerCase()
			filtered = filtered.filter(
				(blueprint) =>
					blueprint.title?.toLowerCase().includes(q) ||
					blueprint.description?.toLowerCase().includes(q),
			)
		}

		return filtered
	})

	const blueprintsPaginated = computed(() => {
		const start = (currentPage.value - 1) * itemsPerPage.value
		const end = currentPage.value * itemsPerPage.value
		return filteredBlueprints.value.slice(start, end) ?? []
	})

	const setTagBlueprints = (tagVal: BlueprintTag) => {
		if (tagVal.name === "All tags") {
			activeTags.value = [{ name: "All tags" }]
			return
		}

		let currentTags = activeTags.value.filter((t) => t.name !== "All tags")

		const index = currentTags.findIndex((t) => t.name === tagVal.name)
		if (index === -1) {
			currentTags.push(tagVal)
		} else {
			currentTags.splice(index, 1)
		}

		if (currentTags.length === 0) {
			activeTags.value = [{ name: "All tags" }]
		} else {
			activeTags.value = currentTags
		}
	}

	const resetFilters = () => {
		activeTags.value = [{ name: "All tags" }]
		searchQuery.value = ""
		currentPage.value = 1
	}

	const changePage = () => {
		if (typeof window !== "undefined") {
			window.scrollTo({ top: 0 })
		}
	}

	const generateCardHref = (blueprint: Blueprint) => {
		return `/blueprints/${blueprint.id}`
	}

	const setBlueprints = (allBlueprints: Blueprint[], total: number) => {
		blueprints.value = allBlueprints || []
		totalBlueprints.value = total || 0
		totalPages.value = itemsPerPage.value ? Math.ceil(total / itemsPerPage.value) : 0
	}

	onMounted(() => {
		const url = new URL(props.currentUrl)
		if (url.searchParams.has("page"))
			currentPage.value = parseInt(url.searchParams.get("page") as string)
		if (url.searchParams.has("size"))
			itemsPerPage.value = parseInt(url.searchParams.get("size") as string)
		setTimeout(() => {
			if (url.searchParams.has("q")) searchQuery.value = url.searchParams.get("q") as string
		}, 200)
		if (url.searchParams.has("tags")) {
			const tagIds = (url.searchParams.get("tags") as string).split(",")
			const foundTags = tags.value.filter((item) => item.id && tagIds.includes(item.id))
			if (foundTags.length > 0) {
				activeTags.value = foundTags
			}
		}
	})

	let timer: NodeJS.Timeout
	watch(
		[currentPage, itemsPerPage, searchQuery, activeTags],
		(
			[pageVal, itemVal, searchVal, activeTagsVal],
			[oldPage, oldItemVal, oldSearch, oldTags],
		) => {
			if (timer) clearTimeout(timer)

			timer = setTimeout(async () => {
				const isFilterChange =
					itemVal !== oldItemVal ||
					searchVal !== oldSearch ||
					JSON.stringify(activeTagsVal) !== JSON.stringify(oldTags)
				const newPage = isFilterChange ? 1 : pageVal

				if (isFilterChange && currentPage.value !== 1) {
					currentPage.value = 1
				}

				function getQuery() {
					let query: Record<string, any> = {
						page: newPage,
						size: itemVal,
					}
					if (activeTagIds.value) query["tags"] = activeTagIds.value
					if (searchVal?.length) query["q"] = searchVal
					return query
				}

				const url = new URL(window.location.href)
				url.search = new URLSearchParams(getQuery()).toString()

				history.pushState({}, "", url)
			}, 500)
		},
		{ deep: true },
	)
</script>

<style lang="scss" scoped>
	@import "~/assets/styles/variable";

	.header-container {
		background: url("/landing/plugins/bg.svg") no-repeat top;
		.header {
			padding-bottom: calc($spacer * 4.125);
			border-bottom: 1px solid rgba(255, 255, 255, 0.1);

			h1,
			h4 {
				color: $white;
				text-align: center;
				font-weight: 300;
				margin-bottom: 0;
			}

			h1 {
				font-size: $font-size-4xl;
			}

			h4 {
				font-size: $font-size-xl;
			}

			.search-input {
				max-width: 21rem;

				input {
					border-radius: 4px;
					border: 1px solid #404559;
					background-color: #1c1e27;

					&,
					&::placeholder {
						color: $white;
						font-size: $font-size-md;
						font-weight: 400;
					}
				}

				.search-icon {
					position: absolute;
					top: calc($spacer * 0.563);
					left: calc($spacer * 1.125);
					font-size: calc($spacer * 1.125);
					color: $white;
				}
			}
		}
	}
	.form-control {
		padding-left: 2.5rem;

		&:focus {
			border-color: var(--bs-border-color);
			box-shadow: none;
		}
	}

	.rounded-button {
		border-radius: 0.25rem;
		color: var(--bs-white);
		padding: calc($spacer / 2) calc($spacer / 1);
		margin-right: calc($spacer / 2);
		background-color: $black-2;
		border: 0.063rem solid $black-3;
		font-weight: bold;
		font-size: $font-size-sm;
		line-height: 1.375rem;

		&.active {
			background-color: $primary-1;
			border-color: $primary-1;
		}
	}

	.pagination-container .form-select {
		border-radius: 4px;
		border: $block-border;
		color: $white;
		text-align: center;
		font-family: $font-family-sans-serif;
		font-size: $font-size-sm;
		font-style: normal;
		font-weight: 700;
	}
</style>