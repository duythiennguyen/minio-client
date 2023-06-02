import api, { ResultObject } from "./api";
const baseUrl = "/permissionGroup";
export const fetchPermissionGroup = async (data: any): Promise<ResultObject> => {
  const result = await api
    .get<ResultObject>(baseUrl+ '?'+ new URLSearchParams(data).toString())
    .then((response: any) => response.data);
  return result;
};
export const fetchUserPermissionGroup = async (groupId:string): Promise<ResultObject> => {
  const result = await api
    .get<ResultObject>(baseUrl+ '/user/'+ groupId)
    .then((response: any) => response.data);
  return result;
};

export const addPermissionGroup = async (data: any): Promise<ResultObject> => {
  const result = await api
    .post<ResultObject>(baseUrl, data)
    .then((response: any) => response.data);
  return result;
};
export const updatePermissionGroup = async (data: any): Promise<ResultObject> => {
  const result = await api
    .put<ResultObject>(baseUrl +  '/update/' + data.id, data)
    .then((response: any) => response.data);
  return result;
};

export const deletePermissionGroup = async (id: any): Promise<ResultObject> => {
  const result = await api
    .delete<ResultObject>(baseUrl + "/delete/" + id)
    .then((response: any) => response.data);
  return result;
};