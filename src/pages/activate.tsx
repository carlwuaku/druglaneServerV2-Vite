import { ACTIVATION_RESULT, ADMIN_PASSWORD_NOT_SET, APP_ACTIVATED, CALL_ACTIVATION, COMPANY_NOT_SET, RESTART_APPLICATION, SERVER_RUNNING } from '@/utils/stringKeys';
import { ipcRenderer } from 'electron';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import ActivationFailed from '../components/ActivationFailed';
import ActivationSuccess from '../components/ActivationSuccess';
import { TabPanel, TabView } from 'primereact/tabview';
import Settings from '../components/settings';
import { Dialog } from 'primereact/dialog';
import { useFormik, FormikErrors, } from 'formik';
import SetAdminPassword from '../components/SetAdminPassword';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useGlobalState } from '@/global/globalProvider';
import { getData } from '@/utils/network';
import { ActivationStateType } from '@/types/activationStateType';

const Activate = () => {
  const history = useNavigate();
  //track the server url. in some cases the activation would have been done and the database created. in that case we have to check if company details have been set and password set
  const { serverUrl, serverState } = useGlobalState();
  //define the url. since the https version fails
  //sometimes, retry with the http version when 
  //necessary
  const formik = useFormik({
    initialValues: {
      code: ''
    },
    validate: (values: { code: string }) => {
      let errors: FormikErrors<{ code: string }> = {};
      if (!values.code) {
        errors.code = 'Required';
      }
      return errors;
    },
    onSubmit: (data) => {

      //validate and emit data to parent
      setLoading(true)
      ipcRenderer.send(CALL_ACTIVATION, data.code)
    }
  });
  const [loading, setLoading] = useState(false)

  const [requestStatus, setRequestStatus] = useState<{ status: string, data: any }>({ status: "", data: {} });

  const [errorVisible, setErrorVisible] = useState(false);

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
  })

  const settingsSubmitted = () => {
    //navigate to next tab
    setActiveIndex(2)
  }

  const adminPasswordSet = () => {
    ipcRenderer.send(RESTART_APPLICATION)
  }

  // function sendValidation() {
  //   if (keyField.current.value) {
  //     setLoading(true)
  //     ipcRenderer.send(CALL_ACTIVATION, keyField.current.value)
  //   }
  // }

  useEffect(() => {
    ipcRenderer.on(ACTIVATION_RESULT, (event, data) => {
      setLoading(false)
      //incase of an incorect key the data returned is 
      //       "data": {
      //         "status": "-1"
      //       },
      //       "error": false,
      //         "message": ""
      //     }
      // }

      console.log(data.data)
      if (data.data.status === "1") {
        setRequestStatus(data.data)
        setSettingsData({
          number_of_shifts: data.data.data.number_of_shifts,
          restrict_zero_stock_sales: data.data.data.restrict_zero_stock_sales,
          tax: '0',
          logo: '',
          receipt_logo: 'no',
          tax_title: 'Local Sales Tax',
          show_tax_on_receipt: 'no',
          receipt_show_credits: 'yes',
          receipt_extra_info: '',
          receipt_footer: '',
          receipt_show_customer: 'yes',
          receipt_product_data: '',
          receipt_font_size: '13px',
          receipt_show_borders: 'no',
          duplicate_record_timeout: '',
          company_name: data.data.data.name,
          phone: data.data.data.phone,
          email: data.data.data.email,
          address: data.data.data.address,
          digital_address: data.data.data.digital_address,
          admin_password: '',
          company_id: data.data.data.id
        })

        console.log(settingsData)

        setActiveIndex(1)
      }
      else {
        //show dialog for error
        setErrorVisible(true)
      }

    });

    return () => {
      ipcRenderer.removeAllListeners(ACTIVATION_RESULT);
    }


  }, [])

  useEffect(() => {
    //if the server url is set and the server is running, then get the activation state from the server
    //this is to check if the activation has already been done
    const getServerState = async () => {
      const serverState = await getData<ActivationStateType>({ url: `${serverUrl}/api_admin/activation_status` });
      console.log(serverState)
      if (serverState.data === APP_ACTIVATED) {
        history('/')
      }
    }
    if (serverUrl && serverState === SERVER_RUNNING) {
      getServerState();
    }
  }, [serverUrl, serverState]);


  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className='flex flex-column gap-1  align-items-center p-2 overflow-x-auto'>
      <h2>Activate Your System</h2>
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeIndex} alternativeLabel>
          <Step key="enter-activation-code">
            <StepLabel>Enter Activation Code</StepLabel>
          </Step>
          <Step key="settings">
            <StepLabel>Company Details</StepLabel>
          </Step>
          <Step key="admin-password">
            <StepLabel>Set Administrator Password</StepLabel>
          </Step>
        </Stepper>
        <div className="step-content">
          {activeIndex === 0 && (
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-column gap-1 align-items-center">
                <div className='text-center mb-2'>
                  Please enter your activation code. If you do not have one, please contact us via our form at
                  <a href="http://calronsoftwares.com"> http://calronsoftwares.com</a>
                </div>

                <label className='font-bold' htmlFor="location">Activation Code</label>
                <InputText
                  id="code"
                  className='wide-input'
                  aria-describedby="code-help"
                  value={formik.values.code}
                  onChange={(e) => {
                    formik.setFieldValue('code', e.target.value);
                  }}
                />

                <Button type='submit' label='Submit' loading={loading}></Button>
                {
                  requestStatus && requestStatus.data.status === "-1" ? <ActivationFailed /> : null
                }
              </div>
            </form>
          )}

          {activeIndex === 1 && (
            <div className='flex flex-column justify-content-center align-items-center'>
              {
                requestStatus && requestStatus.status === "1" ?
                  <div>
                    <ActivationSuccess name={requestStatus.data.name} />

                  </div> : null
              }
              <Settings data={settingsData} onSubmit={settingsSubmitted}></Settings>
            </div>
          )}

          {activeIndex === 2 && (
            <div className='flex flex-column justify-content-center align-items-center'>
              <SetAdminPassword onSubmit={adminPasswordSet}></SetAdminPassword>
            </div>
          )}
        </div>
      </Box>
      {/* <Button><Link to="/">HOME</Link></Button> */}
      {/* <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="Enter Activation Code" disabled>

        </TabPanel>
        <TabPanel header="Settings" disabled>
          
        </TabPanel>
        <TabPanel header="Set Administrator Password" disabled>
          
        </TabPanel>
      </TabView> */}


      <Dialog visible={errorVisible} style={{ width: '50vw' }}
        footer={<Button label="Close" icon="pi pi-times" onClick={() => setErrorVisible(false)} className="p-button-text" />
        }
        onHide={() => setErrorVisible(false)}>
        <p className="m-0">
          Your activation key is invalid. Please check and try again
        </p>
      </Dialog>


    </div>



  )
}

export default Activate