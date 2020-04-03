import Console from "@/utils/Console";
import SpecialUI from "@/mixins/SpecialUI";

export default {
  watch: {
    '$route': [
      'crispOpacityChanger'
    ],
  },
  mixins: [SpecialUI],
  created () {
    window.$crisp.push(["config", "container:index", [1]]);
    window.$crisp.push(["on", "session:loaded", () => {
      // resolve safe-area
      Console.info("CrispCustomizer", "triggered | chat:loaded")
      try {
        document.querySelector("div.crisp-client > div#crisp-chatbox > div > a").style.setProperty("bottom", "calc(max(env(safe-area-inset-bottom), 14px))", "important");
        document.querySelector("div.crisp-client > div#crisp-chatbox > div > a > span:nth-child(2)").style.setProperty("box-shadow", "0 0 5px rgba(0, 0, 0, .4)", "important");

        if (this.isInSpecialUI) {
          document.querySelector("div.crisp-client > div#crisp-chatbox > div > a > span:nth-child(2)").style.setProperty("filter", "grayscale(1)", "important");
        }

        this.crispOpacityChanger()
      } catch (e) {
        Console.error("CrispCustomizer", "failed to initialize custom style:", e)
      }
    }]);
  },
  methods: {
    crispOpacityChanger (newRoute = this.$route) {
      Console.info("CrispCustomizer", "customize | changing opacity");
      try {
        document.querySelector("div.crisp-client").style.setProperty("transition", "all 275ms cubic-bezier(0.165, 0.84, 0.44, 1)", "important");

        if (newRoute.name === "home") {
          document.querySelector("div.crisp-client").style.setProperty("opacity", 1, "important");
          // document.querySelector("div.crisp-client").style.setProperty("transform", "translateY(0px)", "important")
        } else {
          document.querySelector("div.crisp-client").style.setProperty("opacity", 0, "important");
          // document.querySelector("div.crisp-client").style.setProperty("transform", "translateY(32px)", "important")
        }
      } catch (e) {
        Console.error("CrispCustomizer", "failed to change crisp opacity", e, "newRoute.name", newRoute.name)
      }
    },
  },
}