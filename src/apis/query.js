import {service} from "@/utils/service";

export default {
  advancedQuery (queries) {
    return service.post("/result/advanced", queries)
  }
}