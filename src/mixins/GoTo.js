import store from "@/store";

export default {
  methods: {
    goTo: function(url) {
      store.commit("ui/setOutSiteDialog", url);
      this.$ga.event("redirect", "links", url, 1);
    },
  },
};
