import config from "@/config";
import Console from "@/utils/Console";

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
        Console.info("Analytics", "fetched stage", this.$store.getters['dataSource/source'], newValue.params.stageId);
        this.$ga.event('result', 'fetch_' + this.$store.getters['dataSource/source'], newValue.params.stageId, 1)
      } else if (newValue.name === "StatsByItem_SelectedItem") {
        Console.info("Analytics", "fetched item", this.$store.getters['dataSource/source'], newValue.params.itemId);
        this.$ga.event('result', 'fetch_' + this.$store.getters['dataSource/source'], newValue.params.itemId, 1)
      }
    },
  },
}