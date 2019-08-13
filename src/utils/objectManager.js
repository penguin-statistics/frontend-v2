/* Object Life-cycle manager
 *
 * Automatically fetch data when passed object's TTL and provide getter api
 */

import service from './service'
import store from '@/store'

class ObjectManager {
    constructor({id, transforms, ttl, retry, ajaxHooks}) {
        this.id = id; // object id, will be used to determine the api path
        this.apiPath = `/api/${id}`; // the api path to GET

        this.transforms = transforms; // [{ key: function }] | key: object path to transform; function: (value) => {return transformedData}
        this.ttl = ttl; // time-to-live (TTL), in milliseconds
        this.retry = retry; // { retries: the total amount of retries, factor: multiplier between retries }
        this.ajaxHooks = ajaxHooks; // { request (): fired when request begins, response (Promise): fired when received response }

        this.cache = {
            createdAt: Date.now(),
            updatedAt: 0,
            data: null
        }
    }

    _isOutdated () {
        return this.cache.updatedAt + this.ttl < Date.now()
    }

    // _transform transforms argument `data` and return the transformed dataset
    _transform (data) {
        let context = this;
        // for each data object in the data array we've got
        data.forEach(obj => {
            // for each [key, value] pairs in the data object
            for (let key in obj) {
                if (!(key in context.transforms)) continue; // if there's no transform function for this field then skip it
                if (!obj.hasOwnProperty(key)) continue; // check for ownProperty
                obj[key] = context.transforms[key](obj[key]) // otherwise apply the corresponding function to the value
            }
        });
        return data
    }

    // _get returns local cache if ttl has been fulfilled, and fetches external api when
    // the ttl of local cache has outdated or the local cache is empty / not available
    async _get () {
        let context = this;
        if (context._isOutdated()) {
            // valid cache
            return Promise.resolve(context.cache.data)
        } else {
            // outdated cache, fetch api
            // TODO: add retry
            context.ajaxHooks.request();
            let response = service.get(context.apiPath)
              .then(({data}) => {
                  context.cache.data = context._transform(data);
                  context.cache.updatedAt = Date.now();
                  return context.cache.data
              })
              .catch(({err}) => {
                  store.dispatch('ajaxFailed', err.errorMessage)
              });
            context.ajaxHooks.response(response);
            return response
        }
    }

    // getters of the object

    // getOne returns a object matches the condition
    async getOne (key, value) {
        let data = await this._get();
        return data.find(v => v[key] === value)
    }

    // getAll returns an array that contains all the items which is matching the condition
    async getAll (key, value) {
        let data = await this._get();
        return data.filter(v => v[key] === value)
    }
}

export default ObjectManager