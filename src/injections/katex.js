import Vue from "vue";
import VueKatex from "vue-katex"
import 'katex/dist/katex.min.css';

Vue.use(VueKatex, {
  globalOptions: {
    //... Define globally applied KaTeX options here
  }
});