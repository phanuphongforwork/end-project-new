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
}

export default Person;
