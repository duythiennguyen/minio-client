import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";
import { t } from "i18next";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { handleOnchange } from "src/commons/handle";
import { Transition } from "src/commons/handle/transitionModal";
import * as SysUserApi from "src/apis/userApi";
import TableApplicationPermission, {
  TableApplicationPermissionHandle,
} from "./tableApplicationPermission";
import { useSelector } from "react-redux";
import { selectApplication } from "src/redux/slices/applicationSlice";
import { ResultObject } from "src/apis/api";
import { selectDepartments } from "src/redux/slices/departmentSlice";
import { useDepartment } from "src/redux/hook";
interface IProps {
  show: boolean | false;
  data: any;
  reload: number;
  onSave: Function;
}
const SaveUser = (props: IProps) => {
  useDepartment();
  const defaulValue = {
    show: false,
    permissions: [] as any[],
    userId: "",
    fullName: "",
    departmentId: "",
    inUse: true,
    applicationIds: [],
    selectDepartment: null
  };
  const applicationState = useSelector(selectApplication);
  const departmentState = useSelector(selectDepartments)
  const [state, setState] = useState<any>(defaulValue);
  const tableApplicationRef = useRef<TableApplicationPermissionHandle>(null);
  useEffect(() => {
    if (props.data && props.data.userId === 'new') { // thêm mới
      setState({
        ...defaulValue,
        show: props.show
      });
    }
    else if (state.userId !== props.data.userId) { // mở popup chỉnh sửa khác userId
      loadPermissionByUser();
    } else {// mở lại popup chỉnh sửa trùng userId 
      setState({
        ...state,
        show: props.show,
      });
    }
  }, [props.reload]);
  const loadPermissionByUser = () => {
    if (!props.data.userId || props.data.userId === "") return;

    SysUserApi.fetchPermissionByUser(props.data.userId).then((rs) => {
      if (!rs.success) {
        toast.error(rs.message);
      } else {
        const applicationIds = rs.data.map((ap: any) => ap.applicationId);
        // lọc trùng
        const uniqueApplicationIds = [...new Set(applicationIds)];
        const selectDep = departmentState.data.find((rs: any) => rs.code === props.data.departmentId)
        setState({
          ...state,
          show: props.show,
          userId: props.data.userId,
          fullName: props.data.fullName,
          departmentId: props.data.departmentId,
          inUse: props.data.inUse,
          permissions: rs.data,
          applicationIds: uniqueApplicationIds,
          selectDepartment: selectDep
        });
      }
    });
  };
  //handle
  const handleClose = () => {
    setState({ ...state, show: false });
  };
  const handleSave = async () => {
    try {
      const model ={
        siteType: state.applicationIds[0],
        userID: state.userId,
        departmentID: state.departmentId,
        companyId: "CONGTY",
        fullName: state.fullName,
        inUse: state.inUse
      }
      const data: ResultObject = await SysUserApi.addUpdateUserApplication(model);
      if (data.success) {
        // call save 
        const permissionRef = tableApplicationRef.current
          ? tableApplicationRef.current.get()
          : [];
        const model = {
          userId: state.userId,
          permissions: permissionRef,
        };
        props.onSave(model);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      alert(error.message);
    }
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
      <DialogTitle>
        {props.data.userId === 'new'
          ? (t("common.addUser"))
          : (`${t("user.editModel")}: ${state.userId} - ${state.fullName} (${state.departmentId})`)
        }
      </DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item container spacing={2}>
            <Grid item md={6}>
              <TextField
                fullWidth
                label={t("common.userId")}
                placeholder={t("common.pleaseEnter") || ""}
                size="small"
                variant="outlined"
                disabled={props.data.userId !== 'new'}
                onChange={(e)=>handleOnchange(e.target.value,"userId",state,setState)}
                value={state.userId}
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                fullWidth
                label={t("common.fullName")}
                placeholder={t("common.pleaseEnter") || ""}
                size="small"
                variant="outlined"
                onChange={(e)=>handleOnchange(e.target.value,"fullName",state,setState)}
                required
                value={state.fullName}
              />
            </Grid>
            <Grid item md={6}>
              <Autocomplete
                options={departmentState.data}
                value={state.selectDepartment}
                onChange={(e, item: any) => {
                  setState({
                    ...state,
                    departmentId: item.code,
                    selectDepartment: item
                  })
                }}
                getOptionLabel={(obj: any) => obj.name}
                renderInput={params => <TextField {...params} label={t('common.departmentId')} />
                } />
            </Grid>
            <Grid item md={6}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked={state.inUse}
                      onChange={(e: any) =>
                        handleOnchange(
                          e.target.value,
                          "inUse",
                          state,
                          setState
                        )
                      }
                    />
                  }
                  label={t("common.status")}
                />
              </FormGroup>
            </Grid>
            <Grid item md={12}>
              <Autocomplete
                options={applicationState.data}
                multiple={true}
                onChange={(e, item: any) => {
                  const ids = item ? item.map((rs: any) => rs.applicationID) : []
                  handleOnchange(
                    ids,
                    "applicationIds",
                    state,
                    setState
                  );
                }}
                getOptionLabel={(obj: any) => obj.applicationName}
                value={applicationState.data.filter(
                  (rs: any) =>
                    state.applicationIds.indexOf(rs.applicationID) !== -1
                )}
                renderInput={(params) => (
                  <TextField {...params} label={t("common.application")} />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
        <TableApplicationPermission
          data={state.permissions}
          ref={tableApplicationRef}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("common.close")}</Button>
        <Button onClick={handleSave}>{t("common.save")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveUser;
