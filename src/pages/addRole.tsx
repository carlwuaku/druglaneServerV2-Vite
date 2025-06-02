import React, { useEffect, useRef, useState } from 'react'
import { useFormik, FormikErrors, } from 'formik';

import { getData, postData } from '@/utils/network';
import { GET_SERVER_URL, SERVER_URL_RECEIVED } from '@/utils/stringKeys';
import { ipcRenderer } from 'electron';
import { getPermissionsResponse, saveRoleResponse, saveSettingsResponse } from '../models/axiosResponse';
import { Button, Card, CardContent, Checkbox, TextField } from '@mui/material';
import Header from '../components/Header';
import { Permissions } from '../models/permissions';
import Loading from '../components/Loading';
import { useNavigate, useParams } from 'react-router-dom';
import { IRoles } from '../models/roles';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useSnackbar } from '@/global/SnackbarContext';

const AddRole = () => {
    const auth = useAuthUser<{ token: string }>();
    const history = useNavigate();
    const [loading, setLoading] = useState(false)
    const serverUrl = useRef("");
    const [permissions, setPermissions] = useState<Permissions[]>([])
    const selectedPermissions = useRef<string[]>([]);
    const [loadingPermissions, setLoadingPermissions] = useState<boolean>(false)
    const { id } = useParams();
    const [rolePermissions, setRolePermissions] = useState<Permissions[]>([])
    const [loadedExistingRole, setLoadedExistingRole] = useState<boolean>(false);

    const onPermissionChange = (e: any) => {
        const id = e.target.value
        console.log(id, e.target.checked)
        if (e.target.checked) {
            selectedPermissions.current = [...selectedPermissions.current, id]
        }
        else {
            selectedPermissions.current.splice(selectedPermissions.current.indexOf(id), 1);
        }
        // let _selectedPermissions:string[] = [];
        // if (selectedPermissions.indexOf(id) === -1) {
        //     _selectedPermissions = [...selectedPermissions, id];
        // }
        // else {
        //     //remove it
        //     let _selectedPermissions = [...selectedPermissions];
        //     _selectedPermissions = _selectedPermissions.filter(permission => permission !== id);
        // }
        formik.setFieldValue('selectedPermissions', selectedPermissions.current);
        // setSelectedPermissions(_selectedPermissions);

        console.log('selected', formik.values.selectedPermissions)
    };

    const formik = useFormik<IRoles>({
        initialValues: {
            role_name: '',
            description: '',
            Permissions: [],
            role_id: '',
            selectedPermissions: []
        },
        validate: (values: IRoles) => {
            let errors: FormikErrors<IRoles> = {};
            if (!values.role_name) {
                errors.role_name = 'The name is required';
            }
            if (!values.description) {
                errors.description = 'A description is required';
            }
            return errors;
        },
        onSubmit: async (data) => {

            //validate and emit data to parent
            try {
                setLoading(true);
                let response = await postData<saveRoleResponse>({
                    url: `${serverUrl.current}/api_admin/saveRole`,
                    formData: data, token: auth?.token
                });
                showSuccess('Role added successfully');
                setLoading(false);
                history('/roles');
                //go back to roles
            } catch (error) {
                showError(`error occurred: ${error}`);
                setLoading(false);
            }
            // ipcRenderer.send(CALL_ACTIVATION, data.code)
        }
    });

    useEffect(() => {

        const handleServerUrlReceived = async (event: any, data: any) => {
            serverUrl.current = data.data;
            try {
                setLoadingPermissions(true);
                let response = await getData<Permissions[]>({ url: `${data.data}/api_admin/allPermissions`, token: auth?.token });
                setPermissions(response.data)
                setLoadingPermissions(false);
            } catch (error) {
                showError(`error occurred getting permissions: ${error}`);
                setLoadingPermissions(false);
            }
            if (id) {
                loadExistingRole();
            }
            else {
                setLoadedExistingRole(true)
            }
        };

        ipcRenderer.send(GET_SERVER_URL);

        ipcRenderer.on(SERVER_URL_RECEIVED, handleServerUrlReceived)

        return () => {
            ipcRenderer.removeListener(SERVER_URL_RECEIVED, handleServerUrlReceived);
        };
    }, [id, serverUrl]);



    const snackbar = useSnackbar();

    const showSuccess = (message: string) => {
        snackbar.showSuccess(message);
    }
    const showError = (message: string) => {
        snackbar.showError(message);
    }

    const loadExistingRole = async () => {
        try {
            setLoadedExistingRole(false)
            let response = await getData<IRoles>({ url: `${serverUrl.current}/api_admin/role/${id}`, token: auth?.token });
            formik.setValues(response.data);
            setRolePermissions(response.data.Permissions)
            let _selectedPermissions: string[] = [];
            response.data.Permissions.forEach((permission) => {
                _selectedPermissions.push(permission.permission_id.toString())
            })
            formik.setFieldValue('selectedPermissions', _selectedPermissions);
            selectedPermissions.current = _selectedPermissions;
            setLoadedExistingRole(true)

        } catch (error) {
            setLoadedExistingRole(false)

            showError(`error occurred getting permissions: ${error}`);
        }
    }


    return (
        <>
            <Header showBackArrow={true}></Header>
            <div className="container">
                <h4 className="pageTitle">Add a New Role</h4>
                <form onSubmit={formik.handleSubmit} >
                    <Card>
                        <CardContent>
                            <div className="flex flex-column gap-3 justify-content-center centeredField">
                                <div className="flex flex-column gap-2 ">
                                    <label htmlFor="location">Name of Role</label>
                                    <TextField id="role_name"
                                        aria-describedby="role_name-help"
                                        value={formik.values.role_name}
                                        onChange={(e) => {
                                            formik.setFieldValue('role_name', e.target.value);
                                        }}

                                    />
                                    <small id="role_name-help">
                                        E.g. Accountants, or Cashiers, or Managers
                                    </small>
                                    {(formik.touched.role_name && formik.errors.role_name) ? < small className="p-error">{formik.errors.role_name}</small> : <small className="p-error">&nbsp;</small>}
                                </div>


                                <div className="flex flex-column gap-2 ">
                                    <label htmlFor="location">Description</label>
                                    <TextField id="description"
                                        aria-describedby="description-help"
                                        value={formik.values.description}
                                        onChange={(e) => {
                                            formik.setFieldValue('description', e.target.value);
                                        }}

                                    />
                                    <small id="description-help">
                                        Short description of the role
                                    </small>
                                    {(formik.touched.description && formik.errors.description) ? < small className="p-error">{formik.errors.description}</small> : <small className="p-error">&nbsp;</small>}

                                </div>
                                <div>
                                    {!loadingPermissions && loadedExistingRole ? permissions.map((permission) => {
                                        return (
                                            <div key={permission.permission_id} className="flex align-items-center">
                                                <label htmlFor={permission.permission_id} className="ml-2">
                                                    <Checkbox
                                                        name={`'${permission.permission_id}'`}
                                                        value={permission.permission_id}
                                                        onChange={onPermissionChange}

                                                        defaultChecked={rolePermissions.some((rp) => rp.permission_id === permission.permission_id)}
                                                    />
                                                    {permission.name}</label>
                                            </div>
                                        );
                                    }) : <Loading></Loading>}
                                </div>



                                <Button type='submit' loading={loading} >Submit</Button>

                            </div>
                        </CardContent>
                    </Card>


                </form>
            </div>


        </>

    )
}

export default AddRole

