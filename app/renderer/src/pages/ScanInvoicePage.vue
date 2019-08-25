<template>
	<div class="wrapper">
		<main>
			<div class="information">
				<span class="title">
					Scan your invoice!
				</span>
			</div>

			<div class="actions">
				<button class="cancel" @click="cancel()">
					Cancel
				</button>
			</div>
		</main>
	</div>
</template>

<script>
export default {
	name: 'ScanInvocePage',
	methods: {
		cancel() {
			this.$router.push('/landing-page');
		},
	},
};
</script>
