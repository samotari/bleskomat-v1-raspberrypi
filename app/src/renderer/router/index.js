import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default,
    },
    {
      path: '/scan-invoice',
      name: 'scan-invoce-page',
      component: require('@/components/ScanInvoicePage').default,
    },
    {
      path: '/insert-money',
      name: 'insert-money-page',
      component: require('@/components/InsertMoneyPage').default,
    },
    {
      path: '/payment-done',
      name: 'payment-done-page',
      component: require('@/components/PaymentDonePage').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
