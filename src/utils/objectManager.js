import service from './service'
import store from '@/store'
import Console from "@/utils/Console";
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
  constructor({ name, api, transform, ttl, ajaxHooks }) {
    this.name = name;
    this.api = api;
    this.transform = transform ? [...transform, o => Object.freeze(o)] : [o => Object.freeze(o)];
    this.ttl = ttl;
    this.ajaxHooks = ajaxHooks;

    this.cache = null;
  }

  // private methods

  /**
   * sequentially transforms the object
   *
   * @private
   * @type {Object} data the object to be transform
   * @returns {Object} the transformed object
   */
  _transform (data) {
    let context = this;
    let current = data; // the current transform result
    for (let func of context.transform) {
      current = func(current) // transform the object by calling the function and get its result
    }
    return current
  }

  /**
   * check the cache validity
   *
   * @returns {boolean} validity of the current cache
   */
  get cacheValid() {
    let cacheUpdateAt = store.getters['cacheUpdateAt/byName'](this.name)
    // Console.debug("[debug]: ",
    //   this.name,
    //   "objectManager cache valid:",
    //   cacheUpdateAt + this.ttl > Date.now(),
    //   "|",
    //   cacheUpdateAt, this.ttl, Date.now());
    return cacheUpdateAt + this.ttl > Date.now()
  }

  /**
   * returns local cache if ttl has been fulfilled, and fetches external api when
   * the ttl of local cache is outdated or the local cache is not available
   * [refresh] equals true can skip tll check
   *
   * @async
   * @param {boolean} refresh equals true can skip tll check
   * @returns {Promise} the promise that contains the data
   */
  async get(refresh = false) {
    let context = this;
    if (!refresh && context.cacheValid) {
      // valid cache
      return Promise.resolve(store.getters['data/byKey'](context.name));
    } else {
      // outdated cache, fetch api
      context.ajaxHooks.request(context.name);
      let response = service.get(context.api)
        .then(({ data }) => {
          Console.debug("[objectManager]", context.name , "before transform", data)
          data = context._transform(data)
          Console.debug("[objectManager]", context.name , "after transform", data)
          context.cache = data

          store.commit("data/store", {key: context.name, value: data});

          const now = Date.now();

          let cacheUpdateAtTemp = {};
          cacheUpdateAtTemp[context.name] = now;
          store.commit("cacheUpdateAt/store", cacheUpdateAtTemp);

          Console.debug(`fetched new ${context.name} data at ${now}`)

          return context.cache
        });
      context.ajaxHooks.response(context.name, response);
      return response;
    }
  }

  // getters

  /**
   * Find the object that its [key] equals [value]
   * @param {Function} filter the filter function
   * @returns {Object} the found object
   */
  // async find(filter) {
  //   await this.get();
  //   return Promise.resolve(this.cache.find(filter))
  // }

  /**
   * Find the objects that their [key] equals [value]
   * @param {Function} filter the filter function
   * @returns {Object[]} the found objects
   */
  // async filter(filter) {
  //   await this.get();
  //   return Promise.resolve(this.cache.filter(filter))
  // }
}


export default ObjectManager
