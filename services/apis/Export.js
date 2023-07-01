import Api from "./Api";
import ApiUtil from "@/utils/api";

class ExportService extends Api {
  static url = "/v1/exports";

  static async exportHouseHold() {
    const response = await ApiUtil.$axios.$get(`${this.url}/house-holds`);

    return response;
  }
}

export default ExportService;
