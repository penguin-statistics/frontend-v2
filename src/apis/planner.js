import service from '@/utils/service'

export default {
  plan (data) {
    return service.post("https://planner.penguin-stats.io/plan", data, {
      withCredentials: false
    })
  }
}