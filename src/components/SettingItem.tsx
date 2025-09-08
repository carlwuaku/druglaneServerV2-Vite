
import React, { useEffect, useRef, useState } from 'react'
import { ipcRenderer } from 'electron';
import { GET_PREFERENCE, PREFERENCE_RECEIVED, PREFERENCE_SET, RESTART_APPLICATION, SET_PREFERENCE } from '@/utils/stringKeys';
import { IconButton, Card, Button, Dialog, InputLabel, Select, SelectChangeEvent, Alert, CardHeader } from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useSnackbar } from '@/global/SnackbarContext';


const SettingItem = (props: { name: string, type: string, options?: { label: string, value: any }[], description: string }) => {
    const [new_value, setValue] = useState('');
    const [currentValue, setCurrentValue] = useState<any>('')

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setValue(currentValue)
        setOpen(false);
    };
    const snackbar = useSnackbar();

    useEffect(() => {
        //get the value of the setting
        const handlePreferenceReceived = (event: any, data: { name: string, value: string }) => {
            console.log(props.name, data)
            if (data.name === props.name) {
                setCurrentValue(data.value)
                setValue(data.value)
            }

        }
        ipcRenderer.send(GET_PREFERENCE, { key: props.name });

        ipcRenderer.on(PREFERENCE_RECEIVED, handlePreferenceReceived);
        return () => {
            ipcRenderer.removeAllListeners(PREFERENCE_RECEIVED);
        }
    }, []);
    function getInput(type: string) {
        switch (type) {
            case "select":
                return (
                    <>
                        <InputLabel id="demo-simple-select-standard-label">Age</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={new_value}
                            onChange={(e: SelectChangeEvent) => setValue(e.target.value)}

                        >


                            {
                                props.options?.map((option, i) =>
                                    <MenuItem key={i} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                )
                            }
                        </Select>
                    </>)


            default:
                return <TextField


                    value={new_value}
                    onChange={(e) => setValue(e.target.value)}
                />

        }
    }

    function save() {
        ipcRenderer.send(SET_PREFERENCE, { key: props.name, value: new_value })
    }

    useEffect(() => {
        ipcRenderer.on(PREFERENCE_SET, (event, data) => {
            if (data.success) {
                setValue(new_value);
                setOpen(false);


                showSuccess(data.message)
                //wait 2 seconds and restart the app
                setTimeout(() => {
                    ipcRenderer.send(RESTART_APPLICATION)
                }, 2000);
            }
            else {
                setOpen(false);

                showError(data.message)
            }

        })
    }, []);



    const showSuccess = (message: string) => {
        snackbar.showSuccess(message);
    }
    const showError = (message: string) => {
        snackbar.showError(message);
    }
    return (
        <>
            <div key={props.name} className='flex flex-col gap-2 border border-gray-200 p-2'>
                <div className="font-bold text-[18px]">{props.name}</div>
                <div className="flex justify-between items-center">
                    <div>{currentValue}</div>
                    <Button variant='contained' onClick={handleClickOpen} color='primary' aria-label="edit">Edit</Button>
                </div>

            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{`Edit ${props.name}`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {props.description}
                    </DialogContentText>
                    <div className="flex flex-col gap-2">
                        {getInput(props.type)}
                        <Alert severity="info">The application will restart automatically once you save</Alert>
                    </div>


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant='contained' onClick={save}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default SettingItem