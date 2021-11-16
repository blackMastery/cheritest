import {
    Box,
    Button,
    Chip,
    Container,
    Divider,
    Grid,
    IconButton,
    LinearProgress,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useRouter } from "next/router";
import * as React from "react";
import { StepperContext } from "../StepperContext";
import { format, parseISO } from 'date-fns';

import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const { apiUrl } = publicRuntimeConfig
export default function ConfirmationSection(props: any) {

    const {
        handleNext,
        handleBack,
        setCurrentStepValidity,
        goToStep
    } = React.useContext(StepperContext);

    const [isLoading, setIsLoading] = useState(false);

    const [event, setEvent]:any = useState({
        room: {},
        schedulePoll: {
            pollOptions: []
        }
    });
    const [eventExperiences, setEventExperiences]:any = useState([]);

    const router = useRouter();
    const { eventId } = router.query
    useEffect(() => {
        setIsLoading(true);
        const getEvent = async () => {
            const response = await fetch(
                `${apiUrl}/events/${eventId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            const data = await response.json();
            setEvent(data);
        }
        const eventExperienceList = async () => {
            const response = await fetch(
                `${apiUrl}/event-experience/filter?event_id=${eventId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            const data = await response.json();
            setEventExperiences(data);
            console.log(eventExperiences)
        }
        getEvent();
        eventExperienceList();
        setIsLoading(false);
    }, []);

  
    /* 
    Hook used to tell the parent it is valid. 
    This will cause the parent to run any additional code when this condition is reached
    */
    useEffect(() => {
        // For now we will set this section's default state to valid
        if (props?.onSectionValid) {
            setCurrentStepValidity(true);
        }

    }, []);
    // Copies text to clipboard
    const copyToClipBoard = (value: string) => {
        navigator.clipboard.writeText(value);
    }

    const getExperiencesTotalCost = (): number => {
        let total = 0;
        if (eventExperiences.length > 0) {
            eventExperiences.forEach((experience:any) => {
                total += experience.experience.unit_cost
            })
        }

        return total;
    }

    return (
        <Container>
            {isLoading &&
                <LinearProgress />

            }
            {isLoading
                ? <Grid
                    container
                    direction="column"
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    style={{ minHeight: '50vh' }}
                >

                    <Grid item xs={5}>
                        <h1>Loading...</h1>
                    </Grid>

                </Grid>
                : <Container sx={{ p: 2 }}>
                    <Paper>
                        <Grid container spacing={1} sx={{ py: 1, p: 4 }}>
                            <Grid item xs={12}>
                                <Typography variant="h4" gutterBottom align="center" component="div" fontWeight="fontWeightMedium">
                                    Event Overview
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            <Grid container item rowSpacing={1} >

                                <Grid
                                    container item xs={12}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center">
                                    <Grid item>
                                        <Typography variant="h6" gutterBottom component="div">
                                            Event Details
                                        </Typography>
                                    </Grid>
                                    <Grid item
                                        onClick={() => goToStep(0)}
                                    >
                                        <Button>Edit Event</Button>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1" gutterBottom component="div">
                                        Name: {event.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1" gutterBottom component="div">
                                        {event.description}
                                    </Typography>
                                </Grid>
                                <Grid container item xs={12}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center">
                                    <Grid item>
                                        <Typography variant="body1" gutterBottom component="div">
                                            {/* Starts On: {format(new Date(parseISO(event.start_on).toString()), "H:mma MMMM do, yyyy")} */}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1" gutterBottom component="div">
                                            {/* Ends On:  {format(new Date(parseISO(event.end_on).toString()), "H:mma MMMM do, yyyy")} */}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="body1" gutterBottom component="div">
                                        Number of Experiences: {eventExperiences.length}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>

                                    <Typography variant="body1" gutterBottom component="div">
                                        Number of Guests: {event.eventGuests && event.eventGuests.length}
                                    </Typography>
                                </Grid>
                                <Grid container item xs={12}
                                    direction="row"
                                    alignItems="center">
                                    <Grid item>
                                        <Typography variant="body1" gutterBottom component="div">
                                            Uses Schedule Poll?
                                        </Typography>
                                    </Grid>
                                    <Grid item sx={{ pr: 1 }}>
                                        <Chip label={event.has_poll ? 'Yes' : 'No'} />

                                    </Grid>

                                </Grid>
                                <Grid container item xs={12}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center">
                                    <Grid container item xs={12}
                                        direction="row"
                                        alignItems="center">
                                        <Grid item sx={{ pl: 1 }}>
                                            <Typography variant="body1" gutterBottom component="div">
                                                Is Sharable?
                                            </Typography>
                                        </Grid>
                                        <Grid item sx={{ pl: 1 }}>
                                            <Chip label={event.is_sharable ? 'Yes' : 'No'} />

                                        </Grid>

                                    </Grid>

                                    {event.is_sharable &&
                                        <Grid item>
                                            <Tooltip title="Copy to clipboard">
                                                <IconButton aria-label="delete" onClick={() => copyToClipBoard(window.location.hostname + `/event/${event?.eventLink?.handle}`)}>
                                                    <Typography variant="subtitle2" gutterBottom component="div">
                                                        Event Link
                                                    </Typography>
                                                    <ContentCopyIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    }


                                </Grid>

                                <Grid item xs={12}>
                                    <b></b>
                                    <Divider />
                                </Grid>


                                <Grid
                                    container item xs={12}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center">
                                    <Grid item>
                                        <Typography variant="body1" gutterBottom component="div" fontWeight="fontWeightMedium">
                                            Room Details
                                        </Typography>
                                    </Grid>
                                    <Grid item
                                        onClick={() => goToStep(0)}
                                    >
                                        <Button>Edit Room Details</Button>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1" gutterBottom component="div">
                                        Main Lobby Name: {event.room.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom component="div" fontWeight="fontWeightMedium">
                                        Room Description
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="body1" gutterBottom component="div" >
                                        <p>{event.room.description}</p>
                                    </Typography>

                                </Grid>
                                <Grid item xs={12} sx={{ py: 3 }}>
                                    <Divider />
                                </Grid>

                                <Grid item xs={12} sx={{ py: 1.5 }}>
                                    {
                                        event.has_poll && (
                                            <div>

                                                <Grid
                                                    container item xs={12}
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    alignItems="center">
                                                    <Grid item>
                                                        <Typography variant="h6" gutterBottom component="div" fontWeight="fontWeightMedium">
                                                            Schedule Poll Details
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item
                                                        onClick={() => goToStep(1)}
                                                    >
                                                        <Button>Edit Schedule Poll</Button>
                                                    </Grid>
                                                </Grid>
                                                <Grid container item xs={12}
                                                    sx={{ pt: 3 }}
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    alignItems="center">
                                                    <Grid item>
                                                        <Typography variant="body1" gutterBottom component="div" fontWeight="fontWeightMedium">
                                                            Poll Closes On:  {format(new Date(parseISO(event.schedulePoll.closing_date).toString()), "H:mma MMMM do, yyyy")}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography variant="body1" gutterBottom component="div" fontWeight="fontWeightMedium">
                                                            Number of options to return: {event.schedulePoll.return_option_count}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>


                                            </div>

                                        )
                                    }


                                </Grid>


                                {
                                    event.has_poll && (
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1" gutterBottom component="div" >
                                                Available Poll Options
                                            </Typography>

                                        </Grid>
                                    )
                                }
                                {
                                    event.has_poll && event.schedulePoll.pollOptions.map((option:any) => (
                                        <Grid key={option.id} container item spacing={2} xs={12}>
                                            <Grid item xs={12}>
                                                <Divider />
                                            </Grid>
                                            <Grid item>
                                                Label : {option.label}
                                            </Grid>
                                            <Grid container item xs={12}
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center">

                                                <Grid item>
                                                    Start Date: {format(new Date(parseISO(option.start_date_option).toString()), " H:mma MMMM do, yyyy")}
                                                </Grid>
                                                <Grid item>
                                                    End Date: {format(new Date(parseISO(option.end_date_option).toString()), "H:mma MMMM do, yyyy")}
                                                </Grid>
                                            </Grid>

                                        </Grid>
                                    ))
                                }

                            </Grid>
                        </Grid>
                    </Paper>
                    <Container sx={{ py: 3 }}></Container>
                    <Divider />
                    <b />


                    <Grid
                        container item
                        xs={12}
                        sx={{ py: 2 }}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center">
                        <Grid item>
                            <Typography variant="h6" gutterBottom component="div" fontWeight="fontWeightMedium">
                                Event Experiences
                            </Typography>
                        </Grid>
                        <Grid item
                            onClick={() => goToStep(2)}
                        >
                            <Button>Edit Event Experiences</Button>
                        </Grid>
                    </Grid>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Experience Name</TableCell>
                                    <TableCell align="right">Experience Description</TableCell>
                                    <TableCell align="right">Experience Config</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {eventExperiences && eventExperiences.length > 0
                                    ?
                                    <>
                                        {(eventExperiences.map((exp:any) => (
                                            <TableRow
                                                key={exp.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {exp.experience.name}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2" color="text.secondary" sx={{
                                                        display: '-webkit-box',
                                                        overflow: 'hidden',
                                                        WebkitBoxOrient: 'vertical',
                                                        WebkitLineClamp: 2,
                                                    }}>
                                                        <div dangerouslySetInnerHTML={{ __html: `${exp.experience.description}` }}></div>

                                                    </Typography>

                                                </TableCell>
                                                <TableCell align="right">{exp.experience_config}</TableCell>
                                                <TableCell align="right">${exp.experience.unit_cost}</TableCell>

                                            </TableRow>
                                        )))
                                        }
                                        <TableRow
                                            key={'total-row'}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <Typography variant="body1" gutterBottom component="div" fontWeight="fontWeightMedium">
                                                    Total
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">


                                            </TableCell>
                                            <TableCell align="right"></TableCell>
                                            <TableCell align="right">
                                                ${getExperiencesTotalCost()}
                                            </TableCell>

                                        </TableRow>

                                    </>
                                    : <TableBody>
                                        <Grid
                                            container
                                            direction="column"
                                            alignItems="center"
                                            justifyContent="center"
                                            style={{ minHeight: '10vh' }}
                                            sx={{ p: 2 }}
                                        >

                                            <Grid item>
                                                <h5>No Experiences Added</h5>
                                            </Grid>
                                        </Grid>
                                    </TableBody>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Container sx={{ p: 2 }}></Container>
                    <Divider />


                    <Grid
                        container item xs={12}
                        sx={{ py: 2 }}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center">
                        <Grid item>
                            <Typography variant="h6" gutterBottom component="div" fontWeight="fontWeightMedium">
                                Event Guests
                            </Typography>
                        </Grid>
                        <Grid item
                            onClick={() => goToStep(3)}
                        >
                            <Button>Edit Guests</Button>
                        </Grid>
                    </Grid>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Guest Name</TableCell>
                                    <TableCell align="center">Guest Email</TableCell>
                                    <TableCell align="center">Invite Message</TableCell>
                                    <TableCell align="center">Status</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {event.eventGuests && event.eventGuests.length > 0
                                    ? (event.eventGuests.map((guest:any) => (
                                        <TableRow
                                            key={guest.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, p: 2 }}
                                        >
                                            <TableCell component="th" scope="row" align="center">
                                                {guest.guest_name}
                                            </TableCell>
                                            <TableCell align="center">
                                                {guest.guest_email}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" color="text.secondary" sx={{
                                                    display: '-webkit-box',
                                                    overflow: 'hidden',
                                                    WebkitBoxOrient: 'vertical',
                                                    WebkitLineClamp: 2,
                                                }}>
                                                    {guest.invite_message}
                                                </Typography>
                                            </TableCell>

                                        </TableRow>
                                    ))
                                    )
                                    : <TableBody>
                                        <Grid
                                            container
                                            direction="column"
                                            alignItems="center"
                                            justifyContent="center"
                                            style={{ minHeight: '10vh' }}>

                                            <Grid item>
                                                <h5>No Guests Added</h5>
                                            </Grid>
                                        </Grid>
                                    </TableBody>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Container>}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' , py: 1 }} alignItems="center">
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
        </Container>
    )
}
