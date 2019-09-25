import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'landing-page',
			component: require('./pages/LandingPage').default,
		},
		{
			path: '/scan-invoice',
			name: 'scan-invoce-page',
			component: require('./pages/ScanInvoicePage').default,
		},
		{
			path: '/insert-money/:decodedPayReq',
			name: 'insert-money-page',
			component: require('./pages/InsertMoneyPage').default,
		},
		{
			path: '/payment-done',
			name: 'payment-done-page',
			component: require('./pages/PaymentDonePage').default,
		},
		{
			path: '*',
			redirect: '/',
		},
	],
});
