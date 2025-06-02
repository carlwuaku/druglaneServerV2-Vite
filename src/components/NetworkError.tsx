import { Alert } from '@mui/material';
import Card from '@mui/material/Card';
import React from 'react';

const NetworkError = (props: { error: Error }) => {
    return (
        <Alert severity="error" className="flex flex-column align-items-center justify-content-center">
            <h2>Network Error</h2>
            <p className='text'>Please check your connection and try again</p>

            <p>{props.error.message}</p>
        </Alert>
    )
}

export default NetworkError