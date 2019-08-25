import store from '@/store'

export default {
  defaultAjaxHooks: {
    request: (id) => {
      store.dispatch("ajaxStarted", {id})
    },
    response: (id, promise) => {
      promise.then(
        () => {
          store.dispatch("ajaxFinished", {id, error: null});
        },
        ({errorMessage}) => {
          store.dispatch("ajaxFinished", {id, error: errorMessage});
        }
      )
    }
  }
}