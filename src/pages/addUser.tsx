import React, { useEffect, useRef, useState } from 'react'
import { useFormik, FormikErrors, } from 'formik';
import { getData, postData } from '@/utils/network';
import { GET_SERVER_URL, SERVER_URL_RECEIVED } from '@/utils/stringKeys';
import { ipcRenderer } from 'electron';
import { genericAxiosPostResponse } from '../models/axiosResponse';
import { Button, Card, CardContent, FormControl, FormControlLabel, InputLabel, Select, TextField } from '@mui/material';
import Header from '../components/Header';
import { IRoles } from '../models/roles';
import { useNavigate, useParams } from 'react-router-dom';
import { IUser } from '../models/user';
import Switch from '@mui/material/Switch';
import { Permissions } from '../models/permissions';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useSnackbar } from '@/global/SnackbarContext';
import MenuItem from '@mui/material/MenuItem';

const AddUser = () => {
    const auth = useAuthUser<{ token: string }>();
    const history = useNavigate();
    const [loading, setLoading] = useState(false)
    const serverUrl = useRef("");
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [roles, setRoles] = useState<IRoles[]>([]);
    const { id } = useParams();
    const [updatePassword, setUpdatePassword] = useState(false);
    const showUpdatePassword = useRef(false);
    const [rolePermissions, setRolePermissions] = useState<Permissions[]>([])
    const [allPermissions, setAllPermissions] = useState<Permissions[]>([])

    // function usePrevious(value:any) {
    //     const ref = useRef();
    //     useEffect(() => {
    //         ref.current = value;
    //     });
    //     return ref.current;
    // }

    const activeStates = [
        {
            "label": "Active",
            "value": 1
        },
        {
            "label": "Inactive",
            "value": 0
        }
    ]
    const formik = useFormik({
        initialValues: {
            username: '',
            phone: '',
            password: '',
            confirm_password: '',
            email: '',
            display_name: '',
            role_id: '',
            active: 0,
            id: '',
            updatePassword: 'no'
        },
        validate: (values: IUser) => {
            let errors: FormikErrors<IUser> = {};
            if (!values.username) {
                errors.username = 'The username is required';
            }
            if (values.username.includes(" ")) {
                errors.username = 'The username must not contain spaces';
            }
            if (!values.phone) {
                errors.phone = 'A phone is required';
            }
            if (!values.email) {
                errors.email = 'An email address is required';
            }
            if (!values.display_name) {
                errors.display_name = 'A display name is required';
            }
            if (!values.role_id) {
                errors.role_id = 'Please select a role';
            }

            return errors;
        },
        onSubmit: async (data) => {

            //validate and emit data to parent
            try {
                setLoading(true);
                let response = await postData<genericAxiosPostResponse>({
                    url: `${serverUrl.current}/api_admin/saveUser`,
                    formData: data, token: auth?.token
                });
                showSuccess('User modified successfully');
                setLoading(false);
                history('/users');
                //go back to roles
            } catch (error) {
                console.log(error)
                showError(`error occurred: ${error}`);
                setLoading(false);
            }
            // ipcRenderer.send(CALL_ACTIVATION, data.code)
        }
    });
    // const previousRoleId = usePrevious(formik.values.role_id);


    const handleUpdatePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatePassword(event.target.checked);
        console.log('updatepassword', updatePassword)
        formik.setFieldValue('updatePassword', updatePassword ? 'yes' : 'no')
    };

    useEffect(() => {
        if (!id) {
            setUpdatePassword(true);
            showUpdatePassword.current = false;
        }
        else {
            setUpdatePassword(false);

            showUpdatePassword.current = true;
        }

        const handleServerUrlReceived = (event: any, data: any) => {
            serverUrl.current = data.data;
            loadRoles();
            loadPermissions();
            if (id) {
                loadExistingUser();
            }
        };

        ipcRenderer.send(GET_SERVER_URL);

        ipcRenderer.on(SERVER_URL_RECEIVED, handleServerUrlReceived)
        return () => {
            ipcRenderer.removeListener(SERVER_URL_RECEIVED, handleServerUrlReceived);
        };

    }, [id, serverUrl]);

    useEffect(() => {
        if (formik.values.role_id) {
            loadRolePermissions()
        }
    }, [formik.values.role_id]);

    const loadRolePermissions = async () => {
        try {
            setLoadingRoles(true);
            let response = await getData<Permissions[]>({ url: `${serverUrl.current}/api_admin/rolePermissions/${formik.values.role_id}`, token: auth?.token });
            setRolePermissions(response.data)
            setLoadingRoles(false);
        } catch (error) {
            showError(`error occurred getting permissions: ${error}`);
            setLoadingRoles(false);
        }
    }

    const loadRoles = async () => {
        try {
            setLoadingRoles(true);
            let response = await getData<IRoles[]>({ url: `${serverUrl.current}/api_admin/getRoles`, token: auth?.token });
            setRoles(response.data)
            setLoadingRoles(false);
        } catch (error) {
            showError(`error occurred getting permissions: ${error}`);
            setLoadingRoles(false);
        }
    }

    const loadPermissions = async () => {
        try {
            setLoadingRoles(true);
            let response = await getData<Permissions[]>({ url: `${serverUrl.current}/api_admin/allPermissions`, token: auth?.token });
            setAllPermissions(response.data);
        } catch (error) {
            showError(`error occurred getting permissions: ${error}`);
            setLoadingRoles(false);
        }
    }

    const loadExistingUser = async () => {
        try {
            setLoadingRoles(true);
            let response = await getData<IUser>({ url: `${serverUrl.current}/api_admin/user/${id}`, token: auth?.token });
            formik.setValues(response.data)
            setLoadingRoles(false);
        } catch (error) {
            showError(`error occurred getting permissions: ${error}`);
            setLoadingRoles(false);
        }
    }


    const snackbar = useSnackbar();
    const showSuccess = (message: string) => {
        snackbar.showSuccess(message);
    }
    const showError = (message: string) => {
        snackbar.showError(message);
    }

    return (
        <>
            <Header showBackArrow={true}></Header>
            <div className="container">
                <h4 className="pageTitle">Add a New User</h4>
                <form onSubmit={formik.handleSubmit} >
                    <Card>
                        <CardContent>
                            <div className="flex flex-column gap-3 justify-content-center centeredField">
                                <div className="flex flex-column gap-2 ">
                                    <label htmlFor="username">Username</label>
                                    <TextField id="username"
                                        aria-describedby="username-help"
                                        value={formik.values.username}
                                        onChange={(e) => {
                                            formik.setFieldValue('username', e.target.value);
                                        }}
                                        required
                                    />
                                    <small id="username-help">
                                        The user will login with this username. There should be no spaces
                                    </small>
                                </div>


                                <div className="flex flex-column gap-2 ">
                                    <label htmlFor="display_name">Full Name</label>
                                    <TextField id="display_name"
                                        aria-describedby="display_name-help"
                                        value={formik.values.display_name}
                                        onChange={(e) => {
                                            formik.setFieldValue('display_name', e.target.value);
                                        }}
                                        required
                                    />
                                    <small id="display_name-help">
                                        The person's full name, for identification
                                    </small>
                                </div>

                                {/* password */}
                                <div className="flex flex-column gap-2 ">
                                    {showUpdatePassword.current ?
                                        <FormControlLabel control={<Switch
                                            onChange={handleUpdatePasswordChange}

                                        />} label="Update the password" />
                                        : ''}
                                    <label htmlFor="password">Password</label>
                                    <TextField value={formik.values.password}
                                        onChange={(e) => { formik.setFieldValue('password', e.target.value); }}
                                        type='password'
                                        required={updatePassword}
                                        disabled={!updatePassword}
                                    />

                                    <small id="password-help">

                                    </small>
                                </div>

                                <div className="flex flex-column gap-2 ">
                                    <label htmlFor="confirm_password">Confirm Password</label>
                                    <TextField value={formik.values.confirm_password}

                                        onChange={(e) => { formik.setFieldValue('confirm_password', e.target.value); }}
                                        aria-describedby="confirm_password-help"
                                        required={updatePassword}
                                        disabled={!updatePassword}
                                    />

                                    <small id="confirm_password-help">
                                        Type the password again
                                    </small>
                                </div>

                                <div className="flex flex-column gap-2 ">
                                    <label htmlFor="email">Email</label>
                                    <TextField id="email"
                                        aria-describedby="email-help"
                                        value={formik.values.email}
                                        required
                                        onChange={(e) => {
                                            formik.setFieldValue('email', e.target.value);
                                        }}
                                    />
                                </div>

                                <div className="flex flex-column gap-2 ">
                                    <label htmlFor="phone">Phone Number</label>
                                    <TextField id="phone"
                                        aria-describedby="phone-help"
                                        value={formik.values.phone}
                                        required
                                        onChange={(e) => {
                                            formik.setFieldValue('phone', e.target.value);
                                        }}
                                    />
                                </div>

                                <div className="flex flex-column gap-2 ">
                                    <label htmlFor="role_id">User Role</label>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Age</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={formik.values.role_id}
                                            label="Age"
                                            onChange={(e) => {
                                                formik.setFieldValue('role_id', e.target.value);
                                            }}
                                        >
                                            {roles.map((role) => (
                                                <MenuItem key={role.role_id} value={role.role_id}>
                                                    {role.role_name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>


                                    {formik.values.role_id ? <div>
                                        {rolePermissions.length} of {allPermissions.length} permissions available to this role.  {rolePermissions.map(permission => <span className='chip light-blue' >{permission.name}</span>)}
                                    </div> : <small id="role_id-help">
                                        Select a role for the user. The permissions available to that role will be displayed below
                                    </small>}
                                </div>

                                <div className="flex flex-column gap-2 ">
                                    <label htmlFor="active">Active</label>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Age</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={formik.values.active}
                                            label="Age"
                                            onChange={(e) => {
                                                formik.setFieldValue('active', e.target.value);
                                            }}
                                        >
                                            {activeStates.map((state) => (
                                                <MenuItem key={state.value} value={state.value}>
                                                    {state.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {/* <Dropdown
                                        inputId="active"
                                        name="active"
                                        value={formik.values.active}
                                        options={activeStates}
                                        optionLabel="label"
                                        optionValue='value'
                                        className={classNames({ 'p-invalid': (formik.touched.active && formik.errors.active) })}
                                        onChange={(e) => {
                                            formik.setFieldValue('active', e.value);
                                        }}
                                    /> */}
                                    <small id="active-help">
                                        An inactive user will not be able to login to the system.
                                    </small>
                                </div>
                                {(formik.touched.username && formik.errors.username) ? < div className="p-error">{formik.errors.username}</div> : ''}
                                {(formik.touched.display_name && formik.errors.display_name) ? < div className="p-error">{formik.errors.display_name}</div> : ''}
                                {(formik.touched.password && formik.errors.password) ? < div className="p-error">{formik.errors.password}</div> : ''}
                                {(formik.touched.confirm_password && formik.errors.confirm_password) ? < div className="p-error">{formik.errors.confirm_password}</div> : ''}
                                {(formik.touched.email && formik.errors.email) ? < div className="p-error">{formik.errors.email}</div> : ''}
                                {(formik.touched.role_id && formik.errors.role_id) ? < div className="p-error">{formik.errors.role_id}</div> : ''}
                                {(formik.touched.phone && formik.errors.phone) ? < div className="p-error">{formik.errors.phone}</div> : ''}
                                {(formik.touched.active && formik.errors.active) ? < div className="p-error">{formik.errors.active}</div> : ''}

                                <Button type='submit' loading={loading} >Submit</Button>

                            </div>
                        </CardContent>
                    </Card>


                </form>
            </div>


        </>
    )
}

export default AddUser