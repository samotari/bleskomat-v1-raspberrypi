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
					:eur="eur"
					:czk="czk"
					:satoshis="satoshis"
				/>
				<div class="actions">
					<Button label="Done" @on-click="done()" />
					<Button type="info" label="Cancel" @on-click="cancel()" />
				</div>
			</section>
		</div>
	</PageTemplate>
</template>

<script>
import _ from 'underscore';
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
	destroyed() {
		const ipcRenderer = window.ipcRenderer;
		ipcRenderer.removeAllListeners('send-payment');
	},
	methods: {
		cancel() {
			if (
				this.satoshis === 0 ||
				confirm('Are you sure that you want to cancel?')
			) {
				this.$router.push('/landing-page');
			}
		},
		done() {
			if (this.satoshis === 0) {
				return alert('Must enter at least one bank note.');
			}
			const ipcRenderer = window.ipcRenderer;
			ipcRenderer.on('send-payment', (event, result) => {
				if (result && result.error) {
					let error;
					if (_.isString(result.error)) {
						error = result.error;
					} else if (_.isObject(result.error)) {
						if (_.isString(result.error.details)) {
							error = result.error.details;
						} else {
							error = JSON.stringify(result.error);
						}
					}
					return alert(error);
				}
				this.$router.push('/payment-done');
			});
			ipcRenderer.send('send-payment');
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
	box-sizing: border-box;
	width: 60%;
	float: left;
}
section.invoice-detail {
	text-align: left;
	align-self: center;
	font-weight: bold;
	margin-bottom: 40px;
}
section.inserted-money {
	width: 100%;
	display: inline-block;
	box-sizing: border-box;
	padding: 0 10%;
}
.actions {
	width: 40%;
	float: left;
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
