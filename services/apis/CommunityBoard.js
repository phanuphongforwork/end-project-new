import Api from "./Api";
import ApiUtil from "@/utils/api";
import { queryStringStringify } from "@/helpers/query-string";

class CommunityBoard extends Api {
  static url = "/v1/community-boards";

  static async getAvailable(idCard, committeeId, year) {
    const query = queryStringStringify({
      idCard: idCard ?? undefined,
      committeeId: committeeId ?? undefined,
      year: year ?? undefined,
    });
    const response = await ApiUtil.$axios.$get(
      `${this.url}/get-available?${query}`
    );

    return response;
  }
}

export default CommunityBoard;
