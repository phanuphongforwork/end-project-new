import Api from "./Api";
import ApiUtil from "@/utils/api";
import { queryStringStringify } from "@/helpers/query-string";

class Commitee extends Api {
  static url = "/v1/committees";
}

export default Commitee;
