import { Typography, Stepper, Step, StepLabel, Card } from "@mui/material"
import { Box } from "@mui/system"
import React, { useContext, useEffect } from "react"
import AddExperiencesStepperSection from "./stepper-sections/AddExperiencesSection"
import AddGuestsSection from "./stepper-sections/AddGuestsSection"
import ConfirmationSection from "./stepper-sections/ConfirmationSection"
import CreateEventSection from "./stepper-sections/CreateEventSection"
import CreateSchedulePollSection from "./stepper-sections/CreateSchedulePollSection"
import { StepperContext } from "./StepperContext"
import Success from "./Success"




const CreateEventStepper = () => {
    const { activeStep, steps, initStepper } = useContext(StepperContext);


    const handleSteps = (step: number) => {
        switch (step) {

            case 0:
                return <CreateEventSection></CreateEventSection>

            case 1:
                return <CreateSchedulePollSection></CreateSchedulePollSection>

            case 2:
                return <AddExperiencesStepperSection></AddExperiencesStepperSection>
            case 3:
                return <AddGuestsSection></AddGuestsSection>

            case 4:
                return <ConfirmationSection></ConfirmationSection>

            case 5:
                return <Success></Success>
            default:
                throw new Error('Unknown step')
        }
    }


    let filteredSteps = steps.filter(step => step.hidden === false);

    console.log('Stepper state', steps);


    console.log('Current active', activeStep);

    // Resets the stepper when the component unmounts
    useEffect(() => {
        initStepper();
    }, [])

    return (
        <>
            <Card>
                <Box sx={{ my: 5 }}>
                    <Typography variant="h4" align="center">
                        Create Event
                    </Typography>
                    <Typography variant="subtitle2" align="center" sx={{ mt: 2 }}>
                        Create a complete Event here
                    </Typography>
                </Box>

                <Stepper activeStep={filteredSteps.indexOf(steps[activeStep])} sx={{ py: 1 }} alternativeLabel>
                    {filteredSteps.map((step) => (
                        <Step key={step.name}>
                            <StepLabel>{step.name}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

            </Card>

            {handleSteps(activeStep)}


        </>
    )
}

export default CreateEventStepper;