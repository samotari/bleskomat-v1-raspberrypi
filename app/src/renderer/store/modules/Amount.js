const state = {
  amount: 0,
};

const mutations = {
  INCREMENT_AMOUNT(state, amount) {
    state.amount += amount;
  },
};

const actions = {
  someAsyncTask({ commit }, amount) {
    // do something async
    commit('INCREMENT_AMOUNT', amount);
  },
};

export default {
  state,
  mutations,
  actions,
};
