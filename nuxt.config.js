// import colors from "vuetify/es5/util/colors";

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: true,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s",
    title: "แบบบันทึกทะเบียนครัวเรือน",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/css/main.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: "@/plugins/vee-validate.js", ssr: false },
    { src: "@/plugins/toast", ssr: false },
    // "@/plugins/toast",
    "@/plugins/axios",
    "@/plugins/html-print",
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "@nuxtjs/auth",
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.API_URL || "http://127.0.0.1:3335/api",
    headers: {
      common: {
        Accept: "application/json",
      },
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/css/main.css"],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: "#388E3C",
          secondary: "#b0bec5",
          accent: "#8c9eff",
          error: "#b71c1c",
        },
      },
    },
  },

  auth: {
    localStorage: false,
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "/v1/auth/login",
            method: "post",
            propertyName: "data.token",
          },
          logout: false,
          user: {
            url: "/v1/persons/me",
            method: "get",
            propertyName: "data",
          },
        },
      },
    },
    // rewriteRedirects: false,
    redirect: {
      login: "/login",
      logout: "/",
      callback: "/login",
      // home: "/landing-page",
    },
    router: {
      middleware: ["auth"],
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
      postcss: {
        postcssOptions: {
          plugins: {
            tailwindcss: {},
            autoprefixer: {},
          },
        },
      },
    },
  },
};
