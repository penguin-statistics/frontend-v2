import store from '@/store'

export default {
  defaultAjaxHooks: {
    request: (id) => {
      store.dispatch("ajax/started", {id})
    },
    response: (id, promise) => {
      promise.then(
        () => {
          store.dispatch("ajax/finished", {id, error: null});
        },
        ({errorMessage}) => {
          store.dispatch("ajax/finished", {id, error: errorMessage});
        }
      )
    }
  }
}