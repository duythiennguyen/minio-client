import { createSlice } from "@reduxjs/toolkit";
import { setAuthToken } from "src/commons/helpers/set-auth-token";


const initialState = { // <=  phải là obj và lưu dữ liệu tại 1 field trong obj,
  // không lưu được dữ liệu cho cả obj 
  isLogin: false,
  data: {
    companyCode: "",
    departmentCode: "",
    fullName: "",
    permissions: "",
    email: "",
    idp: "",
    name: "",
    access_token: "",
  },
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setAuth: (state: any, action) => {
      //state={} // sẽ không nhận gán như này

      state.isLogin=true
      state.data = { ...action.payload };
      //set token call api
      setAuthToken(action.payload.access_token);
    },
    signOut:(state:any)=>{
      state.isLogin=false
      state.data={}
      setAuthToken('')
    }
  },
});

export const { setAuth,signOut } = authSlice.actions;
export const selectAuth = (state: any) => state.auth;// state.<tên> có trong khai báo ./reducer.ts
export default authSlice.reducer;
