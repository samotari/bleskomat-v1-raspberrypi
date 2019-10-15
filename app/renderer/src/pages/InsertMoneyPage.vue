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
					:amount-will-receive="amountWillReceive"
					:fee-to-be-paid="feeToBePaid"
					:fee-percent="feePercent"
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
import Button from '../components/Button';
import InsertedMoney from '../components/InsertedMoney';
import PageTemplate from '../components/PageTemplate';

export default {
	name: 'InsertMoneyPage',
	components: { Button, InsertedMoney, PageTemplate },
	data() {
		return {
			eur: '0',
			czk: '0',
			amountWillReceive: '0',
			feeToBePaid: '0',
			feePercent: '0',
			destination: null,
		};
	},
	mounted() {
		const { decodedPayReq } = this.$route.params;
		this.destination = decodedPayReq.destination;
		const ipcRenderer = window.ipcRenderer;
		ipcRenderer.on(
			'received-bill-note',
			(event, { czk, eur, amountWillReceive, feeToBePaid, feePercent }) => {
				this.czk = czk;
				this.eur = eur;
				this.amountWillReceive = amountWillReceive;
				this.feeToBePaid = feeToBePaid;
				this.feePercent = feePercent;
			},
		);
		ipcRenderer.on('send-payment', (event, result) => {
			this.$loading.hide();
			if (result && result.error) {
				return alert(result.error);
			}
			this.$router.push('/payment-done');
		});
		ipcRenderer.send('start-receiving-bill-notes');
	},
	destroyed() {
		const ipcRenderer = window.ipcRenderer;
		ipcRenderer.removeAllListeners('send-payment');
	},
	methods: {
		hasEnteredNotes: function() {
			return this.amountWillReceive !== '0';
		},
		cancel() {
			if (confirm('Are you sure that you want to cancel?')) {
				this.$router.push('/');
			}
		},
		done() {
			if (!this.hasEnteredNotes()) {
				return alert('Must enter at least one bank note.');
			}
			const ipcRenderer = window.ipcRenderer;
			this.$loading.show();
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
.invoice-detail p {
	margin: 0;
	margin-bottom: 1rem;
}
.invoice-detail p.light {
	color: rgba(44, 62, 80, 0.7);
	font-size: 14px;
	margin-bottom: 0.5rem;
}
.invoice-detail p.label {
	font-size: 12px;
	text-transform: uppercase;
	margin-bottom: 0.2rem;
}
</style>
