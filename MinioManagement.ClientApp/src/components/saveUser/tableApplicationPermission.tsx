import MaterialTable, { Column } from "@material-table/core";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { t } from "i18next";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { usePermission } from "src/redux/hook";
import { selectApplication } from "src/redux/slices/applicationSlice";
import { selectPermission } from "src/redux/slices/permissionSlice";

interface IProps {
  data: any[];
}
export type TableApplicationPermissionHandle = {
  get: () => any[];
};
const TableApplicationPermission = forwardRef<
  TableApplicationPermissionHandle,
  IProps
>((props, ref) => {
  useImperativeHandle(ref, () => ({
    get() {
      return permissions.filter(rs => rs.isEdit === 1);
    },
  }));
  useEffect(() => {
    setPermissions(props.data || []);
  }, [props.data]);

  usePermission();
  const applicationState = useSelector(selectApplication);
  const permissionState = useSelector(selectPermission);

  const [permissions, setPermissions] = useState<any[]>([]);

  const handleOnAddPermission = async (newData: any) => {
    const currentApp = applicationState.data.find(
      (option: any) => option.applicationID === newData.applicationId
    );
    const currentPer = permissionState.data.find(
      (option: any) => option.moduleID === newData.permissionId
    );
    setPermissions([
      ...permissions,
      {
        ...newData,
        isEdit: 1,
        applicationName: currentApp?.applicationName,
        permissionName: currentPer?.moduleName
      },
    ]);
  };
  const handleOnUpdatePermission = async (newData: any, oldData: any) => {
    const currentApp = applicationState.data.find(
      (option: any) => option.applicationID === newData.applicationId
    );
    const currentPer = permissionState.data.find(
      (option: any) => option.moduleID === newData.permissionId
    );
    const dataUpdate = [...permissions];
    const index = dataUpdate.findIndex(rs => rs.id === newData.id);
    dataUpdate[index] = {
      ...newData,
      applicationName: currentApp?.applicationName,
      permissionName: currentPer?.moduleName
    };
    setPermissions([...dataUpdate]);
  };

  const handleOnDeletePermission = async (oldData: any) => {
    const dataDelete = [...permissions];
    const index = dataDelete.findIndex((obj: any) => obj.id === oldData.id);
    dataDelete.splice(index, 1);
    setPermissions([...dataDelete]);
  };

  const handleOnChangeCheckboxPer = (e: any, permissionId: string, applicationId: string) => {
    const name = e.target.id || e.target.name;
    const value = e.target.checked;
    const dataUpdate = [...permissions];
    const indexPer = dataUpdate.findIndex(
      (option: any) => option.permissionId === permissionId && option.applicationId === applicationId
    );
    dataUpdate[indexPer] = {
      ...dataUpdate[indexPer],
      [name]: value,
    };
    setPermissions([...dataUpdate]);
  };

  const columnPermision: Column<object>[] = [
    {
      title: t("common.application"),
      field: "applicationId",
      width: 300,
      // defaultGroupOrder: 0,
      render: (rowData: any) => <span>{rowData.applicationName}</span>,
      editComponent: (props: any) => {
        return (
          <Autocomplete
            options={applicationState.data}
            onChange={(e, item) => props.onChange(item ? item.applicationID : "")}
            getOptionLabel={(obj: any) => obj.applicationName}
            value={
              applicationState.data.find(
                (option: any) =>
                  option.applicationID === props.rowData.applicationId
              ) || null
            }
            renderInput={(params) => (
              <TextField {...params} label={t("common.application")} />
            )}
          />
        );
      },
    },
    {
      title: t("menu.permission"),
      field: "permissionId",
      width: 300,
      render: (rowData: any) => <span>{rowData.permissionName}</span>,
      editComponent: (props: any) => {
        return (
          <Autocomplete
            options={permissionState.data.filter(
              (per: any) => per.applicationID === props.rowData.applicationId
            )}
            onChange={(e, item) => props.onChange(item.moduleID || "")}
            getOptionLabel={(obj: any) => obj.moduleName}
            value={
              permissionState.data.find(
                (option: any) => option.moduleID === props.rowData.permissionId
              ) || null
            }
            renderInput={(params) => (
              <TextField {...params} label={t("menu.permission")} />
            )}
          />
        );
      },
    },
    {
      title: t("permissionGroup.isInsert"),
      type: "boolean",
      field: "isInsert",
      width: 5,
      render: (rowdata: any) => (
        <Checkbox
          name="isInsert"
          checked={rowdata.isInsert}
          disabled={rowdata.isEdit === 0}
          onChange={(e) => handleOnChangeCheckboxPer(e, rowdata.permissionId, rowdata.applicationId)}
        />
      ),
    },
    {
      title: t("permissionGroup.isView"),
      type: "boolean",
      field: "isView",
      width: 5,
      render: (rowdata: any) => (
        <Checkbox
          name="isView"
          checked={rowdata.isView}
          disabled={rowdata.isEdit === 0}
          onChange={(e) => handleOnChangeCheckboxPer(e, rowdata.permissionId, rowdata.applicationId)}
        />
      ),
    },
    {
      title: t("permissionGroup.isDelete"),
      type: "boolean",
      field: "isDelete",
      width: 5,
      render: (rowdata: any) => (
        <Checkbox
          name="isDelete"
          checked={rowdata.isDelete}
          disabled={rowdata.isEdit === 0}
          onChange={(e) => handleOnChangeCheckboxPer(e, rowdata.permissionId, rowdata.applicationId)}
        />
      ),
    },
    {
      title: t("permissionGroup.isApprove"),
      type: "boolean",
      field: "isApprove",
      width: 5,
      render: (rowdata: any) => (
        <Checkbox
          name="isApprove"
          checked={rowdata.isApprove}
          disabled={rowdata.isEdit === 0}
          onChange={(e) => handleOnChangeCheckboxPer(e, rowdata.permissionId, rowdata.applicationId)}
        />
      ),
    },
    {
      title: t("permissionGroup.isUpdate"),
      type: "boolean",
      field: "isUpdate",
      width: 5,
      render: (rowdata: any) => (
        <Checkbox
          name="isUpdate"
          checked={rowdata.isUpdate}
          disabled={rowdata.isEdit === 0}
          onChange={(e) => handleOnChangeCheckboxPer(e, rowdata.permissionId, rowdata.applicationId)}
        />
      ),
    },
    {
      title: t("permissionGroup.isPrintPDF"),
      type: "boolean",
      field: "isPrintPDF",
      width: 5,
      render: (rowdata: any) => (
        <Checkbox
          name="isPrintPDF"
          checked={rowdata.isPrintPDF}
          disabled={rowdata.isEdit === 0}
          onChange={(e) => handleOnChangeCheckboxPer(e, rowdata.permissionId, rowdata.applicationId)}
        />
      ),
    },
    {
      title: t("permissionGroup.isReport"),
      type: "boolean",
      field: "isReport",
      width: 5,
      render: (rowdata: any) => (
        <Checkbox
          name="isReport"
          checked={rowdata.isReport}
          disabled={rowdata.isEdit === 0}
          onChange={(e) => handleOnChangeCheckboxPer(e, rowdata.permissionId, rowdata.applicationId)}
        />
      ),
    },
    {
      title: t("permissionGroup.isExport"),
      type: "boolean",
      field: "isExport",
      width: 5,
      render: (rowdata: any) => (
        <Checkbox
          name="isExport"
          checked={rowdata.isExport}
          disabled={rowdata.isEdit === 0}
          onChange={(e) => handleOnChangeCheckboxPer(e, rowdata.permissionId, rowdata.applicationId)}
        />
      ),
    },
  ];

  return (
    <MaterialTable
      title={t("permissionGroup.listPermission")}
      columns={columnPermision}
      data={permissions}
      editable={{
        isEditHidden: (rowData: any) => rowData.isEdit === 0,
        isDeleteHidden: (rowData: any) => rowData.isEdit === 0,
        onRowAdd: handleOnAddPermission,
        onRowUpdate: handleOnUpdatePermission,
        onRowDelete: handleOnDeletePermission,
      }}
      options={{
        addRowPosition: "first",
        //grouping: true,
        paging: true,
        pageSize: 10,
        actionsColumnIndex: -1,
      }}
    />
  );
});

export default TableApplicationPermission;
