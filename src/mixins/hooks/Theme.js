import Theme from "../Theme";

export default {
  watch: {
    'dark': ['onDarkChange']
  },
  mixins: [Theme],
  created () {
    this.onDarkChange(this.dark);
  },
  methods: {
    onDarkChange (newValue) {
      if (typeof this.dark === "boolean") {
        this.$vuetify.theme.dark = this.dark
      }

      if (newValue) {
        document.body.style.backgroundColor = "#121212"
      } else {
        document.body.style.backgroundColor = "#ffffff"
      }
    }
  },
}