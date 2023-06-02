import MaterialTable from "@material-table/core";
import { Grid, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux"
import { fetchAplication, deleteAplication, updateAplication, selectApplication } from "src/redux/slices/applicationSlice";
import { useAppDispatch } from "src/redux/store";
import { Edit, Delete, Add } from "@mui/icons-material";
import { toast } from "react-toastify";
import SaveApplication from "src/components/saveApplication/saveApplication";
import moment from "moment";

let indexReload = 1
const Application = () => {

  const { t } = useTranslation();

  const applicationState = useSelector(selectApplication)

  const dispatch = useAppDispatch()
  const [data, setData] = useState([])
  const [state, setState] = useState({
    showEdit: false,
    reLoadEdit: 1,
    keyword: '',
    idExtend: '',
    detail: {}
  })
  useEffect(() => {
    if(applicationState.loading === 'success'){
      setData(applicationState.data)
      setState({ ...state, showEdit: false, reLoadEdit: state.reLoadEdit + 1 })
    }
  }, [applicationState.reload])

  useEffect(() => {
    if (data.length === 0)
      loadData()
  }, [])


  const loadData = () => {
    dispatch(fetchAplication())
  }

  //handle
  const handleOnSave = (objData: any) => {
    // kiểm tra id đã tồn tại
    if (Object.keys(state.detail).length === 0 && data.some((rs: any) => rs.applicationID === objData.applicationID)) {
      toast.warning(t('common.applicationIdIsExist'))
      return
    }
    dispatch(updateAplication(objData))
  }
  const handleOnDelete = (event: any, rowData: any) => {
    // show thông báo xác nhận
    if (confirm(t('common.actionDelete') + ` "${rowData.applicationName}"?`) == true) {
      dispatch(deleteAplication(rowData.applicationID))
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
      <Grid item xs={12}>
        <MaterialTable
          title={t('application.titleTable')}
          columns={[
            { title: t('application.name'), field: 'applicationName', width: 150 },
            { title: t('common.id'), field: 'applicationID', width: 50 },
            { title: t('application.moduleName'), field: 'applicationName', width: 150 },
            { title: t('common.description'), field: 'description', width: 200 },
            {
              title: t('common.status'), field: 'inUse', width: 50,
              render: (rowData: any) => (rowData.inUse === 1
                ? (<Chip label={t('common.statusInUse')} color="success" />)
                : (<Chip label={t('common.statusNoUse')} color="default" />))
            },
            {
              title: t('common.createdDate'), field: 'updatedDate', width: 100,
              render: (rowData: any) => <span>{rowData.updatedDate && moment(rowData.updatedDate).format('DD/MM/YYYY')}</span>
            },
            { title: t('common.createdUser'), field: 'updatedUser', width: 100 },
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
        <SaveApplication
          show={state.showEdit}
          reload={state.reLoadEdit}
          data={state.detail}
          onSave={handleOnSave} />
      </Grid>
    </Grid>
  )
}
export default Application