import config from '@/config'
import store from '@/store'
import timeFormatter from '@/utils/timeFormatter'
import Console from '@/utils/Console'

function randomInt (max) {
  return Math.floor(Math.random() * (Math.floor(max) + 1))
}

function randomFromArray (arr) {
  return arr[randomInt(arr.length - 1)]
}

export default {
  cachedRandom: {
    limit: config.randomBackground.limit,
    _getNewId () {
      return randomInt(config.randomBackground.max)
    },
    get () {
      const already = store.getters['options/randomBackground']

      // if not current day
      if (!timeFormatter.dayjs(already.last).isSame(timeFormatter.dayjs(), 'day')) {
        Console.debug('CachedRandom', 'time reached. clearing cachedRandom cache')
        store.commit('options/clearRandomBackground')
      }
      if (already.id.length < this.limit) {
        const id = this._getNewId()
        Console.debug('CachedRandom', 'limit NOT reached. new random', id, already.id)
        store.commit('options/changeRandomBackground', {
          last: already.last,
          id: [...already.id, id]
        })
        return id
      } else {
        const got = randomFromArray(already.id)
        // Console.debug("CachedRandom", "limit DO reached. got", got)
        return got
      }
    }
  },
  randomInt,
  randomFromArray
}
