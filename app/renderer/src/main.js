import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

new Vue({
	router,
	render: h => h(App),
}).$mount('#app');

var ipcRenderer = window.ipcRenderer;

ipcRenderer.on('exchange-rate', function(event, result) {
	console.log('exchange-rate', result); // eslint-disable-line no-console
});

ipcRenderer.send('get-exchange-rate', {
	currencies: { from: 'BTC', to: 'EUR' },
	provider: 'coinbase',
});
