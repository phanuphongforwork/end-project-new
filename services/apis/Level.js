import Api from "./Api";
import ApiUtil from "@/utils/api";
import { queryStringStringify } from "@/helpers/query-string";

class Level extends Api {
  static url = "/v1/levels";
}

export default Level;
