import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { t } from "i18next";
import { toast } from "react-toastify";
import * as PermissionApi from "src/apis/permissionApi";
interface PermissionModel {
  loading: "success" | "pending" | 'error';
  data: any[];
  error: string;
  reload:number;
}
const initialState: PermissionModel = {
  loading: "pending",
  data: [],
  error: "",
  reload:1
};
// module
export const fetchPermission = createAsyncThunk(
  "fetchPermission",
  async (search: any) => {
    const res = await PermissionApi.fetchPermission(search);
    return res.data;
  }
);

export const deletePermission = createAsyncThunk(
  "deletePermission",
  async (id: string) => {
    const res = await PermissionApi.deletePermission(id);
    return res.data;
  }
);

export const updatePermission = createAsyncThunk(
  "updatePermission",
  async (data: any) => {
    const res = await PermissionApi.updatePermission(data);
    return res.data;
  }
);


const permissionSlice = createSlice({
  name: "permissions", // tên này phải giống tên khai báo ./reducer.ts
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // module
      //get 
      .addCase(fetchPermission.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchPermission.fulfilled, (state: any, action: any) => {
        state.loading = "success";
        state.reload = state.reload + 1 || 1;
        state.data = action.payload;
      })
      //update
      .addCase(updatePermission.rejected,(state: any, action: any) => {
        state.loading = "error";
        state.error = action.payload;
        toast.error(t('common.actionError'))
      })
      .addCase(updatePermission.fulfilled,(state: any, action: any) => {
        toast.success(t("common.actionSuccess"));
        state.loading = "success";
        state.reload = state.reload + 1;
        const indexState = state.data.findIndex(
          (obj: any) => obj.moduleID === action.payload.moduleID
        );
        if (indexState !== -1) {
          state.data = [
            ...state.data.slice(0, indexState),
            action.payload,
            ...state.data.slice(indexState + 1),
          ];
        } else state.data = [action.payload, ...state.data];
      })
      // delete
      .addCase(deletePermission.rejected,(state: any, action: any) => {
        state.loading = "error";
        state.error = action.payload;
      })
      .addCase(deletePermission.fulfilled,(state: any, action: any) => {
        toast.success(t('common.actionSuccess'))
        state.loading = "success";
        const indexState = state.data.findIndex(
          (obj: any) => obj.moduleID === action.meta.arg
        );
        if (indexState !== -1) {
          state.reload = state.reload + 1;
          state.data = [
            ...state.data.slice(0, indexState),
            ...state.data.slice(indexState + 1),
          ];
        }
      })
  },
});

export const selectPermission = (state: any) => state.permissions; // state.<tên> có trong khai báo ./reducer.ts
export default permissionSlice.reducer;
