// lấy all danh sách user
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as UserApi from "src/apis/userApi";
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
// module
export const fetchUserAll = createAsyncThunk("fetchUserAll", async (search) => {
  const res = await UserApi.fetchUserAll();
  return res.data;
});
const userSlice = createSlice({
  name: "users", // tên này phải giống tên khai báo ./reducer.ts
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // module
      .addCase(fetchUserAll.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchUserAll.fulfilled, (state: any, action: any) => {
        state.loading = "success";
        state.reload = state.reload + 1 || 1;
        state.data = action.payload;
      })
  },
});

export const selectUsers = (state: any) => state.users;// state.<tên> có trong khai báo ./reducer.ts
export default userSlice.reducer;
