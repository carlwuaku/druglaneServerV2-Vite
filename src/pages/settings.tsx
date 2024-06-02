import { getData } from '@/utils/network';
import { GET_SERVER_URL, SERVER_URL_RECEIVED } from '@/utils/stringKeys';
import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Loading from '../components/Loading';
import Settings from '../components/settings'
import { useAuthUser } from 'react-auth-kit'
const SettingsPage = () => {
    const auth = useAuthUser();
    const [isLoaded, setIsLoaded] = useState(false);

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


    const settingsSubmitted = () => {
        window.history.back();
    }

    useEffect(() => {
        const handleServerUrlReceived = async (event: any, data: any) => {
            let serverUrl = data.data;
            //get the settings
            const getSettings = await getData<any>({ url: `${serverUrl}/api_admin/settings`, token: auth()?.token })
            console.log("settings get settings", getSettings)
            setSettingsData(getSettings.data);
            setIsLoaded(true)

        }
        ipcRenderer.send(GET_SERVER_URL);

        ipcRenderer.on(SERVER_URL_RECEIVED, handleServerUrlReceived);
        
        return () => {
            ipcRenderer.removeListener(SERVER_URL_RECEIVED, handleServerUrlReceived)
        }


    }, [])

  return (
      <>
          <Header showBackArrow={true}></Header>
          <div className='container'>
              <h3>System Settings</h3>
             { isLoaded ? (<Settings data={settingsData} onSubmit={settingsSubmitted}></Settings>) : (<Loading/>)}
          </div>
      </>
  )
}

export default SettingsPage