import service from './service'

/**
 * Object Life-cycle manager
 * Automatically fetch data when passed object's TTL and provide getter api
 */
class ObjectManager {
  /** Creates a manager
   *
   * @param {string} api endpoint url that will be used to get the data from. the manager will send a GET request to the corresponding url
   * @param {Function[]} transform transform functions that will be called in sequence and will transform the object using the return value of the functions
   * @param {number} ttl time-to-live (TTL), in milliseconds
   * @param {Object<Function, Function(Promise)>} ajaxHooks the first function will be called before sending the request, and the second function will be called after done receiving the request, with the request Promise as the argument
   */
  constructor({api, transform, ttl, ajaxHooks}) {
    this.api = api;

    this.transform = transform;
    this.ttl = ttl;
    this.ajaxHooks = ajaxHooks;

    this.cache = {
      createdAt: Date.now(),
      updatedAt: 0,
      data: null
    };
  }

  // private methods

  /**
   * check the cache validity
   *
   * @returns {boolean} validity of the current cache
   */
  get cacheValid () {
    console.debug("cache valid:", this.cache.updatedAt + this.ttl > Date.now(), "|", this.cache.updatedAt, this.ttl, Date.now());
    return this.cache.updatedAt + this.ttl > Date.now()
  }

  /**
   * sequentially transforms the object
   *
   * @private
   * @type {Object} data the object to be transform
   * @returns {Object} the transformed object
   */
  _transforms (data) {
    let context = this;
    let current = data; // the current transform result
    for (let func of context.transform) {
      current = func(current) // transform the object by calling the function and get its result
    }
    return current
  }

  /**
   * returns local cache if ttl has been fulfilled, and fetches external api when
   * the ttl of local cache is outdated or the local cache is not available
   *
   * @async
   * @returns {Promise} the promise that contains the data
   */
  async get () {
    let context = this;
    if (context.cacheValid) {
      // valid cache
      return Promise.resolve(context.cache.data)
    } else {
      // outdated cache, fetch api
      context.ajaxHooks.request();
      let response = service.get(context.api)
        .then(({data}) => {
          context.cache.data = context._transforms(data);
          context.cache.updatedAt = Date.now();
          return context.cache.data
        });
      context.ajaxHooks.response(response);
      return response
    }
  }

  // getters

  /**
   * Find the object that its [key] equals [value]
   * @param {string} key the key to match the value
   * @param {string} value the value
   * @returns {Object} the found object
   */
  async getOne (key, value) {
    let data = await this.get();
    return data.find(v => v[key] === value)
  }

  /**
   * Find the objects that their [key] equals [value]
   * @param {string} key the key to match the value
   * @param {string} value the value
   * @returns {Object[]} the found objects
   */
  async getAll (key, value) {
    let data = await this.get();
    return data.filter(v => v[key] === value)
  }
}


export default ObjectManager