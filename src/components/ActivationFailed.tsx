import { Alert } from "@mui/material"

const ActivationFailed = () => {
    const message = `Check that your code is correct and try again. The code is comprised of 20 digits separated by
    dashes.E.g.ABCDE - FGHIJ - KLMNO - PQRST`
    return (
        <Alert severity="error" >{message} </Alert>

    )
}

export default ActivationFailed