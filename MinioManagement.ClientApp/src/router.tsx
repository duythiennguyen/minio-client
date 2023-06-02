import React, { lazy } from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import LoadingPage from "./components/loadingPage";
//import CallBack from 'src/pages/callBack'
import UserLayout from 'src/components/layouts/UserLayout'

//lazy
const Page404 = lazy(() => import("src/pages/error/404"));
const Page401 = lazy(() => import("src/pages/error/401"));
const Page500 = lazy(() => import("src/pages/error/500"));
const Error = lazy(() => import("src/pages/error"));

const Home = lazy(() => import("src/pages/home"));
const AccountSettings = lazy(() => import("src/pages/account-settings"));
const Card = lazy(() => import("src/pages/cards"));
const FromLayouts = lazy(() => import("src/pages/form-layouts"));
const Tables = lazy(() => import("src/pages/tables"));
const Register = lazy(() => import("src/pages/register"));
const Login = lazy(() => import("src/pages/login"));
const Typography = lazy(() => import("src/pages/typography"));
const Icons = lazy(() => import("src/pages/icons"));
const CallBack = lazy(() => import("src/pages/callBack"));

const Application = lazy(() => import("src/pages/application/application"));
const Permission = lazy(() => import("src/pages/permission/permission"));
const PermissionGroup = lazy(() => import("src/pages/permission-group/permissionGroup"));
const User = lazy(() => import("./pages/user/user"));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <UserLayout />,
    children: [
      { index: true, element: <Permission /> },
      { path: '/application', element: <Application /> },
      { path: '/permission', element: <Permission /> },
      { path: '/permission-group', element: <PermissionGroup /> },
      { path: '/user', element: <User /> },
    ]
  },
  {
    path: "/component",
    element: <UserLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/component/account-settings", element: <AccountSettings /> },
      { path: "/component/cards", element: <Card /> },
      { path: "/component/form-layouts", element: <FromLayouts /> },
      { path: "/component/tables", element: <Tables /> },
      { path: "/component/typography", element: <Typography /> },
      { path: "/component/icons", element: <Icons /> },
    ],
  },
  { path: "/register", element: <LoadingPage> <Register /></LoadingPage> },
  { path: "/login", element: <LoadingPage><Login /> </LoadingPage> },
  { path: "/callback", element: <LoadingPage><CallBack /></LoadingPage> },
  { path: "/404", element: <LoadingPage><Page404 /></LoadingPage> },
  { path: "/401", element: <LoadingPage><Page401 /></LoadingPage> },
  { path: "/500", element: <LoadingPage><Page500 /></LoadingPage> },
  { path: '*', element: <LoadingPage> <Error /></LoadingPage> }
];

export default createBrowserRouter(routes)