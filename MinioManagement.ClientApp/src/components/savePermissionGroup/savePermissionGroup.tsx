import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Slide,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { t } from "i18next";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

import { Transition } from "src/commons/handle/transitionModal";
import { handleOnchange } from "src/commons/handle";
import { selectApplication } from "src/redux/slices/applicationSlice";
import { toast } from "react-toastify";
import { TabContext, TabPanel } from "@mui/lab";

import * as Api from "src/apis/permissionGroupApi";
import TablePermission, { TablePermissionHandle } from "./tablePermission";
import TableUser, { TableUserHandle } from "./tableUser";
const SavePermissionGroup = (props: any) => {
  const tablePermissionRef = useRef<TablePermissionHandle>(null);
  const tableUserRef = useRef<TableUserHandle>(null);
  const applicationState = useSelector(selectApplication);

  const [tab, setTab] = useState("permission");
  const [permissions, setPermissions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [state, setState] = useState({
    isEdit: false,
    show: false,
    permissionID: "",
    permissionName: "",
    description: "",
    applicationID: "",
    selectApp: null,
    reloadPermission: 1,
    reloadUser: 1,
  });

  useEffect(() => {
    if (props.data.permissionID && props.data.permissionID !== "") {
      if (props.data.permissionID !== state.permissionID)
        loadPermissionByGroup(props.data.permissionID);
      else
        setState({
          ...state,
          show: props.show,
        });
    } else {
      setPermissions([]);
      setUsers([]);
      setState({
        isEdit: false,
        show: props.show,
        permissionID: "",
        permissionName: "",
        applicationID: "",
        description: "",
        selectApp: null,
        reloadPermission: 1,
        reloadUser: 1,
      });
    }
  }, [props.reload]);

  const loadPermissionByGroup = (groupId: string) => {
    if (groupId && groupId !== "") {
      Api.fetchUserPermissionGroup(groupId).then((rs) => {
        if (!rs.success) {
          toast.error(rs.message);
        } else {
          setUsers(rs.data.users);
          setPermissions(rs.data.permissions);
          const selectApp = applicationState.data.find(
            (obj: any) => obj.applicationID === props.data.applicationID
          );
          setState({
            show: props.show,
            isEdit: true,
            ...props.data,
            applicationID: props.data.siteType,
            selectApp: selectApp,
            reloadPermission: state.reloadPermission + 1,
            reloadUser: state.reloadUser + 1,
          });
        }
      });
    }
  };
  
  //handle
  const handleClose = () => {
    setState({ ...state, show: false });
  };

  const handleSave = () => {
    //validate
    if (
      state.permissionID === "" ||
      state.permissionName === "" ||
      state.applicationID === ""
    ) {
      toast.warning(t("common.required"));
      return;
    }

    const usersRef = tableUserRef.current ? tableUserRef.current.get() : users;
    const usersMap = usersRef.map((rs: any) => rs.userId);

    const permissionsRef = tablePermissionRef.current
      ? tablePermissionRef.current.get()
      : permissions;

    const permissionMap = permissionsRef.map((per: any) => {
      return {
        ...per,
        id:0,
        moduleID: per.id,
        applicationId: state.applicationID,
      }
    })
    const model = {
      id: state.permissionID,
      name: state.permissionName,
      applicationId: state.applicationID,
      description: state.description,
      users: usersMap,
      inUse: 1,
      permissions: permissionMap
    };
    props.onSave(model);
  };

  const handleChangeTab = (newData: any) => {
    // // lưu lại table  trươc khi chuyển tab mới
    if (newData === "permission") {
      const userRef = tableUserRef.current ? tableUserRef.current.get() : [];
      setUsers(userRef);
    } else {
      const permissionRef = tablePermissionRef.current
        ? tablePermissionRef.current.get()
        : [];
      setPermissions(permissionRef);
    }
    setTab(newData);
  };
  return (
    <Dialog
      open={state.show}
      TransitionComponent={Transition}
      keepMounted
      fullWidth={true}
      scroll="paper"
      maxWidth="xl"
      onClose={handleClose}
    >
      <DialogTitle>{t("application.isEditPermissionGroup")}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item container spacing={3}>
            <Grid item md={4}>
              <Autocomplete
                options={applicationState.data}
                value={state.selectApp}
                onChange={(e, item) => {
                  setState({
                    ...state,
                    applicationID: item.applicationID,
                    selectApp: item,
                    reloadPermission: state.reloadPermission + 1,
                  });
                }}
                getOptionLabel={(obj: any) => obj.applicationName}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("common.application")}
                    required={true}
                  />
                )}
              />
            </Grid>
            <Grid item md={4}>
              <TextField
                required={true}
                disabled={state.isEdit}
                fullWidth
                label={t("common.id")}
                value={state.permissionID}
                onChange={(e) =>
                  handleOnchange(
                    e.target.value,
                    "permissionID",
                    state,
                    setState
                  )
                }
                placeholder={t("common.pleaseEnter") || ""}
              />
            </Grid>
            <Grid item md={4}>
              <TextField
                required={true}
                fullWidth
                label={t("common.name")}
                value={state.permissionName}
                onChange={(e) =>
                  handleOnchange(
                    e.target.value,
                    "permissionName",
                    state,
                    setState
                  )
                }
                placeholder={t("common.pleaseEnter") || ""}
              />
            </Grid>
            <Grid item md={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={state.description}
                onChange={(e) =>
                  handleOnchange(e.target.value, "description", state, setState)
                }
                label={t("common.description")}
                placeholder={t("common.pleaseEnter") || ""}
              />
            </Grid>
          </Grid>
          <Grid item container>
            <TabContext value={tab}>
              <Grid item md={12}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={tab}
                    onChange={(event: any, newValue: string) =>
                      handleChangeTab(newValue)
                    }
                    aria-label="basic tabs example"
                  >
                    <Tab label={t("application.listUser")} value="user" />
                    <Tab
                      label={t("permissionGroup.listPermission")}
                      value="permission"
                    />
                  </Tabs>
                </Box>
              </Grid>
              <Grid item md={12}>
                <TabPanel value="user">
                  <TableUser
                    data={users}
                    ref={tableUserRef}
                    reload={state.reloadUser}
                  />
                </TabPanel>
                <TabPanel value="permission">
                  <TablePermission
                    data={permissions}
                    ref={tablePermissionRef}
                    reload={state.reloadPermission}
                    applicationId={state.applicationID}
                  />
                </TabPanel>
              </Grid>
            </TabContext>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("common.close")}</Button>
        <Button variant="contained" onClick={handleSave}>
          {t("common.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SavePermissionGroup;
