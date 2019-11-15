import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'landing',
			component: require('./pages/LandingPage').default,
		},
		{
			path: '/scan-invoice',
			name: 'scan-invoice',
			component: require('./pages/ScanInvoicePage').default,
		},
		{
			path: '/insert-money/:decodedPayReq',
			name: 'insert-money',
			component: require('./pages/InsertMoneyPage').default,
		},
		{
			path: '/payment-done',
			name: 'payment-done',
			component: require('./pages/PaymentDonePage').default,
		},
		{
			path: '*',
			redirect: '/',
		},
	],
});
