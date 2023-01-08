import Api from "./Api";
import ApiUtil from "@/utils/api";
import { queryStringStringify } from "@/helpers/query-string";

class Activity extends Api {
  static url = "/v1/activities";

  // static async getUserInHouse(id) {
  //   const response = await ApiUtil.$axios.$get(
  //     `${this.url}/${id}/get-user-in-house`
  //   );

  //   return response;
  // }

  // static async getMyHouse() {
  //   const response = await ApiUtil.$axios.$get(`${this.url}/get-my-house`);

  //   return response;
  // }
}

export default Activity;
