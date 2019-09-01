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
			<ExchangeRates :rates="rates" />
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
import { mapState } from 'vuex';

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
	computed: {
		...mapState({
			rates: state => state.rates,
		}),
	},
	mounted() {
		this.$store.dispatch('fetchRates');
	},
	methods: {
		start() {
			this.$router.push('/scan-invoice');
		},
	},
};
</script>
