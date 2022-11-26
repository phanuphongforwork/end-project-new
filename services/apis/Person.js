import Api from "./Api";
import ApiUtil from "@/utils/api";
import { queryStringStringify } from "@/helpers/query-string";

class Person extends Api {
  static url = "/v1/persons";
}

export default Person;
