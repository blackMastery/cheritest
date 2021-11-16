import { Container } from "@mui/material";
import * as React from "react";
import DashboardComponent from "../../src/common/components/Dashboard";
import CreateEventStepper from "../../src/modules/event/components/create-event-stepper/CreateEventStepper";
import { StepperProvider } from "../../src/modules/event/components/create-event-stepper/StepperContext";


export default function EventCreatePage() {

    return (
        <DashboardComponent sectionTitle='Create An Event'>
            <Container sx={{ py: 2 }}>
                <StepperProvider>
                    <CreateEventStepper></CreateEventStepper>

                </StepperProvider>

            </Container>
        </DashboardComponent>
    );

}


