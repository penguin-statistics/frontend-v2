// import Vue from "vue";
// import { VBtn } from "vuetify/lib";
// import haptics from "@/utils/native/haptics";
//
// Vue.component('v-btn-haptic', {
//   functional: true,
//   render: function (createElement, context) {
//     // 完全透传任何 attribute、事件监听器、子节点等。
//     if (context.listeners && context.listeners.click) {
//       const originalListener = context.listeners.click
//
//       context.listeners.click = function () {
//         haptics.light()
//         originalListener(...arguments)
//       }
//     }
//
//     return createElement(VBtn, context.data, context.children)
//   }
// })