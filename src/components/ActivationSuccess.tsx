import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import React from 'react';

const ActivationSuccess = ({ name }: { name:string }) => {
    const content = (
        <div className="flex align-items-center">
            <i className="pi pi-check-circle"></i>
            <div className="ml-2">Activation key confirmed successfully for {name} !.</div>
        </div>
    );
    return (

        <Message
            className="border-primary w-full justify-content-start"
            severity="success"
            content={content}
        />

    )
}

export default ActivationSuccess