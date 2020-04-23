import service from '@/utils/service'

export default {
  geoip () {
    return service.get("https://ipapi.co/json/", {
      withCredentials: false
    })
  }
}