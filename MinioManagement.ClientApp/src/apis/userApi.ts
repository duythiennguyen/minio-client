import api, { ResultObject } from "./api";
import apiIdentity from "./apiIdentity";
const baseUrl = "/SystemUser";
export const fetchUserPermission = async (data: any): Promise<ResultObject> => {
  const result = await api
    .get<ResultObject>(baseUrl + "?" + new URLSearchParams(data).toString())
    .then((response: any) => response.data);
  return result;
};
export const fetchPermissionByUser = async (
  userId: string
): Promise<ResultObject> => {
  const result = await api
    .get<ResultObject>(baseUrl + "/permission-by-user/" + userId)
    .then((response: any) => response.data);
  return result;
};

export const addUpdateUserApplication = async (
  data: any
): Promise<ResultObject> => {
  const result = await apiIdentity
    .post<ResultObject>("/UsersAPI/CreateUpdateUser", data)
    .then((response: any) => response.data);
  return result;
};

export const updatedUserPermission = async (
  data: any
): Promise<ResultObject> => {
  const result = await api
    .put<ResultObject>(baseUrl + "/user/" + data.userId, data.permissions)
    .then((response: any) => response.data);
  return result;
};
export const deletedUserPermission = async (
  id: string
): Promise<ResultObject> => {
  const result = await api
    .delete<ResultObject>(baseUrl + "/user/" + id)
    .then((response: any) => response.data);
  return result;
};

export const fetchUserAll = async (): Promise<ResultObject> => {
  const result = await api
    .get<ResultObject>(baseUrl + "/all")
    .then((response: any) => response.data);
  return result;
};
