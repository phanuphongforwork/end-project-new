import Api from "./Api";
import ApiUtil from "@/utils/api";
import { queryStringStringify } from "@/helpers/query-string";

class HouseHold extends Api {
  static url = "/v1/house-holds";
}

export default HouseHold;
