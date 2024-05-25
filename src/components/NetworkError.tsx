import { Card } from 'primereact/card';
import React from 'react';

const NetworkError = (props:{error:Error}) => {
    return (
        <Card header={"Network Error"} subTitle={"Please check your connection and try again"}>
            {props.error.message}
        </Card>
    )
}

export default NetworkError