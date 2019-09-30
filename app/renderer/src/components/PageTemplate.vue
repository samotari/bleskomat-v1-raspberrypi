<style scoped>
header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

header > * {
	flex: 1;
}

main {
	display: flex;
	justify-content: space-around;
	align-items: center;
	flex: 1;
	padding: 10px 0;
}

.wrapper {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.bitcoin-image {
	text-align: left;
}

.bitcoin-image img {
	max-width: 64px;
}
</style>

<template>
	<div class="wrapper" @click="onClick">
		<header>
			<div class="bitcoin-image">
				<img src="../assets/bitcoin-lightning.svg" />
			</div>
			<slot name="title"></slot>
			<ExchangeRates :rates="rates" />
		</header>
		<main>
			<slot></slot>
		</main>
		<footer>Bleskomat, <em>Lightning Network ATM</em></footer>
	</div>
</template>

<script>
import { mapState } from 'vuex';

import ExchangeRates from './ExchangeRates';

export default {
	name: 'PageTemplate',
	components: { ExchangeRates },
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
		onClick() {
			this.$emit('on-click');
		},
	},
};
</script>
