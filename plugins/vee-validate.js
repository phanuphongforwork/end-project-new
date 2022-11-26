import Vue from "vue";
import VeeValidate from "vee-validate";
import validationMessages from "vee-validate/dist/locale/th";

Vue.use(VeeValidate, {
  locale: "th",
  dictionary: {
    th: validationMessages,
  },
});
