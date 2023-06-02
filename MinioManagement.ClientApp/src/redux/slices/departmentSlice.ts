// lấy all danh sách user
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as Api from "src/apis/departmentApi";
interface PermissionModel {
  loading: "success" | "pending" | 'error';
  data: any[];
  error: string;
}
const initialState: PermissionModel = {
  loading: "pending",
  data: [],
  error: "",
};
// module
export const fetchDepartment = createAsyncThunk("fetchDepartment", async () => {
  const res = await Api.fetchDepartment();
  return res.data;
});

const departmentSlice = createSlice({
  name: "departments", // tên này phải giống tên khai báo ./reducer.ts
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartment.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchDepartment.fulfilled, (state: any, action: any) => {
        state.loading = "success";
        state.data = action.payload;
      })
      .addCase(fetchDepartment.rejected,(state: any, action: any) => {
        state.loading = "error";
        state.error = action.error.message;
      })
  },
});

export const selectDepartments = (state: any) => state.departments;// state.<tên> có trong khai báo ./reducer.ts
export default departmentSlice.reducer;
