import Api from "./Api";
import ApiUtil from "@/utils/api";
import { queryStringStringify } from "@/helpers/query-string";

class Person extends Api {
  static url = "/v1/persons";

  static async getAvailable(params = {}) {
    const query = queryStringStringify(params);
    const response = await ApiUtil.$axios.$get(
      `${this.url}/available?${query}`
    );

    return response;
  }
  static async getNotInActivity(params = {}, userIds = []) {
    const query = queryStringStringify(params);

    const response = await ApiUtil.$axios.$post(
      `${this.url}/not-in-activity?${query}`,
      {
        userIds,
      }
    );

    return response;
  }

  static async getNotInHealthCheck(params = {}, userIds = []) {
    const query = queryStringStringify(params);

    const response = await ApiUtil.$axios.$post(
      `${this.url}/not-in-health-check?${query}`,
      {
        userIds,
      }
    );

    return response;
  }

  static async updateLevels(payload) {
    const response = await ApiUtil.$axios.$post(`${this.url}/levels`, payload);

    return response;
  }
}

export default Person;
