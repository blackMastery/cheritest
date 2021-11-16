import EventGuestForm from "../../EventGuestForm.form";
import * as React from "react";
import { useRouter } from "next/router";
import { Box, Button, Paper } from "@mui/material";
import ErrorSnackbar from "../../../../../common/components/elements/ErrorSnackbar";
import SuccessSnackbar from "../../../../../common/components/elements/SucessSnackbar";
import { StepperContext } from "../StepperContext";
import { useContext } from "react";

const AddGuestsSection = () => {
    const router = useRouter();
    const { eventId } = router.query

    const {
        handleNext,
        handleBack,
        setCurrentStepValidity,
        onSectionComplete,
    } = useContext(StepperContext);

    const [openSuccessSnackbar, setSuccessSnackbarOpen] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [openErrorSnackbar, setErrorSnackbarOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');


    const handleSnackbarClose = (_event: any, reason: string) => {
        if (reason === 'clickaway') {
            return;
        }
        if (openSuccessSnackbar) {
            setSuccessSnackbarOpen(false);
        }
        if (openErrorSnackbar) {
            setErrorSnackbarOpen(false);
        }

    };

    const onValidCallback = (value: boolean, _callback?: (() => void)) => {
        setCurrentStepValidity(value);
    }

    // const handleNextClick = () => {
    //     // If the step is already complete
    //     if (isStepComplete()) {
    //         // Navigate to the next step
    //         handleNext();
    //     }

    //     // if step not complete but is valid
    //     else if (isStepValid()) {
    //         // Automatically set the step as complete if it is valid
    //         onSectionComplete();
    //     }
    // }

    const onSuccess = (message: string) => {
        setSuccessMessage(message);
        setSuccessSnackbarOpen(true);
    }

    const onError = (message: string) => {
        setErrorMessage(message);
        setErrorSnackbarOpen(true);
    }


    return (
        <>
            <Paper>


                <EventGuestForm eventId={eventId}
                    onSectionComplete={onSectionComplete}
                    onSuccess={onSuccess}
                    onError={onError}
                    onValidCallback={onValidCallback}
                />
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }} alignItems="center">
                <Button onClick={handleBack} sx={{ mt: 3, ml: 1, mr: 1 }} variant="outlined">
                    Back
                </Button>
                <Button
                    variant="contained"
                    sx={{ mt: 3, ml: 1 }}
                    disabled={false}
                    color="primary"
                    onClick={handleNext}
                >
                    Next
                </Button>
            </Box>
            <SuccessSnackbar open={openSuccessSnackbar}
                duration={3000}
                onClosed={handleSnackbarClose}
                message={successMessage}
                action={null}>
            </SuccessSnackbar>
            <ErrorSnackbar
                open={openErrorSnackbar}
                duration={3000}
                onClosed={handleSnackbarClose}
                message={errorMessage}
                action={null}>
            </ErrorSnackbar>

        </>
    );
}

export default AddGuestsSection;
