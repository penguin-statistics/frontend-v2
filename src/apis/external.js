import service from '@/utils/service'

export default {
  geoip () {
    return service.get("https://api.ip.sb/geoip", {
      withCredentials: false
    })
  }
}