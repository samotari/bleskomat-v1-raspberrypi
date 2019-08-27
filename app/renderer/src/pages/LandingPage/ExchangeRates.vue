<template>
	<div>
		<main>
			<template v-if="rates">
				<ul>
					<li v-for="rate in rates" :key="rate.symbol">
						1 BTC = {{ rate.value }} {{ rate.symbol }}
					</li>
				</ul>
			</template>

			<template v-else>
				<!-- exchange rates data is loading... -->
			</template>
		</main>
	</div>
</template>

<script>
export default {
	name: 'ExchangeRates',
	data() {
		return {
			rates: null,
		};
	},
	mounted() {
		const ipcRenderer = window.ipcRenderer;
		ipcRenderer.on('exchange-rates', (event, rates) => {
			this.rates = rates;
		});
		ipcRenderer.send('get-exchange-rates');
	},
};
</script>

<style scoped>
ul {
	text-align: left;
	font-weight: bold;
	list-style-type: none;
}
</style>
