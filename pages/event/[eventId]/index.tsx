import { Box,  Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect } from "react";
import DashboardComponent from "../../../src/common/components/Dashboard";
import AddExperiencesSection from "../../../src/modules/event/components/AddExperiences";
import AddGuestsSection from "../../../src/modules/event/components/create-event-stepper/stepper-sections/AddGuestsSection";
import EventForm from "../../../src/modules/event/components/EventForm.form";
import SchedulePollForm from "../../../src/modules/schedule-poll/components/SchedulePollForm.form";
import { useRouter } from "next/router";
import SuccessSnackbar from "../../../src/common/components/elements/SucessSnackbar";
import ErrorSnackbar from "../../../src/common/components/elements/ErrorSnackbar";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const { apiUrl } = publicRuntimeConfig
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function EventRecordEditPage() {
    const [value, setValue] = React.useState(0);
    const [event, setEvent]:any = React.useState({});
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log(event)
        setValue(newValue);
    };
    const router = useRouter();

    const { event_id, eventId } = router.query;
    let eid = event_id ?? eventId;

    const [openSuccessSnackbar, setSuccessSnackbarOpen] = React.useState(false);
    const [openErrorSnackbar, setErrorSnackbarOpen] = React.useState(false);

    useEffect(() => {
        if (!router.isReady)
            return;
        getEvent();
    }, [router.isReady]);

    const handleClose = (reason:any) => {
        // @ts-ignore
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

    const onSuccess = (message: string) => {
        console.log(message)
        setSuccessSnackbarOpen(true);
    }
    const onError = (message: string) => {
        console.log(message)

        setErrorSnackbarOpen(true);
    }

    const getEvent = async () => {
        // Only fetch an event if the event id is defined
        if (eid) {
            const response = await fetch(
                `${apiUrl}/events/${eid}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            const data = await response.json();
            setEvent(data);
        } else {
            console.log('no event id')
        }
    }
    return (
        <DashboardComponent>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="event edit tabs">
                        <Tab label="Edit Event Details" {...a11yProps(0)} />
                        {
                            event.has_poll
                                ? <Tab label="Manage Schedule Poll" {...a11yProps(1)} />
                                : <Tab label="Manage Schedule Poll" {...a11yProps(1)} disabled />
                        }



                        <Tab label="Manage Event Experiences" {...a11yProps(2)} />
                        <Tab label="Manage Participants" {...a11yProps(3)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <EventForm mode='edit'
                        onSuccess={onSuccess}
                        onError={onError}
                    />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <SchedulePollForm mode='edit'
                        onSuccess={onSuccess}
                        onError={onError}
                    />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <AddExperiencesSection
                        // onSuccess={onSuccess}
                        // onError={onError}
                    />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <AddGuestsSection
                    />
                </TabPanel>
            </Box>
            <SuccessSnackbar open={openSuccessSnackbar}
                duration={3000}
                onClosed={handleClose}
                message="Action Successful!"
                action={null}>
            </SuccessSnackbar>
            <ErrorSnackbar
                open={openErrorSnackbar}
                duration={3000}
                onClosed={handleClose}
                message="Action Unsuccessful!"
                action={null}>
            </ErrorSnackbar>
        </DashboardComponent>

    );
}
