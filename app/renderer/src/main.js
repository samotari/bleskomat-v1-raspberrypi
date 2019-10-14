import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';

import Loading from './components/Loading';

Vue.config.productionTip = false;

const loadingConstructor = Vue.extend(Loading);
const loadingInstance = new loadingConstructor();
loadingInstance.vm = loadingInstance.$mount();
document.body.appendChild(loadingInstance.$el);
Vue.prototype.$loading = loadingInstance;

new Vue({
	store,
	router,
	render: h => h(App),
}).$mount('#app');
