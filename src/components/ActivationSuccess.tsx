import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

const ActivationSuccess = ({ name }: { name: string }) => {
    const content = (
        <div className="flex align-items-center">
            <i className="pi pi-check-circle"></i>
            <div className="ml-2">Activation key confirmed successfully for {name} !.</div>
        </div>
    );
    return (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            {content}
        </Alert>


    )
}

export default ActivationSuccess