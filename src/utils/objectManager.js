/*
 * Object Life-cycle manager
 * Automatically fetch data when passed object's TTL and provide getter api
 */

import service from './service'

class ObjectManager {
    constructor({id, transform, ttl, ajaxHooks}) {
        this.id = id; // object id, will be used to determine the api path
        this.apiPath = `/${id}`; // the api path to GET

        this.transform = transform; // function | function: data => {return transformedData}
        this.ttl = ttl; // time-to-live (TTL), in milliseconds
        this.ajaxHooks = ajaxHooks; // { request (): fired when request begins, response (Promise): fired when received response }

        this.cache = {
            createdAt: Date.now(),
            updatedAt: 0,
            data: null
        }
    }

    _isCacheValid () {
        console.debug("cache valid:", this.cache.updatedAt + this.ttl > Date.now(), "|", this.cache.updatedAt, this.ttl, Date.now());
        return this.cache.updatedAt + this.ttl > Date.now()
    }

    // _get returns local cache if ttl has been fulfilled, and fetches external api when
    // the ttl of local cache has outdated or the local cache is empty / not available
    async _get () {
        let context = this;
        if (context._isCacheValid()) {
            // valid cache
            console.log("valid");
            return Promise.resolve(context.cache.data)
        } else {
            // outdated cache, fetch api
            console.log("outdated");
            context.ajaxHooks.request();
            let response = service.get(context.apiPath)
              .then(({data}) => {
                  context.cache.data = context.transform(data);
                  context.cache.updatedAt = Date.now();
                  return context.cache.data
              });
            context.ajaxHooks.response(response);
            return response
        }
    }

    // getters of the object

    // getOne returns a object matches the condition
    async getOne (key, value) {
        let data = await this._get();
        console.log(data);
        return await data.find(v => v[key] === value)
    }

    // getAll returns an array that contains all the items which is matching the condition
    async getAll (key, value) {
        let data = await this._get();
        return await data.filter(v => v[key] === value)
    }
}

export default ObjectManager