import Api from "./Api";
import ApiUtil from "@/utils/api";
import { queryStringStringify } from "@/helpers/query-string";

class HouseHoldMember extends Api {
  static url = "/v1/house-hold-members";
}

export default HouseHoldMember;
