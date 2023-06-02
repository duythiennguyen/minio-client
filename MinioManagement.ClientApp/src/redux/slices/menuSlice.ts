import { createSlice } from "@reduxjs/toolkit";
import { t } from "i18next";

const initialState = { // <=  phải là obj và lưu dữ liệu tại 1 field trong obj,
  // không lưu được dữ liệu cho cả obj 
  isLoad: false,
  data:[
    // {
    //   title: 'Dashboard',
    //   icon: 'HomeOutline',
    //   path: '/'
    // },
    // {
    //   title: 'Account Settings',
    //   icon: 'AccountCogOutline',
    //   path: '/account-settings'
    // },
    // {
    //   sectionTitle: 'Pages'
    // },
    // {
    //   title: 'Login',
    //   icon: 'Login',
    //   path: '/login',
    //   openInNewTab: true
    // },
    // {
    //   title: 'Register',
    //   icon: 'AccountPlusOutline',
    //   path: '/register',
    //   openInNewTab: true
    // },
    // {
    //   title: 'Error',
    //   icon: 'AlertCircleOutline',
    //   path: '/error',
    //   openInNewTab: true
    // },
    // {
    //   sectionTitle: 'User Interface'
    // },
    // {
    //   title: 'Typography',
    //   icon: 'FormatLetterCase',
    //   path: '/typography'
    // },
    // {
    //   title: 'Icons',
    //   path: '/icons',
    //   icon: 'GoogleCirclesExtended'
    // },
    // {
    //   title: 'Cards',
    //   icon: 'CreditCardOutline',
    //   path: '/cards'
    // },
    // {
    //   title: 'Tables',
    //   icon: 'Table',
    //   path: '/tables'
    // },
    // {
    //   icon: 'CubeOutline',
    //   title: 'Form Layouts',
    //   path: '/form-layouts'
    // }
  ],
};

const menuSlice = createSlice({
  name: "menu",  // tên này phải giống tên khai báo ./reducer.ts
  initialState,
  reducers: {
    setMenu: (state: any, action) => {
      state.isLoad=true
      state.data= action.payload
    }
  },
});

export const { setMenu } = menuSlice.actions;
export const selectMenu = (state: any) => state.menu;// state.<tên> có trong khai báo ./reducer.ts
export default menuSlice.reducer;
