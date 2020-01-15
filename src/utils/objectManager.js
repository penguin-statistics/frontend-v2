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
   * @param {number} ttl time-to-live (TTL), in milliseconds
   * @param {Object<Function, Function(Promise)>} ajaxHooks the first function will be called before sending the request, and the second function will be called after done receiving the request, with the request Promise as the argument
   */
  constructor({ name, api, ttl, ajaxHooks }) {
    this.name = name;
    this.api = api;
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
  get cacheValid() {
    let cacheUpdateAt = this.cache.updatedAt || store.getters.cacheUpdateAt(this.name)
    // Console.debug(this.name,
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
      return Promise.resolve(context.cache.data);
    } else {
      // outdated cache, fetch api
      context.ajaxHooks.request(context.name);
      let response = service.get(context.api)
        .then(({ data }) => {
          context.cache.data = data;
          context.cache.updatedAt = Date.now();
          let temp = {};
          temp[context.name] = context.cache.data;
          let cacheUpdateAtTemp = {};
          cacheUpdateAtTemp[context.name] = context.cache.updatedAt;
          Console.debug(`fetched new ${context.name} data at ${context.cache.updatedAt}`)
          store.commit("store", temp);
          store.commit("storeCacheUpdateAt", cacheUpdateAtTemp);
          return context.cache.data
        });
      context.ajaxHooks.response(context.name, response);
      return Promise.resolve(context.cache.data);
    }
  }

  // getters

  /**
   * Find the object that its [key] equals [value]
   * @param {string} key the key to match the value
   * @param {string} value the value
   * @returns {Object} the found object
   */
  async getOne(key, value) {
    let data = await this.get();
    return data.find(v => v[key] === value)
  }

  /**
   * Find the objects that their [key] equals [value]
   * @param {string} key the key to match the value
   * @param {string} value the value
   * @returns {Object[]} the found objects
   */
  async getAll(key, value) {
    let data = await this.get();
    return data.filter(v => v[key] === value)
  }
}


export default ObjectManager
