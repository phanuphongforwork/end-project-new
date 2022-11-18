import Vue from "vue";
import Toast, { POSITION } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

const options = {
  timeout: 2000,
  position: POSITION.BOTTOM_RIGHT,
  icon: false,
  pauseOnHover: false,
  hideProgressBar: true,
  draggable: false,
  closeButton: false,
};

Vue.use(Toast, options);
