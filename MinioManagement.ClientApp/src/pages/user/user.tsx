import MaterialTable from "@material-table/core";
import { Autocomplete, Button, Chip, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { handleOnchange } from "src/commons/handle";
import { useApplication, usePermission } from "src/redux/hook";
import { selectApplication } from "src/redux/slices/applicationSlice";
import { Edit, PersonAddAlt, GroupAdd } from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  updatedUserPermission,
  fetchUserPermission,
} from "src/apis/userApi";
import { ResultObject } from "src/apis/api";
import SaveUser from "src/components/saveUser/saveUser";
import AppUserInApp from "src/components/saveUser/addUserInApp";
let indexReload = 1;
const User = () => {
  useApplication();
  usePermission();
  const { t } = useTranslation();
  const applicationState = useSelector(selectApplication);
  const [data, setData] = useState<any[]>([]);
  const [application, setApplication] = useState([]);
  const [state, setState] = useState({
    showEdit: false,
    reLoadEdit: 1,
    reLoadAdd: 1,
    keyword: "",
    idExtend: "",
    detail: {},
    users: [] as any[],
  });

  useEffect(() => {
    if (applicationState.loading === "success")
      setApplication(applicationState.data);
  }, [applicationState.reload]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      let data: ResultObject = await fetchUserPermission({
        id: state.idExtend,
        departmentId: state.keyword,
        pageIndex: 1,
        pageSize: 10000,
      });
      if (data.success) {
        setData(data.data);
      } else {
        alert(data.message);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };
  //handle
  const handleOnSearch = () => {
    loadData();
  };
  const handleOnEdit = (event: any, rowData: any) => {
    indexReload = indexReload + 1;
    setState({
      ...state,
      showEdit: true,
      reLoadEdit: indexReload,
      detail: rowData,
    });
  };

  const handleOnAddUser = (event: any) => {
    indexReload = indexReload + 1;
    setState({
      ...state,
      showEdit: true,
      reLoadEdit: indexReload,
      detail: { userId: 'new' },
    });
  }

  const handleOnAdd = (event: any, rowData: any) => {
    const users = data.map((u: any) => u.userId);
    setState({
      ...state,
      reLoadAdd: state.reLoadAdd + 1,
      users: users,
    });
  };
  const handleOnSave = async (data: any) => {
    let rs = await updatedUserPermission(data);
    if (rs.success) {
      if (rs.data === "1") {
        toast.success(t("common.actionSuccess"));
        setState({
          ...state,
          reLoadEdit: state.reLoadEdit + 1,
          showEdit: false,
        });
      }
      else toast.warning(t('common.actionError'))

    } else {
      toast.error(rs.message);
    }
  };
  const handleOnSaveAddUser = (users: any[]) => {
    setData([...users, ...data]);
  };
  return (
    <Grid container spacing={3}>
      <Grid container item spacing={4}>
        <Grid item md={5} xs={6}>
          <TextField
            fullWidth
            onChange={(e) =>
              handleOnchange(e.target.value, "keyword", state, setState)
            }
            label={t("common.idOrName")}
            placeholder=""
          />
        </Grid>
        <Grid item md={5} xs={6}>
          <Autocomplete
            options={application}
            onChange={(e, item) =>
              handleOnchange(
                item ? item.applicationID : "",
                "idExtend",
                state,
                setState
              )
            }
            getOptionLabel={(obj: any) => obj.applicationName}
            renderInput={(params) => (
              <TextField {...params} label={t("common.application")} />
            )}
          />
        </Grid>
        <Grid item md={2} xs={12}>
          <Button
            size="large"
            fullWidth
            type="submit"
            sx={{ mr: 2, mt: 2, p: 2 }}
            variant="contained"
            onClick={handleOnSearch}
          >
            {t("common.search")}
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <MaterialTable
          title={t("application.listUser")}
          columns={[
            { title: t("common.id"), field: "userId" },
            { title: t("common.fullName"), field: "fullName" },
            { title: t("common.departmentId"), field: "departmentId" },
            { title: t("common.application"), field: "applications" },
            { title: t("menu.permissionGroup"), field: "permissions" },
            {
              title: t("common.inUse"),
              field: "inUse",
              render: (rowData: any) =>
                rowData.inUse ? (
                  <Chip label={t("common.statusInUse")} color="success" />
                ) : (
                  <Chip label={t("common.statusNoUse")} color="default" />
                ),
            },
          ]}
          data={data}
          actions={[
            {
              icon: () => <GroupAdd />,
              tooltip: t("common.addUserInApp") || "",
              isFreeAction: true,
              onClick: handleOnAdd,
            },
            {
              icon: () => <PersonAddAlt />,
              tooltip: t("common.addUser") || "",
              isFreeAction: true,
              onClick: handleOnAddUser,
            },
            {
              icon: () => <Edit />,
              tooltip: t("common.edit") || "",
              onClick: handleOnEdit,
            },
          ]}
          options={{
            paging: true,
            pageSize: 10,
            actionsColumnIndex: -1,
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <SaveUser
          show={state.showEdit}
          reload={state.reLoadEdit}
          data={state.detail}
          onSave={handleOnSave}
        />
      </Grid>
      <Grid item xs={12}>
        <AppUserInApp
          reload={state.reLoadAdd}
          users={state.users}
          onSave={handleOnSaveAddUser}
        />
      </Grid>
    </Grid>
  );
};
export default User;
