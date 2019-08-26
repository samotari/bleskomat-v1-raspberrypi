import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

new Vue({
	router,
	render: h => h(App),
}).$mount('#app');

var ipcRenderer = window.ipcRenderer;

ipcRenderer.on('another-event', (event, arg) => {
	// prints "pong":
	console.log(arg); // eslint-disable-line no-console
});

ipcRenderer.send('custom-event-name', 'ping');
