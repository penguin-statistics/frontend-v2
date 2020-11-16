import Vue from 'vue'
import SearchResultStages from "@/components/search/SearchResultStages";
import SearchResultItems from "@/components/search/SearchResultItems";

Vue.component('SearchResult', {
  functional: true,
  props: {
    result: {
      type: Object,
      required: true
    }
  },
  render: function (createElement, ctx) {
    let component;
    switch (ctx.props.result.type) {
      case "stages":
        component = SearchResultStages
        break
      case "items":
        component = SearchResultItems
        break
      default:
        throw new Error("unknown search result type " + ctx.props.result.type)
    }

    return createElement(
      component,
      {
        props: ctx.props
      }
    )
  }
})