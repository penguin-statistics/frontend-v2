import ObjectManager from '@/utils/objectManager'

class MatrixObjectManager extends ObjectManager {
  /** Creates a matrix object manager */
  constructor({ name, api, validator, ttl, ajaxHooks }) {
    super({
      name,
      api,
      transform: [
        (object) => {
          if ("matrix" in object) return object["matrix"]
          if ("pattern_matrix" in object) return object["pattern_matrix"]
          return object
        },
      ],
      validator,
      ttl,
      ajaxHooks
    });
  }
}

export default MatrixObjectManager