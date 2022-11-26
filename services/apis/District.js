import Api from "./Api";
import ApiUtil from "@/utils/api";
import { queryStringStringify } from "@/helpers/query-string";

class District extends Api {
  static url = "/v1/districts";
}

export default District;
