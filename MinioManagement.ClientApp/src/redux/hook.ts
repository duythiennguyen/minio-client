import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchAplication, selectApplication } from "./slices/applicationSlice";
import { fetchPermission, selectPermission } from "./slices/permissionSlice";
import {
  selectPermissionGroup,
  fetchPermissionGroup,
} from "./slices/permissionGroupSlice";
import { useAppDispatch } from "./store";
import { fetchUserAll, selectUsers } from "./slices/userSlice";
import { fetchDepartment, selectDepartments } from "./slices/departmentSlice";

// những func này hỗ trợ kiểm tra khi trang đã có dữ liệu đó chưa,
// nếu chưa thì tiến hành get lại data
// ngược lại bỏ qua

export const useApplication = () => {
  const [loaded, setLoaded] = useState(false);
  const state = useSelector(selectApplication);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!loaded && state.data.length === 0) {
      dispatch(fetchAplication());
      setLoaded(true);
    }
  }, [state, dispatch, loaded]);
};

export const usePermission = () => {
  const [loaded, setLoaded] = useState(false);
  const state = useSelector(selectPermission);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!loaded && state.data.length === 0) {
      dispatch(fetchPermission({ pageIndex: 1, pageSize: 10000 }));
      setLoaded(true);
    }
  }, [state, dispatch, loaded]);
};

export const usePermissionGroup = () => {
  const [loaded, setLoaded] = useState(false);
  const state = useSelector(selectPermissionGroup);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!loaded && state.data.length === 0) {
      const objSer = {
        pageIndex: 1,
        pageSize: 100000,
      };
      dispatch(fetchPermissionGroup(objSer));
      setLoaded(true);
    }
  }, [state, dispatch, loaded]);
};

export const useUser = () => {
  const [loaded, setLoaded] = useState(false);
  const state = useSelector(selectUsers);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!loaded && state.data.length === 0) {
      dispatch(fetchUserAll());
      setLoaded(true);
    }
  }, [state, dispatch, loaded]);
};

export const useDepartment = () => {
  const [loaded, setLoaded] = useState(false);
  const state = useSelector(selectDepartments);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!loaded && state.data.length === 0) {
      dispatch(fetchDepartment());
      setLoaded(true);
    }
  }, [state, dispatch, loaded]);
};
