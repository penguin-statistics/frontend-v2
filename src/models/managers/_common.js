import store from '@/store'
import validator from "@/utils/validator";

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
  },
  defaultValidator (data) {
    return validator.all(
      validator.isArray(data),
      validator.notEmptyArray(data)
    )
  },
}