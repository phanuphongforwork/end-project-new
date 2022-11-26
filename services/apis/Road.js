import Api from "./Api";
import ApiUtil from "@/utils/api";
import { queryStringStringify } from "@/helpers/query-string";

class Road extends Api {
  static url = "/v1/roads";
}

export default Road;
