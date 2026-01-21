<template>
	<section class="built">
		<div class="container">
			<h3 data-usal="fade-u delay-0 duration-400 ease-out">
				Built for the Way
				<span class="highlight">Infrastructure</span> Teams Work
			</h3>

			<div class="cards-grid">
				<div
					v-for="(item, index) in ITEMS"
					:key="item.title"
					class="card"
					:class="{ 'even-bg': item.evenBg }"
					:data-usal="`${index % 2 === 0 ? 'fade' : 'zoomin'} delay-0 duration-400 ease-out`"
				>
					<component v-if="item.icon" :is="item.icon" class="icon" />
					<h4 class="title">{{ item.title }}</h4>
					<a
						v-if="item.hasButton"
						to="/docs/quickstart"
						class="btn btn-primary btn-gradient"
					>
						Get Started
					</a>
					<p v-else class="description">
						{{ item.description }}
					</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
	import Git from "vue-material-design-icons/Git.vue"
	import ToolboxOutline from "vue-material-design-icons/ToolboxOutline.vue"
	import SecurityNetwork from "vue-material-design-icons/SecurityNetwork.vue"
	import CloudSyncOutline from "vue-material-design-icons/CloudSyncOutline.vue"
	import ShieldLockOutline from "vue-material-design-icons/ShieldLockOutline.vue"
	import FilterRemoveOutline from "vue-material-design-icons/FilterRemoveOutline.vue"
	import ClipboardTextSearchOutline from "vue-material-design-icons/ClipboardTextSearchOutline.vue"
	import ImageFilterCenterFocusStrong from "vue-material-design-icons/ImageFilterCenterFocusStrong.vue"

	const ITEMS = [
		{
			icon: ImageFilterCenterFocusStrong,
			title: "Centralized Orchestration",
			description:
				"Your Unified Infrastructure Control Plane. From Terraform to Python, manage every tool and script in a single, governed environment.",
		},
		{
			icon: SecurityNetwork,
			title: "Secure Remote Execution",
			description:
				"Run tasks safely inside air-gapped networks, VPCs, and private data centers, or in the cloud of your choice.",
		},
		{
			icon: ClipboardTextSearchOutline,
			title: "Audit-Ready by Design",
			description:
				"Automatically capture full run history, task logs, approvals, and evidence bundles for instant compliance.",
		},
		{
			icon: CloudSyncOutline,
			title: "Self-Service Infrastructure",
			description:
				"Manage infrastructure directly from a self service catalog. Kestra provisions the server, syncs the records, and resolves the ticket request automatically.",
		},
		{
			icon: ToolboxOutline,
			title: "Bring Your Own Tools",
			description:
				"Reuse your existing scripts, Terraform modules, Ansible roles, alongside VMware, NetApp or any other tool you already use.",
		},
		{
			icon: FilterRemoveOutline,
			title: "No BoilerPlate",
			description:
				"Keep your scripts lightweight. Offload inputs, secrets, retries, and backoff logic to Kestra, so your code focuses purely on the business logic.",
		},
		{
			icon: ShieldLockOutline,
			title: "Built for Hybrid & Air-Gapped",
			description:
				"Manage cloud, IT, and OT automation from one platform. Execute tasks securely inside your VPCs or private networks.",
		},
		{
			icon: Git,
			title: "Native GitOps Integration",
			description:
				"Workflows live in your codebase, move through CI/CD pipelines, and can be instantly rolled back if a deployment fails.",
		},
		{
			title: "Unify, Secure, and Automate Your Infrastructure",
			hasButton: true,
			evenBg: true,
		},
	]
</script>

<style lang="scss" scoped>
	@import "~/assets/styles/variable";

	.built {
		background-color: $white;
		width: 100%;
		padding: 2rem 0.5rem;

		@include media-breakpoint-up(md) {
			padding: 4rem 8px;
			padding-bottom: 90px;
		}

		.container {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 2rem;

			@include media-breakpoint-up(md) {
				gap: 4rem;
			}

			h3 {
				font-size: 2rem;
				text-align: center;
			}

			.cards-grid {
				display: flex;
				flex-wrap: wrap;
				gap: 1rem;
				justify-content: center;
				width: 100%;

				.card {
					border-radius: 12px;
					background-color: #f4f6ff;
					padding: 2rem;
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					align-items: flex-start;
					gap: 8px;

					@include media-breakpoint-up(lg) {
						max-width: 360px;
					}

					.icon {
						font-size: 1.5rem;
						align-self: flex-start;
						color: #4b0aaa;
					}

					.title {
						font-weight: 700;
						font-size: 18.4px;
						line-height: 28px;
						margin: 0;
					}

					.description {
						font-weight: 400;
						font-size: 14px;
						line-height: 22px;
						margin: 0;
					}

					&.even-bg {
						background-color: #e5eaff !important;
						justify-content: center;
						align-items: center;
						text-align: center;
						gap: 0.5rem;
					}
				}
			}
		}
	}
</style>