import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { t } from "i18next";
import { toast } from "react-toastify";
import * as ApplicationApi from "src/apis/applicationApi";
interface ApplicationModel {
  loading: "success" | "pending" | "error";
  data: any[];
  error: string;
  reload: number;
}
const initialState: ApplicationModel = {
  loading: "pending",
  data: [],
  error: "",
  reload: 1,
};
// aplication
export const fetchAplication = createAsyncThunk("fetchAplication", async () => {
  const res = await ApplicationApi.fetchAplication();
  return res.data;
});
export const updateAplication = createAsyncThunk(
  "updateAplication",
  async (data: any) => {
    const res = await ApplicationApi.saveAplication(data);
    return res.data;
  }
);

export const deleteAplication = createAsyncThunk(
  "deleteAplication",
  async (id: string) => {
    const res = await ApplicationApi.deleteAplication(id);
    return res.data;
  }
);

const applicationSlice = createSlice({
  name: "aplications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //aplication
      .addCase(fetchAplication.fulfilled, (state: any, action: any) => {
        state.loading = "success";
        state.data = action.payload;
        state.reload = state.reload + 1 || 1;
      })
      .addCase(updateAplication.fulfilled, (state: any, action: any) => {
        toast.success(t("common.actionSuccess"));
        state.loading = "success";
        state.reload = state.reload + 1;
        const indexState = state.data.findIndex(
          (obj: any) => obj.applicationID === action.payload.applicationID
        );
        if (indexState !== -1) {
          state.data = [
            ...state.data.slice(0, indexState),
            action.payload,
            ...state.data.slice(indexState + 1),
          ];
        } else state.data = [action.payload, ...state.data];
      })
      .addCase(updateAplication.rejected, (state: any, action: any) => {
        state.loading = "error";
        state.error = action.error.message;
        toast.error(t("common.actionError") + ": " + action.error.message);
      })
      .addCase(deleteAplication.fulfilled, (state: any, action: any) => {
        toast.success(t("common.actionSuccess"));
        state.loading = "success";
        state.reload = state.reload + 1;
        const indexState = state.data.findIndex(
          (obj: any) => obj.applicationID === action.meta.arg
        );
        if (indexState !== -1) {
          state.data = [
            ...state.data.slice(0, indexState),
            ...state.data.slice(indexState + 1),
          ];
        }
      });
  },
});

export const selectApplication = (state: any) => state.applications; // tên này phải giống tên khai báo ./reducer.ts
export default applicationSlice.reducer;
