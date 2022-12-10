import Api from "./Api";
import ApiUtil from "@/utils/api";
import { queryStringStringify } from "@/helpers/query-string";

class HouseHold extends Api {
  static url = "/v1/house-holds";

  static async getUserInHouse(id) {
    const response = await ApiUtil.$axios.$get(
      `${this.url}/${id}/get-user-in-house`
    );

    return response;
  }
}

export default HouseHold;
