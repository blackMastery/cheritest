import { Button } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { useContext } from "react";
import ErrorSnackbar from "../../../../../common/components/elements/ErrorSnackbar";
import SuccessSnackbar from "../../../../../common/components/elements/SucessSnackbar";
import EventForm from "../../EventForm.form";
import { StepperContext } from "../StepperContext";

export default function CreateEventSection() {

    const {
        handleNext,
        isStepValid,
        isStepComplete,
        setCurrentStepValidity,
        onSectionComplete,
        onEventSubmitCallback
    } = useContext(StepperContext);

    const [onNextCallback, setExecutable] = React.useState(() => () => { });

    const [openSuccessSnackbar, setSuccessSnackbarOpen] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [openErrorSnackbar, setErrorSnackbarOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleSnackbarClose = (event: any, reason: string) => {
        console.log(event)
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

    const onValidCallback = (value: boolean, callback?: (() => void)) => {
        setCurrentStepValidity(value);
        if (callback && value === true) {
            setExecutable(() => () => callback());
        }
    }

    const handleNextClick = () => {
        // If the step is already complete
        if (isStepComplete()) {
            // Navigate to the next step
            handleNext();
        }

        // if step not complete but is valid
        else if (isStepValid()) {
            // // Run child Component executable
            if (onNextCallback) {
                onNextCallback();
            }
        }
    }

    const onSuccess = (message: string) => {
        setSuccessMessage(message);
        setSuccessSnackbarOpen(true);
    }

    const onError = (message: string) => {
        setErrorMessage(message);
        setErrorSnackbarOpen(true);
    }

    function isButtonEnabled() {
        return isStepComplete() || isStepValid() ? true : false;
    }


    return (
        <div>
            <EventForm
                mode='create'
                onSubmitCallback={onEventSubmitCallback}
                onSubmitDone={onSectionComplete}
                onSuccess={onSuccess}
                onError={onError}
                onValidCallback={onValidCallback}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    sx={{ mt: 3, ml: 1 }}
                    disabled={!isButtonEnabled()}
                    color="primary"
                    onClick={isStepComplete() || isStepValid() ? handleNextClick : () => null}
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
        </div>
    );
}
