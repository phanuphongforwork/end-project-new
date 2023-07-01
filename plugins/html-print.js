import Vue from "vue";
import VueHtmlToPaper from "vue-html-to-paper";

const options = {
  name: "_blank",
  specs: ["fullscreen=false", "titlebar=yes", "scrollbars=yes"],
  styles: [
    // "https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css",
    // "https://unpkg.com/kidlat-css/css/kidlat.css",
    // "../assets/css/landscape.css",
  ],
};

Vue.use(VueHtmlToPaper, options);

// or, using the defaults with no stylesheet
Vue.use(VueHtmlToPaper);
