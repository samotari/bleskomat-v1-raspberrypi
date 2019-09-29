<template>
	<PageTemplate>
		<template v-slot:title>
			<h2>Enter cash</h2>
		</template>
		<div class="wrapper">
			<section class="invoice-detail">
				<p class="light label">
					Destination
				</p>
				<p>{{ destination }}</p>
			</section>
			<section class="inserted-money">
				<article>
					<table>
						<tr>
							<td></td>
							<td>{{ eur }} EUR</td>
						</tr>
						<tr>
							<td></td>
							<td>{{ czk }} CZK</td>
						</tr>
						<tr class="total-bitcoin">
							<td></td>
							<td>{{ satoshis }} sats</td>
						</tr>
					</table>
				</article>
				<article class="actions">
					<p class="light">
						Press button when finished
					</p>
					<Button label="Done" @on-click="done()" />
				</article>
			</section>
		</div>
	</PageTemplate>
</template>

<script>
import Button from '../components/Button';
import PageTemplate from '../components/PageTemplate';

export default {
	name: 'InsertMoneyPage',
	components: { Button, PageTemplate },
	data() {
		return {
			eur: 0,
			czk: 0,
			satoshis: 0,
			destination: null,
		};
	},
	mounted() {
		const { decodedPayReq } = this.$route.params;
		this.destination = decodedPayReq.destination;
		const ipcRenderer = window.ipcRenderer;
		ipcRenderer.on('received-bill-note', (event, { czk, eur, satoshis }) => {
			this.czk = czk;
			this.eur = eur;
			this.satoshis = satoshis;
		});
		ipcRenderer.send('start-receiving-bill-notes');
	},
	methods: {
		done() {
			this.$router.push('/payment-done');
		},
	},
};
</script>

<style scoped>
.wrapper {
	display: flex;
	flex-direction: column;
}
table {
	text-align: left;
	font-weight: bold;
	border-collapse: collapse;
}
table td {
	min-width: 20px;
}
.total-bitcoin td {
	margin-top: 8px;
	padding-top: 4px;
	border-top: 2px solid rgba(44, 62, 80, 0.7);
}
section.invoice-detail {
	text-align: left;
	align-self: center;
	font-weight: bold;
}
section.inserted-money {
	justify-content: space-around;
	display: flex;
}
p {
	margin: 0;
	margin-bottom: 1rem;
}
p.light {
	color: rgba(44, 62, 80, 0.7);
	font-size: 14px;
	margin-bottom: 0.5rem;
}
p.label {
	font-size: 12px;
	text-transform: uppercase;
	margin-bottom: 0.2rem;
}
</style>
