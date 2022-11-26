import Api from "./Api";
import ApiUtil from "@/utils/api";
import { queryStringStringify } from "@/helpers/query-string";

class SubDistrict extends Api {
  static url = "/v1/subdistricts";
}

export default SubDistrict;
