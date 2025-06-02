import React, { useEffect, useRef, useState } from 'react'
import { useFormik, FormikErrors, } from 'formik';
import { SET_ADMIN_PASSWORD } from '@/utils/stringKeys';
import { getData, postData } from '@/utils/network';
import { GET_SERVER_URL, SERVER_URL_RECEIVED } from '@/utils/stringKeys';
import { ipcRenderer } from 'electron';
import { saveSettingsResponse } from '../models/axiosResponse';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useSnackbar } from '@/global/SnackbarContext';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const SetAdminPassword = ({ onSubmit }: { onSubmit: Function }) => {
    const auth = useAuthUser<{ token: string }>();
    const [loading, setLoading] = useState(false)
    const [serverUrl, setServerUrl] = useState(null);
    const snackbar = useSnackbar();
    const formik = useFormik({
        initialValues: {
            password: '',
            confirm_password: ''
        },
        validate: (values: { password: string, confirm_password: string }) => {
            let errors: FormikErrors<{ password: string, confirm_password: string }> = {};
            if (!values.password) {
                errors.password = 'Required';
            }
            if (!values.confirm_password) {
                errors.confirm_password = 'Required';
            }
            return errors;
        },
        onSubmit: async (data) => {
            if (data.confirm_password !== data.password) {
                alert("Please make sure the passwords match");
                return;
            }
            //validate and emit data to parent
            try {
                setLoading(true);
                let response = await postData<saveSettingsResponse>({ url: `${serverUrl}/api_admin/saveSettings`, formData: { admin_password: data.password }, token: auth?.token });
                if (!response.data.data) {
                    showSuccess('Password saved successfully')
                }
                else {
                    response.data.data.map(item => {
                        showError(item)
                    })
                }
                setLoading(false);
                onSubmit();

            } catch (error) {
                showError(`error occurred: ${error}`);

            }
            // ipcRenderer.send(CALL_ACTIVATION, data.code)
        }
    });

    useEffect(() => {
        ipcRenderer.send(GET_SERVER_URL);
        ipcRenderer.on(SERVER_URL_RECEIVED, async (event: any, data: any) => {
            setServerUrl(data.data);
        });


    }, []);


    const showSuccess = (message: string) => {
        snackbar.showSuccess(message);
    }
    const showError = (message: string) => {
        snackbar.showError(message);
    }

    return (
        <>
            <form onSubmit={formik.handleSubmit} >
                <div className="flex flex-column gap-3 justify-content-center align-items-center">




                    <label htmlFor="password">Enter the administrator password. Please make sure you save it
                        somewhere safe</label>
                    <div>
                        <TextField id="password" type="password"
                            value={formik.values.password}
                            onChange={(e) => {
                                formik.setFieldValue('password', e.target.value);
                            }} variant="outlined"
                            error={formik.touched.password && !!formik.errors.password}
                            helperText={formik.touched.password && formik.errors.password} />
                        {/* <Password id="password" required className='wide-input' feedback={false}
                            value={formik.values.password}
                            onChange={(e) => {
                                formik.setFieldValue('password', e.target.value);
                            }}
                        /> */}
                        {formik.errors.password ? <div>{formik.errors.password}</div> : null}
                    </div>


                    <label htmlFor="password">Type the password again.</label>
                    <div>
                        <TextField id="confirm_password" type="password"
                            value={formik.values.confirm_password}
                            onChange={(e) => {
                                formik.setFieldValue('confirm_password', e.target.value);
                            }} variant="outlined"
                            error={formik.touched.confirm_password && !!formik.errors.confirm_password}
                            helperText={"Confirm password"} />

                        {formik.values.confirm_password !== formik.values.password ? <div>Make sure the passwords match</div> : null}
                    </div>




                    <Button type='submit' loading={loading} >Submit</Button>

                </div>

            </form>

        </>

    )
}

export default SetAdminPassword