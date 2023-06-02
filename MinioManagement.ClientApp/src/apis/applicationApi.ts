import api, { ResultObject } from "./api";
const baseUrl = "/application";

export const fetchAplication = async (): Promise<ResultObject> => {
  const result = await api
    .get<ResultObject>(baseUrl)
    .then((response: any) => response.data);
  return result;
};

export const saveAplication = async (data:any): Promise<ResultObject> => {
  const result = await api
    .post<ResultObject>(baseUrl,data)
    .then((response: any) => response.data);
  return result;
};

export const deleteAplication = async (applicationId:string): Promise<ResultObject> => {
  const result = await api
    .delete<ResultObject>(baseUrl+'/delete/'+applicationId)
    .then((response: any) => response.data);
  return result;
};


///////////////////////////AplicationUser///////////////////////////////
export const fetchAplicationUser = async (applicationId:string =''): Promise<ResultObject> => {
  const result = await api
    .get<ResultObject>(baseUrl+'/user/'+applicationId)
    .then((response: any) => response.data);
  return result;
};

export const saveAplicationUser = async (data:any): Promise<ResultObject> => {
  const result = await api
    .post<ResultObject>(baseUrl+'/user/'+data.applicationId,data)
    .then((response: any) => response.data);
  return result;
};

export const deleteAplicationUser = async (applicationId:string): Promise<ResultObject> => {
  const result = await api
    .delete<ResultObject>(baseUrl+'/user/'+applicationId)
    .then((response: any) => response.data);
  return result;
};
export const addUserInApplication = async (users:any[]): Promise<ResultObject> => {
  const result = await api
    .post <ResultObject>(baseUrl+'/add-users-in-app',users)
    .then((response: any) => response.data);
  return result;
};