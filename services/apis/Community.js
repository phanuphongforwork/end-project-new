import Api from "./Api";
import ApiUtil from "@/utils/api";
import { queryStringStringify } from "@/helpers/query-string";

class Community extends Api {
  static url = "/v1/communities";
}

export default Community;
