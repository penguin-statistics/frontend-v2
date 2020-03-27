import config from "@/config"

const PREFIX = "migration_";

export default {
  state: {
    set(name, value) {
      const data = {
        ver: config.version,
        ts: Date.now(),
        v: value.toString()
      };
      localStorage.setItem(`${PREFIX}${name}`, JSON.stringify(data));
    },
    get (name) {
      const got = localStorage.getItem(`${PREFIX}${name}`);
      if (got) {
        try {
          return JSON.parse(got)
        } catch {
          return {}
        }
      }
      return {};
    }
  },
  start () {
    async function deleteCaches() {
      try {
        const keys = await window.caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
      } catch (err) {
        console.log('deleteCache err: ', err);
      }
    }
    if (this.state.get("fixswcache").v !== true) {
      deleteCaches()
        .then(() => {
          this.state.set("fixswcache", true)
        })
    }
  }
}