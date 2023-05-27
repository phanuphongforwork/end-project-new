import Vue from "vue";
import VueHtmlToPaper from "vue-html-to-paper";

const options = {
  name: "_blank",
  specs: ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
  // styles: ["https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css"],https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css
  styles: ["https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css"],
};

Vue.use(VueHtmlToPaper, options);

// or, using the defaults with no stylesheet
Vue.use(VueHtmlToPaper);
