import Api from "./Api";
import ApiUtil from "@/utils/api";
import { queryStringStringify } from "@/helpers/query-string";
import dayjs from "dayjs";

class HouseHold extends Api {
  static url = "/v1/house-holds";

  static async getUserInHouse(id) {
    const response = await ApiUtil.$axios.$get(
      `${this.url}/${id}/get-user-in-house`
    );

    return response;
  }

  static async export(houseId) {
    // const query = queryStringStringify(params);
    const response = await ApiUtil.$axios
      .$get(`${this.url}/export/${houseId}`, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        const blob = new Blob([response], { type: "*" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `รายงานทะเบียนครัวเรือน_${dayjs()
          .add(543, "year")
          .format("DD_MM_YYYY")}.xlsx`;
        link.click();
      });

    return response;
  }

  static async getMyHouse() {
    const response = await ApiUtil.$axios.$get(`${this.url}/get-my-house`);

    return response;
  }
}

export default HouseHold;
