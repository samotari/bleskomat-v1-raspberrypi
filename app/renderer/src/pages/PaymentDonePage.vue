<template>
	<PageTemplate @on-click="goToLandingWithMinWait()">
		<template v-slot:title>
			<h2>Success!</h2>
		</template>
		<div class="payment-done-page-container">
			<img src="../assets/checkbox.svg" />
			<p class="instruction" :class="{ visible: showResetInstructionFlag }">
				Tap the screen to make a new transaction
			</p>
		</div>
	</PageTemplate>
</template>

<style scoped>
.payment-done-page-container {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}
img {
	display: block;
	height: 50%;
	margin-bottom: 20px;
}
.instruction {
	display: block;
	visibility: hidden;
	font-size: 16px;
	font-weight: 100;
	font-style: italic;
}
.instruction.visible {
	visibility: visible;
}
</style>

<script>
import PageTemplate from '../components/PageTemplate';
import config from '../config';

export default {
	name: 'PaymentDonePage',
	components: { PageTemplate },
	data() {
		return {
			showResetInstructionFlag: false,
			goToLandingTimeOut: null,
			pageConfig: config.pages.paymentDone,
		};
	},
	mounted() {
		this.mountedTime = Date.now();
		this.goToLandingTimeOut = setTimeout(
			this.goToLanding,
			this.pageConfig.idleTime,
		);
		this.showResetInstructionTimeOut = setTimeout(
			this.showResetInstruction,
			this.pageConfig.minTimeElapsedBeforeCanReset,
		);
	},
	destroyed() {
		if (this.goToLandingTimeOut) {
			clearTimeout(this.goToLandingTimeOut);
		}
		if (this.showResetInstructionTimeOut) {
			clearTimeout(this.showResetInstructionTimeOut);
		}
	},
	methods: {
		showResetInstruction() {
			this.showResetInstructionFlag = true;
		},
		goToLandingWithMinWait() {
			const elapsedTime = Date.now() - this.mountedTime;
			if (elapsedTime >= this.pageConfig.minTimeElapsedBeforeCanReset) {
				this.goToLanding();
			}
		},
		goToLanding() {
			this.$router.push('/');
		},
	},
};
</script>
