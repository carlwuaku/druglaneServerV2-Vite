import { useSnackbar } from "@/global/SnackbarContext";
import { useState } from "react";

export default function useCopyToClipboard() {
    const snackbar = useSnackbar();
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        try {
            navigator.clipboard.writeText(text);
            setIsCopied(true);
            snackbar.showSnackbar("Copied to clipboard", "success");
        } catch (error) {
            console.error("Failed to copy to clipboard:", error);
            snackbar.showSnackbar("Failed to copy to clipboard", "error");
            setIsCopied(false);
        }

    }

    return { copyToClipboard, isCopied };
}