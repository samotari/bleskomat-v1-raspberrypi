import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import { FETCH_RATES } from './mutation-types';

const store = new Vuex.Store({
	state: {
		rates: null,
	},
	mutations: {
		[FETCH_RATES](state, rates) {
			state.rates = rates;
		},
	},
	actions: {
		fetchRates({ commit }) {
			const ipcRenderer = window.ipcRenderer;
			ipcRenderer.on('exchange-rates', (event, rates) => {
				commit(FETCH_RATES, rates);
			});
			ipcRenderer.send('get-exchange-rates');
		},
	},
	strict: 'true',
});

export default store;
