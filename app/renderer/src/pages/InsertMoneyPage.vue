<template>
	<div class="wrapper">
		<header>
			<h1>Enter cash</h1>
			<p>Press button when finished</p>
		</header>
		<main>
			<section class="invoice-detail">
				<p>Destination: {{ destination }}</p>
			</section>
			<section class="inserted-money">
				<article>
					<ul>
						<li>{{ eur }} EUR</li>
						<li>{{ czk }} CZK</li>
						<li>{{ totalBtc }} BTC</li>
					</ul>
				</article>
				<article class="actions">
					<Button label="Done" @on-click="done()" />
				</article>
			</section>
		</main>
	</div>
</template>

<script>
import Button from '../components/Button';

export default {
	name: 'InsertMoneyPage',
	components: { Button },
	data() {
		return {
			eur: 0,
			czk: 0,
			totalBtc: 0,
			destination: null,
		};
	},
	mounted() {
		const { decodedPayReq } = this.$route.params;
		this.destination = decodedPayReq.destination;
		const ipcRenderer = window.ipcRenderer;
		ipcRenderer.on('received-bill-note', (event, { czk, eur, totalBtc }) => {
			this.czk = czk;
			this.eur = eur;
			this.totalBtc = totalBtc;
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
header {
	text-align: left;
	font-weight: bold;
}
main {
	display: flex;
	flex-direction: column;
}
ul {
	text-align: left;
	font-weight: bold;
	list-style-type: none;
}
section.invoice-detail {
	font-weight: bold;
	list-style-type: none;
}
section.inserted-money {
	justify-content: space-around;
	display: flex;
}
</style>
