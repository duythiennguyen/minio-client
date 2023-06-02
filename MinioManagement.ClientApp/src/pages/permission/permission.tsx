import MaterialTable from "@material-table/core";
import { Autocomplete, Button, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux"
import { handleOnchange } from "src/commons/handle";
import SavePermission from "src/components/savePermission/savePermission";
import { useApplication } from "src/redux/hook";
import { selectApplication } from "src/redux/slices/applicationSlice";
import { fetchPermission, selectPermission, deletePermission, updatePermission } from "src/redux/slices/permissionSlice";
import { useAppDispatch } from "src/redux/store";
import { Edit, Delete, Add } from "@mui/icons-material";
import { toast } from "react-toastify";

let indexReload = 1
const Permission = () => {
  useApplication()

  const { t } = useTranslation();

  const permissionState = useSelector(selectPermission)
  const applicationState = useSelector(selectApplication)

  const dispatch = useAppDispatch()
  const [data, setData] = useState([])
  const [application, setApplication] = useState([])
  const [state, setState] = useState({
    showEdit: false,
    reLoadEdit: 1,
    keyword: '',
    idExtend: '',
    detail: {},

  })

  useEffect(() => {
    if (permissionState.loading === 'success'){
      setData(permissionState.data)
      setState({ ...state, showEdit: false, reLoadEdit: state.reLoadEdit + 1 })
    }
  }, [permissionState.reload])

  useEffect(() => {
    setApplication(applicationState.data)
  }, [applicationState])

  useEffect(() => {
    if (data.length === 0)
      loadData()
  }, [])


  const loadData = () => {
    const filter: any = {
      keyword: state.keyword,
      idExtend: state.idExtend,
      pageIndex: 1,
      pageSize: 100000
    }
    dispatch(fetchPermission(filter))
  }

  //handle
  const handleOnSearch = () => {
    loadData()
  }

  const handleOnSave = (objData: any) => {
    // kiem tra id đã tồn tại
    if (Object.keys(state.detail).length === 0 && data.some((rs: any) => rs.moduleID === objData.moduleID)) {
      toast.warning(t('common.permissionIdIsExist'))
      return
    }
    dispatch(updatePermission(objData))
  }
  const handleOnDelete = (event: any, rowData: any) => {
    // show thông báo xác nhận
    if (confirm(t('common.actionDelete') + ` "${rowData.moduleName}"?`) == true) {
      dispatch(deletePermission(rowData.moduleID))
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
          title={t('permission.titleTable')}
          columns={[
            { title: t('common.id'), field: 'moduleID' },
            { title: t('common.name'), field: 'moduleName' },
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
              onClick: handleOnDelete
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
        <SavePermission
          show={state.showEdit}
          reload={state.reLoadEdit}
          data={state.detail}
          onSave={handleOnSave} />
      </Grid>
    </Grid>
  )
}
export default Permission