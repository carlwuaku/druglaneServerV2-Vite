import { SnackbarContextType, SnackbarMessage, SnackbarState } from "@/types/snackbar";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import { createContext, useContext, useState } from "react";

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = (): SnackbarContextType => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error("useSnackbar must be used within a SnackbarProvider");
    }
    return context;
}

export const SnackbarProvider = ({ children, maxQueue, autoHideDuration: defaultAutoHideDuration }: { children: React.ReactNode, maxQueue: number, autoHideDuration: number }) => {
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "info",
        autoHideDuration: defaultAutoHideDuration || 3000
    });
    const [queue, setQueue] = useState<SnackbarState[]>([]);

    const showSnackbar = (message: string, severity: "success" | "error" | "warning" | "info" = "info", autoHideDuration: number = 3000) => {
        const newSnackbar: SnackbarMessage = {
            message,
            severity,
            autoHideDuration
        }
        //if open, add to queue, observing maxQueue
        if (snackbar.open) {
            setQueue(prevQueue => {
                const newQueue = [...prevQueue, snackbar];
                return newQueue.length > maxQueue ? newQueue.slice(-maxQueue) : newQueue;
            })
        }
    }

    const hideSnackbar = (): void => {
        setSnackbar(prev => ({ ...prev, open: false }));
        //show next in queue
        setTimeout(() => {
            if (queue.length > 0) {
                const [next, ...remainingQueue] = queue;
                setQueue(remainingQueue);
                setSnackbar({ ...next, open: true })
            }
        }, 200);
    }

    // Convenience methods for different severity levels
    const showSuccess = (message: string, autoHideDuration: number = defaultAutoHideDuration): void => {
        showSnackbar(message, 'success', autoHideDuration);
    };

    const showError = (message: string, autoHideDuration: number = 8000): void => {
        showSnackbar(message, 'error', autoHideDuration);
    };

    const showWarning = (message: string, autoHideDuration: number = defaultAutoHideDuration): void => {
        showSnackbar(message, 'warning', autoHideDuration);
    };

    const showInfo = (message: string, autoHideDuration: number = defaultAutoHideDuration): void => {
        showSnackbar(message, 'info', autoHideDuration);
    };

    const contextValue: SnackbarContextType = {
        showSnackbar,
        showSuccess,
        showError,
        showWarning,
        showInfo
    }

    return <SnackbarContext.Provider value={contextValue}>
        {children}
        <Snackbar open={snackbar.open} autoHideDuration={snackbar.autoHideDuration}
            onClose={hideSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <Alert
                onClose={hideSnackbar}
                severity={snackbar.severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
    </SnackbarContext.Provider>
}