import Vue from 'vue'
import i18n from "@/i18n";

Vue.component('DoYouKnow', {
  functional: true,
  // props: {
  //   type: {
  //     type: String,
  //     required: true
  //   },
  //   options: {
  //     type: Object,
  //     required: true
  //   }
  // },
  render: function (createElement) {
    const quotes = i18n.t('quotes.doYouKnow');
    const index = Math.floor(Math.random() * quotes.length);

    return createElement(
      'span',
      quotes[index]
    )
  }
})