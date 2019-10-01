<style>
.inserted-money-container {
	padding: 20px;
	background: rgba(255, 255, 255, 0.5);
	border-radius: 5px;
	border: 1px solid rgba(0, 0, 0, 0.1);
	font-weight: bold;
	display: grid;
	grid-template-rows: 20px 20px 40px;
	grid-template-columns: auto 1fr;
	grid-row-gap: 5px;
	grid-column-gap: 40px;
	justify-content: center;
	align-items: center;
}

.inserted-fiat,
.total-satoshis,
.divider {
	grid-column: 2 / 2;
}

.inserted-fiat,
.total-satoshis {
	justify-self: flex-end;
	padding: 0 20px;
}

.divider {
	border: 1px solid black;
}

.total-satoshis,
.total {
	grid-row: 4 / 4;
	font-size: 17px;
	white-space: nowrap;
}

.total {
	grid-column: 1 / 1;
}
</style>

<template>
	<div class="inserted-money-container">
		<div class="inserted-fiat">{{ eur }} EUR</div>
		<div class="inserted-fiat">{{ czk }} CZK</div>
		<div class="divider"></div>
		<div class="total">
			Total:
		</div>
		<div class="total-satoshis">{{ satoshis }} sats</div>
	</div>
</template>

<script>
export default {
	name: 'InsertedMoney',
	props: {
		eur: {
			type: Number,
			default: 0,
		},
		czk: {
			type: Number,
			default: 0,
		},
		satoshis: {
			type: Number,
			default: 0,
		},
	},
};
</script>
