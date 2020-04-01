import config from "@/config";

export default {
  watch: {
    '$route': [
      'logRouteEvent',
    ]
  },
  created () {
    // report current version
    this.$ga.event(
      'runtime',
      'version',
      config.version
    );
  },
  methods: {
    logRouteEvent (newValue) {
      if (newValue.name === "StatsByStage_Selected") {
        // Console.log(this.$store.state.dataSource, newValue.params.stageId);
        this.$ga.event('result', 'fetch_' + this.$store.getters['dataSource/source'], newValue.params.stageId, 1)
      } else if (newValue.name === "StatsByItem_Selected") {
        this.$ga.event('result', 'fetch_' + this.$store.getters['dataSource/source'], newValue.params.itemId, 1)
      }
    },
  },
}