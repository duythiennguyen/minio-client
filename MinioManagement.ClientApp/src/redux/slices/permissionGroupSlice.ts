import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { t } from "i18next";
import { toast } from "react-toastify";
import * as PermissionGroupApi from "src/apis/permissionGroupApi";
interface PermissionModel {
  loading: "success" | "pending";
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
//permission
export const fetchPermissionGroup = createAsyncThunk(
  "fetchPermissionGroup",
  async (search: any) => {
    const res = await PermissionGroupApi.fetchPermissionGroup(search);
    return res.data;
  }
);
export const updatePermissionGroup = createAsyncThunk(
  "updatePermissionGroup",
  async (model:any) => {
    const res = await PermissionGroupApi.updatePermissionGroup(model);
    return res.data;
  }
);
export const deletePermissionGroup = createAsyncThunk(
  "deletePermissionGroup",
  async (id:string) => {
    const res = await PermissionGroupApi.deletePermissionGroup(id);
    return res.data;
  }
);
const permissionGroupSlice = createSlice({
  name: "permissionGroups", // tên này phải giống tên khai báo ./reducer.ts
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // permission
      .addCase(fetchPermissionGroup.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchPermissionGroup.fulfilled, (state: any, action: any) => {
        state.loading = "success";
        state.reload = state.reload + 1 || 1;
        state.data = action.payload;
      })
      .addCase(updatePermissionGroup.fulfilled, (state: any, action: any) => {
        toast.success(t("common.actionSuccess"));
        state.loading = "success";
        const indexState = state.data.findIndex(
          (obj: any) => obj.permissionID === action.payload.permissionID
        );
        state.reload = state.reload + 1;
        if (indexState !== -1) {
          state.data = [
            ...state.data.slice(0, indexState),
            action.payload,
            ...state.data.slice(indexState + 1),
          ];
        }
        else state.data = [action.payload, ...state.data];
      })
      .addCase(deletePermissionGroup.fulfilled, (state: any, action: any) => {
        toast.success(t("common.actionSuccess"));
        state.loading = "success";
        const indexState = state.data.findIndex(
          (obj: any) => obj.permissionID === action.meta.arg
        );
        if (indexState  !== -1) {
          state.reload = state.reload + 1;
          state.data = [
            ...state.data.slice(0, indexState),
            ...state.data.slice(indexState + 1),
          ];
        }
      });
  },
});

export const selectPermissionGroup = (state: any) => state.permissionGroups;// state.<tên> có trong khai báo ./reducer.ts
export default permissionGroupSlice.reducer;
