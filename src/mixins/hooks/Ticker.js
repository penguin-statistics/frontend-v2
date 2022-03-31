export default {
  data() {
    return {
      ticker: null,
    };
  },
  created() {
    this.ticker = setInterval(() => {
      this.tickerUpdate();
    }, 1500);
  },
  methods: {
    tickerUpdate() {
      // const start = new Date(2021, 3, 1, 0, 0, 0)
      const end = new Date(2022, 3, 2, 0, 0, 0);
      if (Date.now() > end.getTime() && this.$store.getters["ui/aprilFools"]) {
        this.$store.commit("ui/setAprilFools", false);
      }
    },
  },
};
