
import MaterialTable, { Column } from "@material-table/core";
import { Autocomplete, TextField } from "@mui/material";
import { t } from "i18next";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { useUser } from "src/redux/hook";
import { selectUsers } from "src/redux/slices/userSlice";

interface IProps {
    data: any[],
    reload: number
}
export type TableUserHandle = {
    get: () => any[],
}
const TableUser = forwardRef<TableUserHandle, IProps>((props, ref) => {
    useImperativeHandle(ref, () => ({
        get() {
            return users
        }
    }))


    useUser();
    const [users, setUsers] = useState<any[]>([])
    const userState = useSelector(selectUsers)
    const [selectUser, setSelectUser] = useState<any[]>([])

    useEffect(() => {
        if (userState.data && userState.data.length > 0) {
            setSelectUser(userState.data)
        }
    }, [userState.data])

    useEffect(() => {
        const newData =(props.data || [])
        setUsers(newData)
        //filter select
        const userIds =newData.map((u: any) => u.userId)
        const selectFiltter = selectUser.filter((user: any) => userIds.indexOf(user.id) === -1)
        setSelectUser(selectFiltter)
    }, [props.reload])

    const columnUser: Column<object>[] =
        [{
            title: t('common.name'),
            field: 'user',
            width: 300,
            render: (rowData: any) => (<span>{`${rowData.userId} - ${rowData.name}`}</span>),
            editComponent: (props: any) => {
                return (props.rowData.userId ?
                    (<Autocomplete
                        options={selectUser}
                        onChange={(e, item) => props.onChange(item)}
                        getOptionLabel={(obj: any) => `${obj.id} - ${obj.fullName}`}
                        value={props.rowData.user ? props.rowData.user : selectUser.find((option: any) => option.id === props.rowData.userId)}
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
        }]


    const handleOnAddUser = async (newData: any) => {
        if (Array.isArray(newData.user)) {
            const userAdds = newData.user.map((obj: any) => {
                return {
                    userId: obj.id,
                    name: obj.fullName || '',
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
            userId: newData.user.id,
            name: newData.user.fullName,
            user: newData.user
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

    return <MaterialTable
        title={t('application.listUser')}
        columns={columnUser}
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
})
export default TableUser