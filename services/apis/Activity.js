import Api from "./Api";
import ApiUtil from "@/utils/api";
import { queryStringStringify } from "@/helpers/query-string";
import dayjs from "dayjs";

class Activity extends Api {
  static url = "/v1/activities";

  static async export(params = {}) {
    const query = queryStringStringify(params);
    const response = await ApiUtil.$axios
      .$get(`${this.url}/export?${query}`, { responseType: "arraybuffer" })
      .then((response) => {
        const blob = new Blob([response], { type: "*" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `รายงานกิจกรรม_${dayjs()
          .add(543, "year")
          .format("DD_MM_YYYY")}.xlsx`;
        link.click();
      });

    return response;
  }
}

export default Activity;
