import Rectangle from "./Rectangle";
import DropRecognition from "./DropRecognition";
import WebFont from "webfontloader";
let FontLoaded = new Promise((resolve) => {
  WebFont.load({
    custom: {
      families: ["Novecento WideBold"]
    },
    active: function () {
      resolve();
    }
  });
});
export { DropRecognition, Rectangle,FontLoaded };
export default DropRecognition;
