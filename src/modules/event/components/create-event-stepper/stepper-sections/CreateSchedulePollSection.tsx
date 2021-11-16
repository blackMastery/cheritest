import { Box, Button, Paper } from '@mui/material';
import React, { useContext } from 'react'
import ErrorSnackbar from '../../../../../common/components/elements/ErrorSnackbar';
import SuccessSnackbar from '../../../../../common/components/elements/SucessSnackbar';
import SchedulePollForm from '../../../../schedule-poll/components/SchedulePollForm.form';
import { StepperContext } from '../StepperContext';

export default function CreateSchedulePollSection() {
    const {
        handleNext,
        handleBack,
        isStepValid,
        isStepComplete,
        setCurrentStepValidity,
        onSectionComplete,
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
            // Run child Component executable
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
            <Paper>
                <SchedulePollForm
                    mode='create'
                    onSubmitDone={onSectionComplete}
                    onSuccess={onSuccess}
                    onError={onError}
                    onValidCallback={onValidCallback}
                />
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={handleBack} sx={{ mt: 3, ml: 1, mr: 1 }} variant="outlined">
                    Back
                </Button>
                <Button
                    variant="contained"
                    sx={{ mt: 3, ml: 1 }}
                    disabled={!isButtonEnabled()}
                    color="primary"
                    onClick={isStepValid() || isStepComplete() ? handleNextClick : () => null}
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
    )
}



