import MaterialTable, { Column } from "@material-table/core";
import { Add, Edit } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Checkbox, TextField, Autocomplete, FormControlLabel } from "@mui/material"
import { t } from "i18next";
import { Delete } from "mdi-material-ui";
import React, { useEffect } from "react";
import { useState } from "react"
import { Transition } from "src/commons/handle/transitionModal";

import { handleOnchange, handleOnClickCheckbox } from "src/commons/handle";
import * as ApplicationApi from 'src/apis/applicationApi'
import { toast } from "react-toastify";
import { useUser } from "src/redux/hook";
import { useSelector } from "react-redux";
import { selectUsers } from "src/redux/slices/userSlice";
import { selectApplication } from "src/redux/slices/applicationSlice";
//import { getLanguageByMRT } from "src/commons/helpers/language";

const SaveApplication = (props: any) => {
    useUser()
    const userState = useSelector(selectUsers)
    const applicationState = useSelector(selectApplication)
    const [state, setState] = useState({
        show: false,
        applicationID: '',
        applicationName: '',
        url: '',
        description: '',
        users: [],
        inUse: 1,
        isCachePermission: 0
    })
    const [users, setUsers] = useState<any[]>([])
    const [selectUser, setSelectUser] = useState<any[]>([])

    useEffect(() => {
        if (userState.data && userState.data.length > 0) {
            setSelectUser(userState.data)
        }
    }, [userState.data])

    useEffect(() => {
        if (props.data.applicationID !== state.applicationID)
            loadUserByApplication(props.data.applicationID)
        if (!props.data.applicationID || props.data.applicationID === '') {
            setState({
                show: props.show || false,
                applicationID: '',
                applicationName: '',
                url: '',
                description: '',
                users: [],
                inUse: 1,
                isCachePermission: 0
            })
            setUsers([])
        }
        else setState({ ...state, ...props.data, show: props.show || false, })

    }, [props.reload])

    const loadUserByApplication = (appId: string) => {
        if (appId && appId !== '') {
            ApplicationApi
                .fetchAplicationUser(appId)
                .then((rs: any) => {
                    if (!rs.success) {
                        toast.error(rs.message)
                    }
                    else {
                        setUsers(rs.data)
                        const userIds = rs.data.map((u: any) => u.userId)
                        const selectFiltter = selectUser.filter((user: any) => userIds.indexOf(user.id) === -1)
                        setSelectUser(selectFiltter)
                    }
                })
        }
    }
    //handle
    const handleClose = () => {
        setState({ ...state, show: false })
    }
    const handleSave = () => {
        // validate dữ liệu
        if (state.applicationID === '' || state.applicationName === '') {
            toast.warning(t('common.required'))
            return
        }
        // kiểm tra dữ liệu có bị trung user không?
        let userArr: any[] = []
        let isStop = false
        users.forEach((obj: any) => {
            if (userArr.indexOf(obj.userId) === -1) {
                userArr.push(obj.userId)
            }
            else {
                isStop = true
                toast.warning(`${t('common.duplicate')} : ${obj.userId} - ${obj.fullName}`)
            }
            delete obj["user"]
        })
        if (isStop)
            return false;

        const modelSave = {
            ...state,
            applicationUsers: users
        }
        props.onSave(modelSave)
    }

    const handleOnAddUser = async (newData: any) => {
        if (Array.isArray(newData.user)) {


            const userAdds = newData.user.map((obj: any) => {
                return {
                    userId: obj.id,
                    fullName: obj.fullName || '',
                    applicationId: state.applicationID,
                    isEditPermission: newData.editPermission ? 1 : 0,
                    isEditPermissionGroup: newData.editPermissionGroup ? 1 : 0,
                    isEditUser: newData.isEditUser ? 1 : 0,
                    user: obj
                }
            })
            setUsers([...userAdds, ...users])
            //filter select
            const userIds = newData.user.map((u: any) => u.id)
            const selectFiltter = selectUser.filter((user: any) => userIds.indexOf(user.id) === -1)
            setSelectUser(selectFiltter)
        }
    }
    const handleOnUpdateUser = async (newData: any, oldData: any) => {
        const dataUpdate = [...users];
        const index = oldData.tableData.id;
        dataUpdate[index] = {
            ...newData,
            userId: newData.user.id,
            fullName: newData.user.fullName || '',
            applicationId: state.applicationID,
            isEditPermission: newData.editPermission ? 1 : 0,
            isEditPermissionGroup: newData.editPermissionGroup ? 1 : 0,
            isEditUser: newData.isEditUser ? 1 : 0
        };
        setUsers([...dataUpdate]);
    }
    const handleOnDeleteUser = async (oldData: any) => {
        const dataDelete = [...users];
        const index = dataDelete.findIndex((obj: any) => obj.userId === oldData.userId);
        if (index !== -1)
            setUsers([...users.slice(0, index), ...users.slice(index + 1),])

        setSelectUser([{ id: oldData.userId, fullName: oldData.fullName }, ...selectUser])
    }

    const handleOnChangeCheckbox = (e: any, userId: string) => {
        const name = e.target.id || e.target.name;
        const value = e.target.checked ? 1 : 0;
        const dataUpdate = [...users];
        const index = dataUpdate.findIndex((option: any) => option.userId === userId)

        dataUpdate[index] = {
            ...dataUpdate[index],
            [name]: value
        };
        setUsers([...dataUpdate]);
    }
    const columns: Column<object>[] =
        [
            {
                title: t('common.name'),
                field: 'user',
                width: 300,
                render: (rowData: any) => (<span>{`${rowData.userId} - ${rowData.fullName}`}</span>),
                editComponent: (props: any) => {
                    return (props.rowData.userId ?
                        (<Autocomplete
                            options={selectUser}
                            onChange={(e, item) => props.onChange(item)}
                            getOptionLabel={(obj: any) => `${obj.id} - ${obj.fullName}`}
                            value={props.rowData.user ? props.rowData.user : selectUser.find((option) => option.id === props.rowData.userId)}
                            renderInput={params => <TextField {...params} label={t('common.account')} />
                            } />)
                        : (<Autocomplete
                            options={selectUser}
                            multiple
                            disableCloseOnSelect
                            onChange={(e, item) => props.onChange(item)}
                            getOptionLabel={(obj: any) => `${obj.id} - ${obj.fullName}`}
                            renderInput={params => <TextField {...params} label={t('common.account')} />
                            } />
                        )
                    );
                }
            },
            {
                title: t('application.isEditUser'),
                type: 'boolean',
                field: 'isEditUser',
                width: 5,
                render: (rowdata: any) => (
                    <Checkbox name="isEditUser"
                        checked={rowdata.isEditUser === 1}
                        onChange={(e) => handleOnChangeCheckbox(e, rowdata.userId)} />
                )
            },
            {
                title: t('application.isEditPermission'),
                field: 'editPermission',
                type: 'boolean',
                width: 5,
                render: (rowdata: any) => (
                    <Checkbox name="isEditPermission"
                        checked={rowdata.isEditPermission === 1}
                        onChange={(e) => handleOnChangeCheckbox(e, rowdata.userId)} />
                )
            },
            {
                title: t('application.isEditPermissionGroup'),
                type: 'boolean',
                field: 'editPermissionGroup',
                width: 5,
                render: (rowdata: any) => (
                    <Checkbox name="isEditPermissionGroup"
                        checked={rowdata.isEditPermissionGroup === 1}
                        onChange={(e) => handleOnChangeCheckbox(e, rowdata.userId)} />
                )
            },]

    return (
        <Dialog
            open={state.show}
            TransitionComponent={Transition}
            keepMounted
            fullWidth={true}
            scroll='paper'
            maxWidth='lg'
            onClose={handleClose}
        >
            <DialogTitle>{t('application.editModel')}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} >
                    <Grid item container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                required
                                label={t('common.id')}
                                onChange={(e: any) => handleOnchange(e.target.value, 'applicationID', state, setState)}
                                value={state.applicationID}
                                placeholder={t('common.pleaseEnter') || ''}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                required
                                label={t('common.name')}
                                onChange={(e: any) => handleOnchange(e.target.value, 'applicationName', state, setState)}
                                value={state.applicationName}
                                placeholder={t('common.pleaseEnter') || ''}
                            />
                        </Grid>
                        <Grid item md={8} xs={12}>
                            <TextField
                                fullWidth
                                label={t('common.url')}
                                onChange={(e: any) => handleOnchange(e.target.value, 'url', state, setState)}
                                value={state.url}
                                placeholder={t('common.pleaseEnter') || ''}
                            />
                        </Grid>
                        <Grid item md={2} xs={6}>
                            <FormControlLabel control={<Checkbox
                                checked={state.inUse === 1}
                                name="inUse"
                                onChange={(e) => handleOnClickCheckbox(e, state, setState)} />}
                                label={t('common.statusInUse')} />
                        </Grid>
                        <Grid item md={2} xs={6}>
                            <FormControlLabel control={<Checkbox
                                checked={state.isCachePermission === 1}
                                name="isCachePermission"
                                onChange={(e) => handleOnClickCheckbox(e, state, setState)} />}
                                label={t('application.isCachePermission')} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                onChange={(e: any) => handleOnchange(e.target.value, 'description', state, setState)}
                                value={state.description}
                                label={t('common.description')}
                                placeholder={t('common.pleaseEnter') || ''}
                            />
                        </Grid>
                    </Grid>
                    <Grid item container>
                        <Grid item md={12}>
                            <MaterialTable
                                title={t('application.listUser')}
                                columns={columns}
                                data={users}
                                editable={{
                                    onRowAdd: handleOnAddUser,
                                    onRowUpdate: handleOnUpdateUser,
                                    onRowDelete: handleOnDeleteUser,
                                }}
                                options={{
                                    addRowPosition: "first",
                                    paging: true,
                                    pageSize: 10,
                                    actionsColumnIndex: -1
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{t('common.close')}</Button>
                <Button variant="contained" onClick={handleSave}>{t('common.save')}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default SaveApplication