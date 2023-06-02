import MaterialTable, { Column } from "@material-table/core";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { t } from "i18next";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { usePermission } from "src/redux/hook";
import { selectPermission } from "src/redux/slices/permissionSlice";

interface IProps {
    data: any[],
    applicationId: any,
    reload: number
}
export type TablePermissionHandle = {
    get: () => any[],
}
const TablePermission = forwardRef<TablePermissionHandle, IProps>((props, ref) => {

    useImperativeHandle(ref, () => ({
        get() {
            return permissions
        }
    }))
    useEffect(() => {
        const newData = (props.data || [])
        setPermissions(newData)
        //filter select
        const perIds = newData.map((u: any) => u.id)
        const selectFiltter = permissionState.data.filter((user: any) => perIds.indexOf(user.moduleID) === -1)
        setSelectPer(selectFiltter)
    }, [props.reload])
    usePermission();

    const permissionState = useSelector(selectPermission)
    const [selectPer, setSelectPer] = useState<any[]>([])
    const [permissions, setPermissions] = useState<any[]>([])

    const handleOnAddPermission = async (newData: any) => {
        if (!newData.id || newData.id === '') {
            toast.warning(t('message.permissionChooseRequired'))
            return
        }
        const currentPer = permissionState.data.find((option: any) => option.moduleID === newData.id)
        setSelectPer(selectPer.filter((rs: any) => rs.moduleID !== newData.id))
        setPermissions([{
            ...newData,
            name: currentPer.moduleName
        }, ...permissions])
    }
    const handleOnUpdatePermission = async (newData: any, oldData: any) => {
        if (!newData.id || newData.id === '') {
            toast.warning(t('message.permissionChooseRequired'))
            return
        }
        const currentPer = permissionState.data.find((option: any) => option.moduleID === newData.id)
        const dataUpdate = [...permissions];
        const index = oldData.tableData.id;
        dataUpdate[index] = {
            ...newData,
            name: currentPer.moduleName
        };
        setPermissions([...dataUpdate]);
    }
    const handleOnDeletePermission = async (oldData: any) => {
        const dataDelete = [...permissions];
        const index = dataDelete.findIndex((obj: any) => obj.moduleID === oldData.id);
        dataDelete.splice(index, 1);
        setPermissions([...dataDelete]);
        setSelectPer([{ moduleID: oldData.moduleID, moduleName: oldData.moduleName }, ...selectPer])
    }
    const handleOnChangeCheckboxPer = (e: any, permissionId: string) => {
        const name = e.target.id || e.target.name;
        const value = e.target.checked;
        const dataUpdate = [...permissions];
        const indexPer = dataUpdate.findIndex((option: any) => option.id === permissionId)

        dataUpdate[indexPer] = {
            ...dataUpdate[indexPer],
            [name]: value
        };
        setPermissions([...dataUpdate]);
    }
    const columnPermision: Column<object>[] =
        [
            {
                title: t('common.name'),
                field: 'id',
                width: 300,
                render: (rowData: any) => (<span>{rowData.name}</span>),
                editComponent: (props: any) => {
                    return <Autocomplete
                        options={selectPer}
                        onChange={(e, item) => props.onChange(item ? item.moduleID : '')}
                        getOptionLabel={(obj: any) => obj.moduleName}
                        value={permissionState.data.find((option: any) => option.moduleID === props.rowData.id) || null}
                        renderInput={params => <TextField {...params} label={t('menu.permission')} />
                        } />;
                }
            },
            {
                title: t('permissionGroup.isInsert'),
                type: 'boolean',
                field: 'isInsert',
                width: 5,
                render: (rowdata: any) => (
                    <Checkbox name="isInsert"
                        checked={rowdata.isInsert}
                        onChange={(e) => handleOnChangeCheckboxPer(e, rowdata.id)} />
                )
            },
            {
                title: t('permissionGroup.isView'),
                type: 'boolean',
                field: 'isView',
                width: 5,
                render: (rowdata: any) => (
                    <Checkbox name="isView"
                        checked={rowdata.isView}
                        onChange={(e) => handleOnChangeCheckboxPer(e, rowdata.id)} />
                )
            },
            {
                title: t('permissionGroup.isDelete'),
                type: 'boolean',
                field: 'isDelete',
                width: 5,
                render: (rowdata: any) => (
                    <Checkbox name="isDelete"
                        checked={rowdata.isDelete}
                        onChange={(e) => handleOnChangeCheckboxPer(e, rowdata.id)} />
                )
            },
            {
                title: t('permissionGroup.isApprove'),
                type: 'boolean',
                field: 'isApprove',
                width: 5,
                render: (rowdata: any) => (
                    <Checkbox name="isApprove"
                        checked={rowdata.isApprove}
                        onChange={(e) => handleOnChangeCheckboxPer(e, rowdata.id)} />
                )
            },
            {
                title: t('permissionGroup.isUpdate'),
                type: 'boolean',
                field: 'isUpdate',
                width: 5,
                render: (rowdata: any) => (
                    <Checkbox name="isUpdate"
                        checked={rowdata.isUpdate}
                        onChange={(e) => handleOnChangeCheckboxPer(e, rowdata.id)} />
                )
            },
            {
                title: t('permissionGroup.isPrintPDF'),
                type: 'boolean',
                field: 'isPrintPDF',
                width: 5,
                render: (rowdata: any) => (
                    <Checkbox name="isPrintPDF"
                        checked={rowdata.isPrintPDF}
                        onChange={(e) => handleOnChangeCheckboxPer(e, rowdata.id)} />
                )
            },
            {
                title: t('permissionGroup.isReport'),
                type: 'boolean',
                field: 'isReport',
                width: 5,
                render: (rowdata: any) => (
                    <Checkbox name="isReport"
                        checked={rowdata.isReport}
                        onChange={(e) => handleOnChangeCheckboxPer(e, rowdata.id)} />
                )
            },
            {
                title: t('permissionGroup.isExport'),
                type: 'boolean',
                field: 'isExport',
                width: 5,
                render: (rowdata: any) => (
                    <Checkbox name="isExport"
                        checked={rowdata.isExport}
                        onChange={(e) => handleOnChangeCheckboxPer(e, rowdata.id)} />
                )
            }]

    return <MaterialTable
        title={t('permissionGroup.listPermission')}
        columns={columnPermision}
        data={permissions}
        editable={{
            onRowAdd: handleOnAddPermission,
            onRowUpdate: handleOnUpdatePermission,
            onRowDelete: handleOnDeletePermission,
        }}
        options={{
            addRowPosition: "first",
            paging: true,
            pageSize: 10,
            actionsColumnIndex: -1
        }}
    />
})

export default TablePermission