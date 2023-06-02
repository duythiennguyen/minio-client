import api, { ResultObject } from "./api";
const baseUrl = "/Department";
export const fetchDepartment = async (): Promise<ResultObject> => {
  const result = await api
    .get<ResultObject>(baseUrl)
    .then((response: any) => response.data);
  return result;
};
