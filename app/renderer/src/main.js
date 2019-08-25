import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

new Vue({
	router,
	render: h => h(App),
}).$mount('#app');

ipcRenderer.on('another-event', (event, arg) => {
	console.log(arg); // prints "pong"
});

ipcRenderer.send('custom-event-name', 'ping');
