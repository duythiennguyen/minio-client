import api, { ResultObject } from "./api";
const baseUrl = "/permission";
export const fetchPermission = async (
  data: any
): Promise<ResultObject> => {
  const result = await api
    .get<ResultObject>(baseUrl+'?'+ new URLSearchParams(data).toString())
    .then((response: any) => response.data);
  return result;
};

export const addPermission = async (data: any): Promise<ResultObject> => {
  const result = await api
    .post<ResultObject>(baseUrl, data)
    .then((response: any) => response.data);
  return result;
};
export const updatePermission = async (data: any): Promise<ResultObject> => {
  const result = await api
    .put<ResultObject>(baseUrl + "/update/" + data.id, data)
    .then((response: any) => response.data);
  return result;
};

export const deletePermission = async (id: any): Promise<ResultObject> => {
  const result = await api
    .delete<ResultObject>(baseUrl + "/delete/" + id)
    .then((response: any) => response.data);
  return result;
};
