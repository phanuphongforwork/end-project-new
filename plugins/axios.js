import get from "lodash/get";
import Api from "@/utils/api";

export const accessor = ({ $axios, store }) => {
  Api.initializeAxios($axios);
};

export default accessor;
