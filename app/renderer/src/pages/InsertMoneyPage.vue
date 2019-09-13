<template>
	<div class="wrapper">
		<header>
			<h1>Enter cash</h1>
			<p>Press button when finished</p>
		</header>
		<main>
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
		};
	},
	mounted() {
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
	justify-content: space-around;
}
ul {
	text-align: left;
	font-weight: bold;
	list-style-type: none;
}
</style>
