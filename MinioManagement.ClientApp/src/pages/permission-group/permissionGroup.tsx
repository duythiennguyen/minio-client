import MaterialTable from "@material-table/core";
import { Autocomplete, Button, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux"
import { handleOnchange } from "src/commons/handle";
import SavePermissionGroup from "src/components/savePermissionGroup/savePermissionGroup";
import { useApplication } from "src/redux/hook";
import { selectApplication } from "src/redux/slices/applicationSlice";
import { deletePermissionGroup, fetchPermissionGroup, selectPermissionGroup, updatePermissionGroup } from "src/redux/slices/permissionGroupSlice";
import { useAppDispatch } from "src/redux/store";
import { Edit, Delete, Add } from "@mui/icons-material";
import { toast } from "react-toastify";
let indexReload = 1
const PermissionGroup = () => {
  useApplication()

  const { t } = useTranslation();

  const permissionGroupState = useSelector(selectPermissionGroup)
  const applicationState = useSelector(selectApplication)

  const dispatch = useAppDispatch()
  const [data, setData] = useState([])
  const [application, setApplication] = useState([])
  const [state, setState] = useState({
    showEdit: false,
    reLoadEdit: 1,
    keyword: '',
    idExtend: '',
    detail: {}
  })

  useEffect(() => {
    if (permissionGroupState.loading === 'success') {
      setData(permissionGroupState.data)
      setState({ ...state, showEdit: false, reLoadEdit: state.reLoadEdit + 1 })
    }
  }, [permissionGroupState.reload])

  useEffect(() => {
    setApplication(applicationState.data)
  }, [applicationState])


  useEffect(() => {
    if (data.length === 0)
      loadData()
  }, [])


  const loadData = () => {
    dispatch(fetchPermissionGroup({
      inUse: 2,
      pageIndex: 1,
      pageSize: 100000,
      keyword: state.keyword,
      idExtend: state.idExtend,
    }))
  }

  //handle
  const handleOnSearch = () => {
    loadData()
  }
  const handleOnSave = (objData: any) => {
    // kiem tra id đã tồn tại
    if (Object.keys(state.detail).length === 0 && data.some((rs: any) => rs.permissionID === objData.id)) {
      toast.warning(t('common.permissionGroupIdIsExist'))
      return
    }
    dispatch(updatePermissionGroup(objData))
  }
  const handleOnDelete = (event: any, rowData: any) => {
    // show thông báo xác nhận
    if (confirm(t('common.actionDelete') + ` "${rowData.permissionName}"?`) == true) {
      dispatch(deletePermissionGroup(rowData.permissionID))
    }
  }
  const handleOnEdit = (event: any, rowData: any) => {
    indexReload = indexReload + 1
    setState({
      ...state,
      showEdit: true,
      reLoadEdit: indexReload,
      detail: rowData
    })
  }
  const handleOnAdd = (event: any, rowData: any) => {
    setState({
      ...state,
      showEdit: true,
      reLoadEdit: state.reLoadEdit + 1,
      detail: {}
    })
  }
  return (
    <Grid container spacing={3}>
      <Grid container item spacing={4}>
        <Grid item md={5} xs={6}>
          <TextField
            fullWidth
            onChange={(e) => handleOnchange(e.target.value, 'keyword', state, setState)}
            label={t('common.idOrName')}
            placeholder='' />
        </Grid>
        <Grid item md={5} xs={6}>
          <Autocomplete
            options={application}
            onChange={(e, item) => handleOnchange(item ? item.applicationID : '', 'idExtend', state, setState)}
            getOptionLabel={(obj: any) => obj.applicationName}
            renderInput={params => <TextField {...params} label={t('common.application')} />
            } />
        </Grid>
        <Grid item md={2} xs={12}>
          <Button size='large'
            fullWidth
            type='submit'
            sx={{ mr: 2, mt: 2, p: 2 }}
            variant='contained'
            onClick={handleOnSearch}>
            {t('common.search')}
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <MaterialTable
          title={t('permissionGroup.titleTable')}
          columns={[
            { title: t('common.id'), field: 'permissionID' },
            { title: t('common.name'), field: 'permissionName' },
            { title: t('common.application'), field: 'applicationName' },
            { title: t('common.description'), field: 'description' },
          ]}
          data={data}
          actions={[
            {
              icon: () => <Add />,
              tooltip: t('common.add') || '',
              isFreeAction: true,
              onClick: handleOnAdd
            },
            {
              icon: () => <Edit />,
              tooltip: t('common.edit') || '',
              onClick: handleOnEdit
            },
            {
              icon: () => <Delete />,
              tooltip: t('common.delete') || '',
              onClick: handleOnDelete,
            }
          ]}
          options={{
            paging: true,
            pageSize: 10,
            actionsColumnIndex: -1
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <SavePermissionGroup
          show={state.showEdit}
          reload={state.reLoadEdit}
          data={state.detail}
          onSave={handleOnSave} />
      </Grid>
    </Grid>
  )
}
export default PermissionGroup