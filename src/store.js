import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ajaxLoading: false,
    data: {}
  },
  mutations: {
    store: (state, d) => {
      state.data = {...d}
    },
    changeAjaxState (state, newState) {
      state.ajaxLoading = newState
    }
  },
  actions: {
    ajax_began ({commit}) {
      commit('changeAjaxState', true)
    },
    ajax_finished ({commit}) {
      commit('changeAjaxState', false)
    }
  }
})
