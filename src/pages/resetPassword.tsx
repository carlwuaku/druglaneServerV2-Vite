
import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import { useFormik, FormikErrors, } from 'formik';
import { postData } from '@/utils/network';
import { GET_SERVER_URL, SERVER_URL_RECEIVED } from '@/utils/stringKeys';
import { ipcRenderer } from 'electron';
import { useNavigate } from 'react-router-dom';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useSnackbar } from '@/global/SnackbarContext';
import { Alert, Button, TextField } from '@mui/material';
export default function ResetPassword() {
    const auth = useAuthUser<{ token: string }>();
    const [loading, setLoading] = useState(false)
    const serverUrl = useRef("");
    const history = useNavigate();
    const snackbar = useSnackbar();
    const showSuccess = (message: string) => {
        snackbar.showSuccess(message);
    }
    const showError = (message: string) => {
        snackbar.showError(message);
    }
    const formik = useFormik<{ password: string, confirm_password: string, reset_token: string }>({
        initialValues: {
            password: '',
            confirm_password: '',
            reset_token: ''
        },
        validate: (values: { password: string, confirm_password: string, reset_token: string }) => {
            let errors: FormikErrors<{ password: string, confirm_password: string, reset_token: string }> = {};
            if (!values.password) {
                errors.password = 'The password is required';
            }
            if (values.password !== values.confirm_password) {
                errors.confirm_password = 'The passwords must match';
            }
            if (!values.reset_token) {
                errors.reset_token = 'The reset token is required';
            }
            return errors;
        },
        onSubmit: async (data) => {

            try {
                setLoading(true);
                let response = await postData<string>({
                    url: `${serverUrl.current}/api_admin/resetAdminPassword`,
                    formData: data, token: auth?.token
                });
                showSuccess('Password reset successfully');
                setLoading(false);
                history('/login');
                //go back to home
            } catch (error) {
                showError(`error occurred: ${error}`);
                setLoading(false);
            }
        }
    });

    useEffect(() => {

        const handleServerUrlReceived = async (event: any, data: any) => {
            serverUrl.current = data.data;

        };

        ipcRenderer.send(GET_SERVER_URL);

        ipcRenderer.on(SERVER_URL_RECEIVED, handleServerUrlReceived)

        return () => {
            ipcRenderer.removeListener(SERVER_URL_RECEIVED, handleServerUrlReceived);
        };
    }, [serverUrl]);



    return (
        <>
            <Header showBackArrow={true}></Header>
            <div className="container">
                <form onSubmit={formik.handleSubmit} >
                    <div className="flex align-items-center justify-content-center">
                        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
                            <div className="text-center mb-5">
                                <img src="/demo/images/blocks/logos/hyper.svg" alt="hyper" height={50} className="mb-3" />
                                <div className="text-900 text-3xl font-medium mb-3">Reset the administrator password</div>
                                <Alert severity="info" >
                                    Please check your email for the reset token that was sent to you
                                </Alert>

                            </div>

                            <div className='flex-column align-items-center justify-content-center' >
                                <label htmlFor="password" className="block text-900 font-medium mb-2">Enter Password</label>
                                <TextField id="password" type="password"
                                    value={formik.values.password}
                                    onChange={(e) => {
                                        formik.setFieldValue('password', e.target.value);
                                    }}

                                />

                                <label htmlFor="confirm_password" className="block text-900 font-medium mb-2">Confirm Password</label>
                                <TextField id="confirm_password" type="confirm_password"
                                    value={formik.values.confirm_password}
                                    onChange={(e) => {
                                        formik.setFieldValue('confirm_password', e.target.value);
                                    }}

                                />

                                <label htmlFor="reset_token" className="block text-900 font-medium mb-2">Reset Token</label>
                                <TextField id="reset_token" type="reset_token"
                                    value={formik.values.reset_token}
                                    onChange={(e) => {
                                        formik.setFieldValue('reset_token', e.target.value);
                                    }}

                                />


                                <Button loading={loading} className="w-full" >Submit</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}
