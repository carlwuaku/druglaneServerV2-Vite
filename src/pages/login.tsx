
import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import { useFormik, FormikErrors, } from 'formik';
import { postData } from '@/utils/network';
import { GET_SERVER_URL, SERVER_URL_RECEIVED } from '@/utils/stringKeys';
import { ipcRenderer } from 'electron';
import { useNavigate } from 'react-router-dom';
import LocalImage from '../components/Image';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { Button, Snackbar, TextField } from '@mui/material';
import { useSnackbar } from '@/global/SnackbarContext';
export default function Login() {
    const [loading, setLoading] = useState(false)
    const serverUrl = useRef("");
    const toast = useRef<typeof Snackbar>(null);
    const history = useNavigate();
    const signIn = useSignIn();
    const snackbar = useSnackbar();

    const formik = useFormik<{ password: string }>({
        initialValues: {
            password: ''
        },
        validate: (values: { password: string }) => {
            let errors: FormikErrors<{ password: string }> = {};
            if (!values.password) {
                errors.password = 'The password is required';
            }
            return errors;
        },
        onSubmit: async (data) => {

            try {
                setLoading(true);
                const res = await postData<string>({
                    url: `${serverUrl.current}/api_admin/admin_login`,
                    formData: data, token: undefined
                });
                if (signIn(
                    {
                        auth: {
                            token: res.data,
                            type: 'Bearer'
                        },
                        refresh: 'ey....mA',
                        userState: {
                            name: 'React User',
                            uid: 123456
                        }
                    }
                )) {
                    snackbar.showSuccess('Logged in successfully')
                    setLoading(false);
                    history('/');
                } else {
                    throw new Error("Error signing in. Please try again")
                }


                //go back to home
            } catch (error) {
                snackbar.showError(`Error occurred: ${error}`)
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

    const resetPassword = async () => {
        try {
            setLoading(true);
            let response = await postData<{ error: boolean, message: any }>({
                url: `${serverUrl.current}/api_admin/resetAdminLogin`,
                formData: {}, token: undefined
            });
            if (response.data.error) {
                alert("There was an error sending your token. Please check your connection and click on the 'Forgot Password' to try again")
            }
            else {
                setLoading(false);
                snackbar.showSuccess("Email sent successfully. Please check your email for the reset token")
                history('/resetPassword');
            }

        } catch (error) {
            snackbar.showError(`error occurred: ${error}`);
            setLoading(false);
        }
    }

    return (
        <>
            <Header showBackArrow={true}></Header>
            <div className="container">
                <form onSubmit={formik.handleSubmit} >
                    <div className="flex-column align-items-center justify-content-center">
                        <div className=" w-full lg:w-6">
                            <div className="text-center mb-5">
                                <LocalImage image='Logo' height={"75px"} className="mb-3" />
                                <div className="text-900 text-3xl font-medium mb-3">Log in as the administrator</div>
                            </div>

                            <div className='flex-column align-items-center justify-content-center' >
                                <label htmlFor="password" className="block text-900 font-medium mb-2">Admin Password</label>
                                <TextField id="password" type="password"
                                    value={formik.values.password}
                                    onChange={(e) => {
                                        formik.setFieldValue('password', e.target.value);
                                    }} variant="outlined"
                                    error={formik.touched.password && !!formik.errors.password}
                                    helperText={formik.touched.password && formik.errors.password} />



                                <div className="flex align-items-center justify-content-between mb-6">

                                    <a onClick={resetPassword} className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot your password?</a>
                                </div>
                                <Button loading={loading} variant="contained" >Sign In</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <Snackbar ref={toast} />
        </>
    )
}
