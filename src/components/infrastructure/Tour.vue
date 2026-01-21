<template>
	<section class="tour-section">
		<div class="container">
			<div
				class="left-div"
				data-usal="slide-r delay-0 duration-600 ease-out"
			>
				<h2 data-usal="fade-u delay-50 duration-500 ease-out">
					Want to Take a Tour?
				</h2>
				<p data-usal="fade-u delay-100 duration-500 ease-out">
					Explore how Kestra gives you full control over complex
					infrastructure workflows.
				</p>
				<a
					to="/docs/quickstart"
					class="btn btn-primary btn-gradient tour-btn"
					data-usal="zoomin duration-500 delay-150 ease-out"
				>
					Take the tour
				</a>
			</div>
			<div
				class="right-div"
				data-usal="slide-l delay-25 duration-700 ease-out"
			>
				<NuxtImg
					src="/landing/infrastructure/infra-ui.png"
					alt="Infrastructure UI"
					class="img-fluid"
					format="webp"
					densities="x1 x2"
					loading="lazy"
				/>
				<img
					src="/landing/infrastructure/arrow.svg"
					alt="Arrow"
					class="arrow-overlay"
				/>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
	//  NOOP
</script>

<style scoped lang="scss">
	@import "~/assets/styles/variable";

	.tour-section {
		padding: 3rem 1rem 3rem;
		margin-top: -2rem;
		background: #f4f4f4;

		.container {
			display: flex;
			flex-direction: row;
			gap: 1.625rem;
			align-items: center;
			justify-content: center;
			padding: 0;

			@include media-breakpoint-down(lg) {
				flex-direction: column;
			}

			.left-div {
				display: flex;
				flex-direction: column;
				gap: 1rem;

				@include media-breakpoint-up(lg) {
					max-width: 458px;
				}

				h2 {
					font-weight: 600;
					font-size: 1.75rem;
					margin: 0;
				}

				p {
					font-weight: 400;
					font-size: 1rem;
					margin: 0;
				}

				.tour-btn {
					width: fit-content;
				}

				.btn-primary:before {
					display: none;
				}

				@include media-breakpoint-down(md) {
					order: 2;
				}
			}

			.right-div {
				max-width: 656px;
				border-radius: 0.5rem;
				border: 1px solid #bfbfbf;
				position: relative;

				img {
					width: 100%;
					height: auto;
					object-fit: cover;
					border-radius: 0.5rem;
				}

				.arrow-overlay {
					position: absolute;
					top: 60%;
					right: -18%;
					transform: translateY(-50%, -50%);
					width: 40%;
					height: 40%;
					z-index: 2;
					pointer-events: none;
				}

				@include media-breakpoint-down(md) {
					order: 1;
				}
			}
		}
	}
</style>
