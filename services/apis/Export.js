import Api from "./Api";
import ApiUtil from "@/utils/api";
import { queryStringStringify } from "@/helpers/query-string";
import dayjs from "dayjs";

class ExportService extends Api {
  static url = "/v1/exports";

  static async exportHouseHold() {
    const response = await ApiUtil.$axios
      .$post(`${this.url}/house-holds`, {}, { responseType: "arraybuffer" })
      .then((response) => {
        const blob = new Blob([response], { type: "*" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `รายงานครัวเรือนที่ดูแลปี_${dayjs()
          .add(543, "year")
          .format("YYYY")}.xlsx`;
        link.click();
      });

    return response;
  }
}

export default ExportService;
