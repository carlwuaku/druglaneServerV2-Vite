import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useFormik, FormikProps, FormikErrors, Form, } from 'formik';

import { getData, postData } from "@/utils/network";
import { ipcRenderer } from "electron";
import { GET_SERVER_URL, SERVER_URL_RECEIVED } from "@/utils/stringKeys";
import Snackbar from "@mui/material/Snackbar";
import Notification from "./Notification";
import { NotificationSeverity } from "../models/notificationSeverityInterface";
import { saveSettingsResponse } from "../models/axiosResponse";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useSnackbar } from "@/global/SnackbarContext";
import { Button, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";

const Settings = ({ data, onSubmit }: { data: ISettings, onSubmit: Function }) => {
    const auth = useAuthUser<{ token: string }>();
    const yesNoOptions = ['yes', 'no'];
    const [currentLogo, setCurrentLogo] = useState(data.logo);
    const [serverUrl, setServerUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const [resultMessage, setResultMessage] = useState("");
    const [notificationSeverity, setNotificationSeverity] = useState(NotificationSeverity.SUCCESS);


    const [settingsData, setSettingsData] = useState({
        number_of_shifts: '',
        restrict_zero_stock_sales: '',
        tax: '',
        logo: '',
        receipt_logo: '',
        tax_title: '',
        show_tax_on_receipt: '',
        receipt_show_credits: '',
        receipt_extra_info: '',
        receipt_footer: '',
        receipt_show_customer: '',
        receipt_product_data: '',
        receipt_font_size: '',
        receipt_show_borders: '',
        duplicate_record_timeout: '',
        company_name: '',
        phone: '',
        email: '',
        address: '',
        digital_address: '',
        admin_password: '',
        company_id: ''
    });
    const snackbar = useSnackbar();

    const showSuccess = (message: string) => {
        snackbar.showSuccess(message);
    }
    const showError = (message: string) => {
        snackbar.showError(message);
    }
    useEffect(() => {
        const handleServerUrlReceived = async (event: any, data: any) => {
            setServerUrl(data.data);
        }
        ipcRenderer.send(GET_SERVER_URL);
        ipcRenderer.on(SERVER_URL_RECEIVED, handleServerUrlReceived);
        return () => {
            ipcRenderer.removeListener(SERVER_URL_RECEIVED, handleServerUrlReceived)
        }

    }, [])
    const formik = useFormik({
        initialValues: {
            number_of_shifts: data.number_of_shifts,
            restrict_zero_stock_sales: data.restrict_zero_stock_sales,
            tax: data.tax,
            logo: data.logo,
            receipt_logo: data.receipt_logo,
            tax_title: data.tax_title,
            show_tax_on_receipt: data.show_tax_on_receipt,
            receipt_show_credits: data.receipt_show_credits,
            receipt_extra_info: data.receipt_extra_info,
            receipt_footer: data.receipt_footer,
            receipt_show_customer: data.receipt_show_customer,
            receipt_product_data: data.receipt_product_data,
            receipt_font_size: data.receipt_font_size,
            receipt_show_borders: data.receipt_show_borders,
            duplicate_record_timeout: data.duplicate_record_timeout,
            company_name: data.company_name,
            phone: data.phone,
            email: data.email,
            address: data.address,
            digital_address: data.digital_address,
            admin_password: data.admin_password,
        },
        validate: (values: ISettings) => {
            let errors: FormikErrors<ISettings> = {};
            if (!values.email) {
                errors.email = 'Required';
            }
            return errors;
        },
        onSubmit: async (data) => {
            console.log(data);

            try {
                setLoading(true);
                data.logo = currentLogo;
                let response = await postData<saveSettingsResponse>({ url: `${serverUrl}/api_admin/savesettings`, formData: data, token: auth?.token });
                setLoading(false);
                if (!response.data.data) {
                    showSuccess('Password saved successfully')
                }
                else {
                    response.data.data.map(item => {
                        showError(item)
                    })
                }
                console.log(response)
                setLoading(false);
                onSubmit();
            } catch (error) {
                showError(`An error occurred: ${error}`);
            }



        }
    });



    const customBase64Uploader = async (event: ChangeEvent<HTMLInputElement>) => {
        // convert file to base64 encoded
        const file = event.target.files?.[0];
        const reader = new FileReader();
        if (!file) {
            return;
        }
        await reader.readAsDataURL(file);

        // fetch(file.objectURL).then((r) => r.blob()); //blob:url

        // reader.onload

        reader.onloadend = function () {
            if (reader.result)
                setCurrentLogo(reader.result.toString());
        };
    };
    // const isFormFieldInvalid = (name:string) => !!(formik.touched[name] && formik.errors[name]);

    return (
        <>

            <div className="flex flex-column justify-content-center align-items-center">

                <form onSubmit={formik.handleSubmit} className="flex flex-column gap-3">



                    <div className="flex flex-column gap-2">
                        <label htmlFor="location">Phone</label>
                        <TextField id="phone"
                            aria-describedby="phone-help"
                            value={formik.values.phone}
                            onChange={(e) => {
                                formik.setFieldValue('phone', e.target.value);
                            }}
                        />
                        <small id="phone-help">
                            Your facility's phone
                        </small>
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="location">Email Address</label>
                        <TextField id="email" type={'email'}
                            aria-describedby="email-help"
                            value={formik.values.email}
                            onChange={(e) => {
                                formik.setFieldValue('email', e.target.value);
                            }}
                        />
                        <small id="email-help">
                            Your facility's email address
                        </small>
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="address">Location Address</label>
                        <TextField id="address" aria-describedby="address-help"
                            value={formik.values.address}
                            onChange={(e) => {
                                formik.setFieldValue('address', e.target.value);
                            }}
                        />
                        <small id="address-help">
                            The physical location of your facility
                        </small>
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="location">Digital Address</label>
                        <TextField id="digital_address"
                            aria-describedby="digital_address-help"
                            value={formik.values.digital_address}
                            onChange={(e) => {
                                formik.setFieldValue('digital_address', e.target.value);
                            }}
                        />
                        <small id="digital_address-help">
                            The digital address of your facility.e.g. DG-34-2334
                        </small>
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="location">Shifts</label>
                        <TextField id="number_of_shifts"
                            aria-describedby="number_of_shifts-help"
                            value={formik.values.number_of_shifts}
                            onChange={(e) => {
                                formik.setFieldValue('number_of_shifts', e.target.value);
                            }}
                        />
                        <small id="digital_address-help">
                            <b>Separate by commas.</b> The shifts you run: e.g. Morning, Afternoon, Evening
                        </small>
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="location">Logo</label>
                        <TextField id="logo"
                            aria-describedby="logo-help"
                            value={formik.values.logo}
                            onChange={(e) => {
                                formik.setFieldValue('logo', e.target.value);
                            }}
                            type="file"
                        />


                        {/* <TextField id="logo"
                      aria-describedby="logo-help"
                      value={formik.values.logo}
                      onChange={(e) => {
                          formik.setFieldValue('logo', e.target.value);
                      }}
                  /> */}

                        <small id="logo-help">
                            Select a picture of your logo
                        </small>
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="tax">Tax %</label>
                        <TextField id="tax"
                            aria-describedby="tax-help"
                            value={formik.values.tax}
                            onChange={(e) => {
                                formik.setFieldValue('tax', e.target.value);
                            }}
                        />
                        <small id="logo-help">
                            A fixed percentage to charge all sales
                        </small>
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="tax_title">Tax Title On Receipts</label>
                        <TextField id="tax_title"
                            aria-describedby="tax_title-help"
                            value={formik.values.tax_title}
                            onChange={(e) => {
                                formik.setFieldValue('tax_title', e.target.value);
                            }}
                        />
                        <small id="tax_title-help">
                            e.g. Local Sales Tax. How you want the tax to be labelled on printed receipts
                        </small>
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="receipt_font_size">Receipt Font Size</label>
                        <TextField id="receipt_font_size"
                            aria-describedby="receipt_font_size-help"
                            value={formik.values.receipt_font_size}
                            onChange={(e) => {
                                formik.setFieldValue('receipt_font_size', e.target.value);
                            }}
                        />
                        <small id="receipt_font_size-help">
                            e.g. 13px.
                        </small>
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="restrict_zero_stock_sales">Restrict the sale of items with zero stock</label>
                        <ToggleButtonGroup
                            value={formik.values.restrict_zero_stock_sales}
                            exclusive
                            onChange={(e, value) => {
                                formik.setFieldValue('restrict_zero_stock_sales', value);
                            }}
                            aria-label="text alignment"
                        >
                            <ToggleButton value="yes" aria-label="left aligned">
                                Yes
                            </ToggleButton>
                            <ToggleButton value="no" aria-label="centered">
                                No
                            </ToggleButton>

                        </ToggleButtonGroup>

                        <small id="restrict_zero_stock_sales-help">
                            Set to yes if you do not want items to be sold if their stock reaches zero.
                            If set to No, items may be sold into negative stock quantities
                        </small>
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="receipt_logo">Show Logo On Receipt</label>
                        <ToggleButtonGroup
                            value={formik.values.receipt_logo}
                            exclusive
                            onChange={(e, value) => {
                                formik.setFieldValue('receipt_logo', value);
                            }}
                            aria-label="text alignment"
                        >
                            <ToggleButton value="yes" aria-label="left aligned">
                                Yes
                            </ToggleButton>
                            <ToggleButton value="no" aria-label="centered">
                                No
                            </ToggleButton>

                        </ToggleButtonGroup>

                        <small id="receipt_logo-help">
                            Set to yes if you want your logo (if you set it) to appear on printed receipts

                        </small>
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="receipt_show_credits">Show Tax On Receipt</label>
                        <ToggleButtonGroup
                            value={formik.values.show_tax_on_receipt}
                            exclusive
                            onChange={(e, value) => {
                                formik.setFieldValue('show_tax_on_receipt', value);
                            }}
                            aria-label="text alignment"
                        >
                            <ToggleButton value="yes" aria-label="left aligned">
                                Yes
                            </ToggleButton>
                            <ToggleButton value="no" aria-label="centered">
                                No
                            </ToggleButton>

                        </ToggleButtonGroup>

                        <small id="show_tax_on_receipt-help">
                            Set to yes if you want the tax charged to appear on printed receipts
                        </small>
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="receipt_show_borders">Show Receipt Border Lines</label>
                        <ToggleButtonGroup
                            value={formik.values.receipt_show_borders}
                            exclusive
                            onChange={(e, value) => {
                                formik.setFieldValue('receipt_show_borders', value);
                            }}
                            aria-label="text alignment"
                        >
                            <ToggleButton value="yes" aria-label="left aligned">
                                Yes
                            </ToggleButton>
                            <ToggleButton value="no" aria-label="centered">
                                No
                            </ToggleButton>

                        </ToggleButtonGroup>

                        <small id="receipt_show_borders-help">
                            Set to yes if you want thick borders on the lines and tables of printed receipts

                        </small>
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="receipt_show_customer">Show Customer Details On Receipt</label>
                        <ToggleButtonGroup
                            value={formik.values.receipt_show_customer}
                            exclusive
                            onChange={(e, value) => {
                                formik.setFieldValue('receipt_show_customer', value);
                            }}
                            aria-label="text alignment"
                        >
                            <ToggleButton value="yes" aria-label="Yes">
                                Yes
                            </ToggleButton>
                            <ToggleButton value="no" aria-label="No">
                                No
                            </ToggleButton>

                        </ToggleButtonGroup>

                        <small id="show_tax_on_receipt-help">
                            Set to yes if you want the customer's name to appear on printed receipts
                        </small>
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="receipt_show_credits">Show Receipt Credits</label>
                        <ToggleButtonGroup
                            value={formik.values.receipt_show_credits}
                            exclusive
                            onChange={(e, value) => {
                                formik.setFieldValue('receipt_show_credits', value);
                            }}
                            aria-label="text alignment"
                        >
                            <ToggleButton value="yes" aria-label="Yes">
                                Yes
                            </ToggleButton>
                            <ToggleButton value="no" aria-label="No">
                                No
                            </ToggleButton>

                        </ToggleButtonGroup>

                        <small id="receipt_show_credits-help">
                            Set to yes if you want to show the default 'Thanks for shopping with us' on printed receipts
                        </small>
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="receipt_footer">Receipt Footer Message</label>
                        <TextField id="receipt_footer"
                            aria-describedby="receipt_footer-help"
                            value={formik.values.receipt_footer}
                            onChange={(e) => {
                                formik.setFieldValue('receipt_footer', e.target.value);
                            }}
                        />
                        <small id="receipt_footer-help">
                            Any message you want to add to the bottom of printed receipts
                        </small>
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="receipt_extra_info">Receipt Extra Message</label>
                        <TextField id="receipt_extra_info"
                            aria-describedby="receipt_extra_info-help"
                            value={formik.values.receipt_extra_info}
                            onChange={(e) => {
                                formik.setFieldValue('receipt_extra_info', e.target.value);
                            }}
                        />
                        <small id="receipt_extra_info-help">
                            Any message you want to printed receipts. e.g. All prices
                            carry a 4% VAT charge
                        </small>
                    </div>

                    <Button type="submit" loading={loading}>Submit</Button>
                </form>

                <Notification
                    message={resultMessage}
                    open={openNotification}
                    severity={notificationSeverity}
                ></Notification>


            </div>

        </>
    )
}

export default Settings

interface ISettings {
    number_of_shifts: string;
    restrict_zero_stock_sales: string;
    tax: string;
    logo: string;
    receipt_logo: string;
    tax_title: string;
    show_tax_on_receipt: string;
    receipt_show_credits: string;
    receipt_extra_info: string;
    receipt_footer: string;
    receipt_show_customer: string;
    receipt_product_data: string;
    receipt_font_size: string;
    receipt_show_borders: string;
    duplicate_record_timeout: string;
    company_name: string;
    phone: string;
    email: string;
    address: string;
    digital_address: string;
    admin_password: string;
}