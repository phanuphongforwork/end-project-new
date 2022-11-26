class Api {
  static $axios

  static initializeAxios(axiosInstance) {
    this.$axios = axiosInstance
  }
}

export default Api
