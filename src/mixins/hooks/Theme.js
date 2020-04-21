import Theme from "../Theme";
import {mapGetters} from "vuex";

export default {
  watch: {
    'dark': ['onDarkChange']
  },
  computed: {
    ...mapGetters('settings', ['dark']),
  },
  mixins: [Theme],
  created () {
    this.onDarkChange(this.dark);
  }
}