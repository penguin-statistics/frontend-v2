import dayjs from "dayjs";
import Console from "@/utils/Console";

export default {
  methods: {
    changeLocale(localeId, save = true) {
      dayjs.locale(localeId);
      if (localeId !== this.$i18n.locale) {
        Console.info("i18n", "locale changed to:", localeId, "| saving to vuex:", save);
        this.$i18n.locale = localeId;
        this.$vuetify.lang.current = localeId;
        document.title = `${this.$t(this.$route.meta.i18n) + ' | ' || ''}${this.$t('app.name')}`;
        document.documentElement.lang = localeId;
        // this.$vuetify.lang.current = localeId;
        if (save) this.$store.commit("settings/changeLocale", localeId);
      } else {
        Console.info("i18n", "Same locale");
      }
    }
  },
}