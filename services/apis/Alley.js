import Api from "./Api";
import ApiUtil from "@/utils/api";
import { queryStringStringify } from "@/helpers/query-string";

class Alley extends Api {
  static url = "/v1/alleys";
}

export default Alley;
