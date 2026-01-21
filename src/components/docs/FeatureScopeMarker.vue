<template>
	<div class="mb-3">
		<p class="fw-bold d-flex gap-2 flex-wrap" v-if="page?.editions?.length || page?.version">
			Available on:
			<component
				:is="editionInfo(edition).link ? 'a' : 'span'"
				v-for="edition in page?.editions"
				:key="edition"
				v-if="edition"
				:href="editionInfo(edition).link"
				:target="editionInfo(edition).link ? '_blank' : undefined"
				class="badge d-flex align-items-center text-decoration-none"
				:class="`bg-${editionInfo(edition).color}`"
			>
				{{ editionInfo(edition).label }}
			</component>
			<span v-if="page?.version" class="badge d-flex align-items-center bg-body-tertiary">{{
				page.version
			}}</span>
		</p>
	</div>
	<div class="mb-3" v-if="page?.deprecated">
		<p class="fw-bold d-flex gap-2 flex-wrap">
			Deprecated since:
			<span
				v-if="page?.deprecated.since"
				class="badge d-flex align-items-center bg-body-tertiary"
				>{{ page?.deprecated.since }}</span
			>
			<a
				v-if="page?.deprecated.migrationGuide"
				class="badge d-flex align-items-center bg-secondary text-white"
				:href="page?.deprecated.migrationGuide"
			>
				Migration Guide
			</a>
		</p>
	</div>
	<div class="mb-3" v-if="page?.release">
		<p class="fw-bold d-flex gap-2 flex-wrap">
			Release:
			<span class="badge d-flex align-items-center bg-body-tertiary">{{
				page?.release
			}}</span>
		</p>
	</div>
</template>

<script>
	import Section from "~/components/layout/Section.vue"

	export default {
		components: { Section },
		data() {
			return {
				editionLabelAndColorByPrefix: {
					OSS: {
						label: "Open Source Edition",
						color: "primary",
						link: "https://kestra.io/features",
					},
					EE: {
						label: "Enterprise Edition",
						color: "secondary",
						link: "https://kestra.io/enterprise",
					},
					Cloud: {
						label: "Cloud",
						color: "dark-3",
						link: "https://kestra.io/cloud",
					},
					CLOUD_TEAM: { label: "Cloud Team plan", color: "success" },
					CLOUD_PRO: { label: "Cloud Pro plan", color: "info" },
				},
			}
		},
		props: {
			page: {
				type: Object,
				default: undefined,
			},
		},
		methods: {
			editionInfo(edition) {
				return (
					this.editionLabelAndColorByPrefix?.[edition] ?? {
						label: edition,
						color: "dark-3",
						link: undefined,
					}
				)
			},
		},
	}
</script>