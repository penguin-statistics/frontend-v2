import ObjectManager from '@/utils/objectManager'

class MatrixObjectManager extends ObjectManager {
  /** Creates a matrix object manager */
  constructor({ name, api, ttl, ajaxHooks }) {
    super({
      name,
      api,
      ttl,
      ajaxHooks
    });
  }
}

export default MatrixObjectManager