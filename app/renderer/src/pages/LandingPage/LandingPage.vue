<style scoped>
header {
	display: flex;
	justify-content: space-between;
}

.wrapper {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
</style>

<template>
	<div class="wrapper">
		<header>
			<img src="../../assets/bitcoin-lightning.svg" :style="styleObject" />
			<ExchangeRates />
		</header>
		<main>
			<div class="actions">
				<Button label="Get Started" @on-click="start()" />
			</div>
		</main>
		<footer>Bleskomat, <em>Lightning Network ATM</em></footer>
	</div>
</template>

<script>
import Button from '../../components/Button';
import ExchangeRates from './ExchangeRates';

export default {
	name: 'LandingPage',
	components: { Button, ExchangeRates },
	data: () => ({
		styleObject: {
			width: '10%',
		},
	}),
	methods: {
		start() {
			this.$router.push('/scan-invoice');
		},
	},
};
</script>
