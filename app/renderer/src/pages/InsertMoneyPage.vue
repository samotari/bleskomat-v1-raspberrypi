<template>
	<PageTemplate>
		<template v-slot:title>
			<h2>Enter cash</h2>
		</template>
		<div class="insert-money-page-container">
			<section class="invoice-detail">
				<p class="light label">
					Destination
				</p>
				<p>{{ destination }}</p>
			</section>
			<section class="inserted-money">
				<InsertedMoney
					class="inserted-money-receipt"
					v-bind:eur="eur"
					v-bind:czk="czk"
					v-bind:satoshis="satoshis"
				/>
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
import InsertedMoney from '../components/InsertedMoney';
import PageTemplate from '../components/PageTemplate';

export default {
	name: 'InsertMoneyPage',
	components: { Button, InsertedMoney, PageTemplate },
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
.insert-money-page-container {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}
.inserted-money-receipt {
	width: 30%;
}
section.invoice-detail {
	text-align: left;
	align-self: center;
	font-weight: bold;
	margin-bottom: 40px;
}
section.inserted-money {
	display: flex;
	justify-content: space-around;
	align-items: flex-end;
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
