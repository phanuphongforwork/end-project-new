import ApiUtil from '@/utils/api'
import { queryStringStringify } from '@/helpers/query-string'

class Api {
  static async getAll(params = {}) {
    const query = queryStringStringify(params)
    const response = await ApiUtil.$axios.$get(`${this.url}?${query}`)

    return response
  }

  static async create(payload) {
    const response = await ApiUtil.$axios.$post(this.url, payload)

    return response
  }

  static async getById(id, params = {}) {
    const query = queryStringStringify(params)

    const { data } = await ApiUtil.$axios.$get(`${this.url}/${id}?${query}`)

    return data
  }

  static async update(id, payload) {
    const response = await ApiUtil.$axios.$put(`${this.url}/${id}`, payload)

    return response
  }

  static async delete(id, params = {}) {
    const query = queryStringStringify(params)

    await ApiUtil.$axios.$delete(`${this.url}/${id}?${query}`)
  }
}

export default Api
