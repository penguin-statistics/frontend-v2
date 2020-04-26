import Vue from 'vue'
import QuerySelectorItem from "@/components/advancedQuery/selectors/QuerySelectorItem";
import QuerySelectorStage from "@/components/advancedQuery/selectors/QuerySelectorStage";
import QuerySelectorTimeRange from "@/components/advancedQuery/selectors/QuerySelectorTimeRange";
import QuerySelectorServer from "@/components/advancedQuery/selectors/QuerySelectorServer";

Vue.component('QuerySelect', {
  functional: true,
  props: {
    type: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },
  render (createElement, context) {
    let component;
    const type = context.props.type
    if (type === "item") {
      component = QuerySelectorItem
    } else if (type === "stage") {
      component = QuerySelectorStage
    } else if (type === "timeRange") {
      component = QuerySelectorTimeRange
    } else if (type === "server") {
      component = QuerySelectorServer
    } else {
      throw new Error(`unknown component reflector type named ${type}`)
    }
    return createElement(
      component,
      {
        props: context.props,

      },
      context.children
    )
  }
})