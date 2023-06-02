import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Slide, TextField } from "@mui/material"
import { t } from "i18next";
import React, { useEffect } from "react";
import { useState } from "react"
import { useSelector } from "react-redux";

import { Transition } from "src/commons/handle/transitionModal";
import { useDepartment } from "src/redux/hook";
import { selectDepartments } from "src/redux/slices/departmentSlice";
import { handleOnchange } from "src/commons/handle";
import { selectApplication } from "src/redux/slices/applicationSlice";
import { toast } from "react-toastify";
const SavePermission = (props: any) => {
    useDepartment();

    const departmentState = useSelector(selectDepartments)
    const applicationState = useSelector(selectApplication)
    const [department, setDepartment] = useState<any[]>([])
    const [state, setState] = useState({
        isEdit: false,
        show: false,
        applicationID: '',
        moduleID: '',
        moduleName: '',
        departmentID: '',
        bpApprove: '',
        qcApprove: '',
        description: '',
        selectApp: null
    })

    useEffect(() => {
        if (departmentState.loading === 'success') {
            setDepartment(departmentState.data)
        }
    }, [departmentState])

    useEffect(() => {
        if (props.data.moduleID && props.data.moduleID !== '') {
            const selectApp = applicationState.data.find((obj: any) => obj.applicationID === props.data.applicationID)
            setState({
                show: props.show,
                isEdit: true,
                ...props.data,
                selectApp: selectApp
            })
        }
        else setState({
            isEdit: false,
            show: props.show,
            applicationID: '',
            moduleID: '',
            moduleName: '',
            departmentID: '',
            bpApprove: '',
            qcApprove: '',
            description: '',
            selectApp: null
        })
    }, [props.reload])

    useEffect(() => {
        setDepartment(departmentState.data)
    }, [departmentState])

    //handle
    const handleClose = () => {
        setState({ ...state, show: false })
    }

    const handleSave = () => {
        //validate 
        if (state.moduleID === '' || state.moduleName === '' || state.applicationID === '') {
            toast.warning(t('common.required'))
            return
        }
        const model = {
            id: state.moduleID,
            name: state.moduleName,
            applicationId: state.applicationID,
            description: state.description,
            departmentId: state.departmentID,
            bpApprove: state.bpApprove,
            qcApprove:state.qcApprove,
            inUse:1
        }
        props.onSave(model)
    }
    const handleOnChangeDepartment = (e: any, data: any) => {
        const ids = data.map((obj: any) => obj.id)
        setState({ ...state, departmentID: ids.join() })
    }
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
            <DialogTitle>{t('permission.editModel')}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} >
                    <Grid item container spacing={3}>
                        <Grid item md={4}>
                            <Autocomplete
                                options={applicationState.data}
                                value={state.selectApp}
                                onChange={(e, item) => {
                                    setState({
                                        ...state,
                                        applicationID: item.applicationID,
                                        selectApp: item
                                    })
                                }}
                                getOptionLabel={(obj: any) => obj.applicationName}
                                renderInput={params => <TextField {...params} label={t('common.application')} required={true} />
                                } />
                        </Grid>
                        <Grid item md={4}>
                            <TextField
                                required={true}
                                disabled={state.isEdit}
                                fullWidth
                                label={t('common.id')}
                                value={state.moduleID}
                                onChange={(e) => handleOnchange(e.target.value, 'moduleID', state, setState)}
                                placeholder={t('common.pleaseEnter') || ''}
                            />
                        </Grid>
                        <Grid item md={4}>
                            <TextField
                                required={true}
                                fullWidth
                                label={t('common.name')}
                                value={state.moduleName}
                                onChange={(e) => handleOnchange(e.target.value, 'moduleName', state, setState)}
                                placeholder={t('common.pleaseEnter') || ''}
                            />
                        </Grid>
                        <Grid item md={4}>
                            <Autocomplete
                                options={department}
                                multiple={true}
                                value={department.filter((obj: any) => (state.departmentID || '').indexOf(obj.id) !== -1)}
                                onChange={handleOnChangeDepartment}
                                getOptionLabel={(obj: any) => obj.name}
                                renderInput={params => <TextField {...params} label={t('common.departmentId')} />
                                } />
                        </Grid>
                        <Grid item md={4}>
                            <TextField
                                fullWidth
                                value={state.bpApprove}
                                onChange={(e) => handleOnchange(e.target.value, 'bpApprove', state, setState)}
                                label={t('common.HeadOfDepartment')}
                                placeholder={t('common.pleaseEnter') || ''}
                            />
                        </Grid>
                        <Grid item md={4}>
                            <TextField
                                fullWidth
                                value={state.qcApprove}
                                onChange={(e) => handleOnchange(e.target.value, 'qcApprove', state, setState)}
                                label={t('permission.userQC')}
                                placeholder={t('common.pleaseEnter') || ''}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                value={state.description}
                                onChange={(e) => handleOnchange(e.target.value, 'description', state, setState)}
                                label={t('common.description')}
                                placeholder={t('common.pleaseEnter') || ''}
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

export default SavePermission