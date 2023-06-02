import { combineReducers } from "@reduxjs/toolkit";
import applicationSlice from "./slices/applicationSlice";
import authSlice from "./slices/authSlice";
import menuSlice from "./slices/menuSlice";
import permissionSlice from "./slices/permissionSlice";
import permissionGroupSlice from "./slices/permissionGroupSlice";
import userSlice from "./slices/userSlice";
import departmentSlice from "./slices/departmentSlice";

const rootReducer = {
  menu: menuSlice,
  auth: authSlice,
  users:userSlice,
  departments:departmentSlice,
  permissionGroups: permissionGroupSlice,
  permissions: permissionSlice,
  applications: applicationSlice,
};

export default combineReducers(rootReducer);
