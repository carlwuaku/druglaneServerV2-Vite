import { AlertColor } from '@mui/material/Alert';

export interface SnackbarMessage {
    message: string;
    severity: AlertColor;
    autoHideDuration: number;
}

export interface SnackbarState extends SnackbarMessage {
    open: boolean;
}

export interface SnackbarContextType {
    showSnackbar: (
        message: string,
        severity?: AlertColor,
        autoHideDuration?: number
    ) => void;
    showSuccess: (message: string, autoHideDuration?: number) => void;
    showError: (message: string, autoHideDuration?: number) => void;
    showWarning: (message: string, autoHideDuration?: number) => void;
    showInfo: (message: string, autoHideDuration?: number) => void;
}
