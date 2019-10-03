<style>
.inserted-money-container {
	background: rgba(255, 255, 255, 0.5);
	border: 1px solid rgba(0, 0, 0, 0.1);
	border-radius: 5px;
	box-sizing: border-box;
	padding: 10px;
}
.divider {
	width: 100%;
	height: 2px;
	background: black;
	margin: 10px 0;
}
.row {
	display: inline-block;
	width: 100%;
	vertical-align: top;
}
.row .label,
.row .info {
	float: left;
	font-size: 17px;
	line-height: 28px;
	box-sizing: border-box;
}
.row .label {
	width: 60%;
	font-weight: bold;
	text-align: right;
	padding-right: 10px;
}
.row .info {
	width: 40%;
	white-space: nowrap;
	text-align: left;
	padding-left: 10px;
}
.row .info-unit:not(:empty) {
	margin-left: 5px;
}
</style>

<template>
	<div class="inserted-money-container">
		<div class="row">
			<div class="label">&nbsp;</div>
			<div class="info">
				<span class="info-value">{{ eur }}</span>
				<span class="info-unit">EUR</span>
			</div>
		</div>
		<div class="row">
			<div class="label">&nbsp;</div>
			<div class="info">
				<span class="info-value">{{ czk }}</span>
				<span class="info-unit">CZK</span>
			</div>
		</div>
		<div class="divider"></div>
		<div class="row">
			<div class="label">You will receive:</div>
			<div class="info">
				<span class="info-value">{{ amountWillReceive }}</span>
				<span class="info-unit">sats</span>
			</div>
		</div>
		<div class="row">
			<div class="label">Fees ({{ feePercent }}%):</div>
			<div class="info">
				<span class="info-value">{{ feeToBePaid }}</span>
				<span class="info-unit">sats</span>
			</div>
		</div>
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
		amountWillReceive: {
			type: Number,
			default: 0,
		},
		feeToBePaid: {
			type: Number,
			default: 0,
		},
		feePercent: {
			type: Number,
			default: 0,
		},
	},
};
</script>
