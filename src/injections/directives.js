import Vue from 'vue';
import strings from "@/utils/strings";

Vue.directive("marked", {
  inserted: function (el) {
    el.innerHTML = strings.markdown(el.innerHTML)
  }
})