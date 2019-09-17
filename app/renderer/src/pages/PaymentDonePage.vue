<template>
	<div class="wrapper" @click="goToLanding()">
		<main>
			<img src="../assets/checkbox.svg" />
			<h2>Success!</h2>
		</main>
	</div>
</template>

<script>
import config from '../config';

export default {
	name: 'PaymentDonePage',
	data() {
		return {
			toToLandingTimeOut: null,
			pageConfig: config.pages.paymentDone,
		};
	},
	mounted() {
		this.toToLandingTimeOut = setTimeout(
			() => this.goToLanding(),
			this.pageConfig.idleTime,
		);
	},
	destroyed() {
		if (this.toToLandingTimeOut) {
			clearTimeout(this.toToLandingTimeOut);
		}
	},
	methods: {
		goToLanding() {
			this.$router.push('/');
		},
	},
};
</script>

<style scoped>
main img {
	width: 40%;
	margin-top: 5rem;
}
</style>
