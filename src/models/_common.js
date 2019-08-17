import store from '@/store'

export default {
  defaultAjaxHooks: {
    request: () => {
      store.commit("ajaxFired")
    },
    response: (promise) => {
      promise.then(
        () => {
          store.commit("ajaxSucceeded")
        },
        ({errorMessage}) => {
          store.commit("ajaxFailed", errorMessage)
        }
      )
    }
  }
}