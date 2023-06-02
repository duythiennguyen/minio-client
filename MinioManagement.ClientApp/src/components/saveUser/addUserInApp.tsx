import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { t } from "i18next";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Transition } from "src/commons/handle/transitionModal";
import { useSelector } from "react-redux";
import { selectApplication } from "src/redux/slices/applicationSlice";
import { selectUsers } from "src/redux/slices/userSlice";
import { useUser } from "src/redux/hook";
import { addUserInApplication } from "src/apis/applicationApi";
interface IProps {
  reload: number;
  onSave: Function;
  users: any[];
}
const AppUserInApp = (props: IProps) => {
  useUser();
  const userSate = useSelector(selectUsers);
  const applicationState = useSelector(selectApplication);
  const [state, setState] = useState<any>({
    show: false,
    userSelect: [],
    //users: [],
  });

  useEffect(() => {
    if (props.reload > 1) {
      // const users = userSate.data.filter(
      //   (u: any) => props.users.indexOf(u.id) === -1
      // );
      setState({
        ...state,
        show: true,
        //users: users
      });
    }
  }, [props.reload]);
  //handle
  const handleClose = () => {
    setState({ ...state, show: false });
  };
  const handleSave = async () => {
    if (state.applicationId === '' || !state.applicationId) {
      toast.warning(t('common.required'))
      return
    }
    const data = state.userSelect.map((u: any) => {
      return {
        applications: state.applicationName,
        applicationId:state.applicationId,
        companyId: null,
        departmentId: u.departmentId,
        fullName: u.fullName,
        inUse: 1,
        permissions: "",
        userId: u.id,
      };
    });

    // call api insert user by application
    let rs = await addUserInApplication(data);
    if (rs.success) {
      toast.success(t("common.actionSuccess"));
      setState({
        show: false,
        userSelect:[],
        applicationSelect:{},
        users: [],
      });
      props.onSave(data);
    } else {
      toast.error(rs.message);
    }
  };
  return (
    <Dialog
      open={state.show}
      TransitionComponent={Transition}
      keepMounted
      fullWidth={true}
      scroll="paper"
      maxWidth="xs"
      onClose={handleClose}
    >
      <DialogTitle>{t("user.add")}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <Autocomplete
              options={applicationState.data}
              onChange={(e, item: any) => {
                setState({
                  ...state,
                  applicationId: item.applicationID,
                  applicationName: item.applicationName,
                  applicationSelect: item,
                });
              }}
              getOptionLabel={(obj: any) => obj.applicationName}
              value={state.applicationSelect}
              renderInput={(params) => (
                <TextField {...params} label={t("common.application")} required={true} />
              )}
            />
          </Grid>
          <Grid item md={12}>
            <Autocomplete
              options={userSate.data}//state.users
              multiple
              disableCloseOnSelect
              onChange={(e, item) => setState({ ...state, userSelect: item })}
              value={state.userSelect}
              getOptionLabel={(obj: any) => `${obj.id} - ${obj.fullName}`}
              renderInput={(params) => (
                <TextField {...params} label={t("common.account")} />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("common.close")}</Button>
        <Button onClick={handleSave}>{t("common.save")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppUserInApp;
