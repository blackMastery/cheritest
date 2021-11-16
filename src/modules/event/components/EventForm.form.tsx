import React, { useEffect, useState } from 'react';
import { getIn, useFormik } from 'formik';
import {
    Box,
    Button,
    Card,
    Container,
    FormControlLabel,
    Grid, IconButton,
    LinearProgress, Switch,
    TextField, Tooltip
} from '@mui/material';
import { z } from "zod";
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useRouter } from "next/router";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import useUser from "../../../../lib/useUser";



import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const { apiUrl } = publicRuntimeConfig

const validationSchema = z.object({
    name: z
        .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        })
        .min(1, 'Name should be of minimum 1 character length'),
    description: z
        .string({
            required_error: "Description is required",
            invalid_type_error: "Description must be a string",
        })
        .min(8, 'Description should be of minimum 8 characters length'),
    start_on: z.date(),
    end_on: z.date(),

    room: z.object({
        name: z.string({
            required_error: "Room Name required",
            invalid_type_error: "Description must be a string",
        }).nonempty(),
        description: z.string({
            required_error: "Room description required",
            invalid_type_error: "Description must be a string",
        }).nonempty()
    }),

});

export default function EventForm(props: any) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    // const [useSchedulePoll, setSchedulePoll] = useState(false);
    const { user } = useUser()

    const [mode, setMode] = useState(props.mode);


    const [event, setEvent] = useState({
        id: 0,
        host_user_id: 0, // Default host ID
        name: '',
        description: '',
        has_poll: false,
        is_sharable: false,
        room_id: 0,
        room: {
            parent_id: null,
            name: '',
            description: ''
        },
        start_on: new Date(),
        end_on: new Date(),
        status: 0
    });



    const formik = useFormik({
        initialValues: event,
        validationSchema: toFormikValidationSchema(validationSchema),
        onSubmit: () => {
            mode === 'create'
                ? onCreateEvent(formik.values)
                : onUpdateEvent(formik.values);
        },
    });

    const { eventId } = router.query;

    useEffect(() => {
        if (!router.isReady)
            return;
        getEvent();
    }, [router.isReady]);

    useEffect(() => {
        if (eventId) {
            setMode('edit')
        }
    }, [router.query]);

    /* 
    Hook used to tell the parent it is valid. 
    This will cause the parent to run any additional code when this condition is reached
    */
    useEffect(() => {
        if (formik.isValid && formik.dirty) {
            if (props?.onValidCallback) {
                props?.onValidCallback(true, () => formik.handleSubmit());
            }
        } else {
            if (props?.onValidCallback) {
                props?.onValidCallback(false);
            }
        }
    }, [formik.isValid])


    useEffect(() => {
        if (eventId) {
            formik.values.id = event.id;
            formik.values.name = event.name;
            formik.values.description = event.description;
            formik.values.has_poll = event.has_poll;
            formik.values.start_on = event.start_on;
            formik.values.end_on = event.end_on;
            formik.values.room = event.room;
            formik.values.room_id = event.room_id;
            formik.values.host_user_id = event.host_user_id;


            formik.setFieldValue('start_on', event.start_on);
            formik.setFieldValue('end_on', event.end_on);
            formik.setFieldValue("has_poll", event.has_poll);
            formik.setFieldValue("is_sharable", event.is_sharable);

            formik.setFieldTouched('start_on');
            formik.setFieldTouched('end_on');

            console.log(formik);
        }

    }, [event]);

    const getEvent = async () => {

        setIsLoading(true);
        // Only fetch an event if the event id is defined
        if (eventId) {
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
        } else {
            console.log('no event id')
        }
        setIsLoading(false);
    }

    const onCreateEvent = async (values: any) => {
        setIsLoading(true);

        let newValues = values;
        newValues.host_user_id = user.id;

        const response = await fetch(
            `${apiUrl}/events/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newValues)
            }
        );
        const data = await response.json();
        setEvent(data);
        if (response.status === 201) {
            console.log('event created');
            // Handling successful response
            props.onSuccess("Event Created Successfully");
            onSubmitComplete(data);

        } else {
            // Error handling
            props.onError("An error occurred, please try again");
            return;
        }
        setIsLoading(false);

    }
    const onUpdateEvent = async (values: any) => {
        setIsLoading(true);

        const response = await fetch(
            `${apiUrl}/events/`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values)
            }
        );

        const data = await response.json();
        if (response.status === 201 || response.status === 200) {
            // Handling successful response
            props.onSuccess("Event Updated Successfully");
            onSubmitComplete(data);
            setEvent(event);

        } else {
            // Error handling
            props.onError("An error occurred, please try again");
            return;
        }

        setIsLoading(false);
    }

    function onSubmitComplete(values: any) {
        // Add event_id to route params
        if (mode !== 'edit') {
            updateRoute(values.id);
        }
        // Returns info to parent component
        if (props.onSubmitCallback) {
            props?.onSubmitCallback(values);
        }
        // Tells parent component to execute whatever code it has set for when a submission is done
        if (props.onSubmitDone) {
            props?.onSubmitDone();
        }
    }

    const updateRoute = async (event_id: number) => {
        // Adds event id to url
        await router.push(`?eventId=${event_id}`, undefined, { shallow: true });
    }

    //  Handles Poll Switch
    const handlePollChange = (val: boolean) => {
        formik.setFieldValue("has_poll", val);
        setEvent((prevState => {
            prevState.has_poll = val;
            return ({ ...prevState })
        }));
    }

    // Handles Sharable Switch
    const handleSharableChange = (val: boolean) => {
        formik.setFieldValue("is_sharable", val);
        setEvent((prevState => {
            prevState.is_sharable = val;
            return ({ ...prevState })
        }));
    }


    return (
        <div>



            <Box>
                {
                    isLoading &&
                    <LinearProgress />
                }
                <Card>
                    <Container sx={{ p: 2 }}>
                        <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
                            <Grid container spacing={3} m={2}>
                                <Grid item xs={10}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="outlined-basic"
                                        variant="outlined"
                                        name="name"
                                        label="Name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        error={Boolean(formik.touched.name && formik.errors.name)}
                                        onBlur={formik.handleBlur}
                                        helperText={formik.errors.name}
                                    />
                                </Grid>
                                <Grid item xs={10}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="description"
                                        name="description"
                                        label="Description"
                                        type="text"
                                        multiline
                                        rows={4}
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={Boolean(formik.touched.description && formik.errors.description)}
                                        helperText={formik.errors.description}
                                    />
                                </Grid>

                                <Grid container item spacing={2} sx={{ mt: 2 }}>
                                    <Grid item xs={10}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="room.name"
                                            name="room.name"
                                            label="Room Name"
                                            type="text"
                                            value={formik.values.room.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={Boolean(formik.touched.room?.name && formik.errors.room?.name)}
                                            helperText={formik.errors.room?.name}
                                        />
                                    </Grid>
                                    <Grid item xs={10}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="room.description"
                                            name="room.description"
                                            label="Room Description"
                                            type="text"
                                            multiline
                                            rows={4}
                                            value={formik.values.room.description}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={Boolean(formik.touched.room?.description && formik.errors.room?.description)}
                                            helperText={
                                                getIn(formik.touched, 'room.description') &&
                                                getIn(formik.errors, 'room.description')
                                            }
                                        />
                                    </Grid>
                                </Grid>

                                <Grid item>

                                    <FormControlLabel
                                        value="top"
                                        control={
                                            <Switch color="primary"
                                                checked={formik.values.is_sharable}
                                                value={formik.values.is_sharable}
                                                onChange={(e) => {
                                                    handleSharableChange(e.target.checked);
                                                }}
                                            />
                                        }
                                        label="Make event public?"
                                        labelPlacement="start"
                                    />
                                    <Tooltip
                                        title="Allows an event link to be generated">
                                        <IconButton>
                                            <HelpOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <FormControlLabel
                                        value="top"
                                        control={
                                            <Switch color="primary"
                                                checked={formik.values.has_poll}
                                                value={formik.values.has_poll}
                                                onChange={(e) => {
                                                    handlePollChange(e.target.checked);
                                                }}
                                            />
                                        }
                                        label="Use Schedule Poll?"
                                        labelPlacement="start"
                                    />
                                    <Tooltip
                                        title="This will allow users to vote for a specific start and end time for your event.">
                                        <IconButton>
                                            <HelpOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>

                                {
                                    !event.has_poll && (
                                        <Grid container item spacing={3}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <Grid item>
                                                    <DateTimePicker
                                                        inputVariant="outlined"
                                                        label="Starts On"
                                                        required
                                                        disablePast
                                                        value={formik.values.start_on}
                                                        onChange={val => {
                                                            formik.setFieldValue("start_on", val)
                                                        }}
                                                        format="yyyy/MM/dd HH:mm"
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <DateTimePicker
                                                        inputVariant="outlined"
                                                        label="Ends On"
                                                        required
                                                        disablePast
                                                        value={formik.values.end_on}
                                                        onChange={val => {
                                                            formik.setFieldValue("end_on", val)
                                                        }}
                                                        format="yyyy/MM/dd HH:mm"
                                                    />
                                                </Grid>
                                            </MuiPickersUtilsProvider>
                                        </Grid>
                                    )
                                }


                            </Grid>
                            {mode === 'edit' && <Button color="primary" variant="contained" fullWidth type="submit"
                                disabled={!(formik.isValid && formik.dirty)}>
                                Update Event
                            </Button>}

                        </form>
                    </Container>
                </Card>
            </Box>




        </div>
    );
};
