<template>
	<PageTemplate @on-click="goToLanding()">
		<template v-slot:title>
			<h2>Success!</h2>
		</template>
		<div class="payment-done-page-container">
			<img src="../assets/checkbox.svg" />
		</div>
	</PageTemplate>
</template>

<script>
import PageTemplate from '../components/PageTemplate';
import config from '../config';

export default {
	name: 'PaymentDonePage',
	components: { PageTemplate },
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
img {
	height: 40%;
}
.payment-done-page-container {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
