import ObjectManager from '@/utils/objectManager'

class MatrixObjectManager extends ObjectManager {
  /** Creates a matrix object manager */
  constructor({ name, api, ttl, ajaxHooks }) {
    super({
      name,
      api,
      transform: [
        (object) => {
          if ("matrix" in object) return object["matrix"]
          return object
        },
      ],
      ttl,
      ajaxHooks
    });
  }
}

export default MatrixObjectManager