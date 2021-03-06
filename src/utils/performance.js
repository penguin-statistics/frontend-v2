export default {
  timer: {
    now () {
      if (window.performance) return window.performance.now()
      return Date.now()
    },
    /**
     * Use the timer as a context that wraps the promise which may perform
     * long lasting tasks.
     * @param promise the promise which may perform long lasting tasks
     * @returns {Promise<Number>} returns a promise with time elapsed in milliseconds, truncated to whole number
     */
    ctx (promise) {
      const start = this.now()
      return new Promise((resolve) => {
        promise
          .finally(() => {
            return resolve(Math.round(this.now() - start))
          })
      })
    }
  }
}
