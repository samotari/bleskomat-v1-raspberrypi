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
	props: {
		rates: {
			type: Array,
			default: null,
		},
	},
};
</script>

<style scoped>
main {
	display: flex;
	justify-content: flex-end;
}

ul {
	text-align: left;
	font-weight: bold;
	list-style-type: none;
	font-size: 14px;
}
</style>
