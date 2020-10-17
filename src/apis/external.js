import {externalService} from '@/utils/service'

export default {
  geoip () {
    return externalService.get("https://api.ip.sb/geoip")
  }
}