import { z } from "zod";
import {
    Box,
    Button,
    Container,
    Grid,
    LinearProgress,
    Paper,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {  useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import React, { useEffect, useRef, useState } from "react";
// import PollOption from "../poll-option.interface";
// import Container from "@mui/material/Container";
import { useRouter } from "next/router";
import getConfig from 'next/config';
import { format } from 'date-fns';

const { publicRuntimeConfig } = getConfig();

const { apiUrl } = publicRuntimeConfig

const validationSchema = z.object({
    closing_date: z
        .date({
            required_error: "A closing Date is required",
            invalid_type_error: "Invalid date",
        }),
    return_option_count: z.number(),
});

const pollOptionValidationSchema = z.object({
    label: z.string({
        required_error: "Label required",
        invalid_type_error: "Label must be a string",
    }),
    start_date_option: z.date(),
    end_date_option: z.date()
});

export default function SchedulePollForm(props:any) {

    const [schedulePoll, setSchedulePoll]:any = useState({
        id: 0,
        event_id: 0,
        closing_date: new Date(),
        return_option_count: 0,
        pollOptions: []
    });

    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const pollOptionsRef = useRef(schedulePoll);
    pollOptionsRef.current = schedulePoll.pollOptions;

    const [mode, setFormMode] = useState(props.mode);


    // Collecting the Poll ID from router args
    // @ts-ignore
    const { poll_id } = router.query

    // Collecting the event id from router args
    const { eventId } = router.query;

    const formik = useFormik({
        initialValues: schedulePoll,
        validationSchema: toFormikValidationSchema(validationSchema),
        onSubmit: (values) => {
            handlePollSubmit(values)
        },
    });

    const formikPollOption = useFormik({
        initialValues: {
            id: 0,
            label: '',
            start_date_option: new Date(),
            end_date_option: new Date(),
        },
        validationSchema: toFormikValidationSchema(pollOptionValidationSchema),
        onSubmit: (values) => {
            handlePollOptionSubmit(values);
        },
    });


    useEffect(() => {
        if (!router.isReady)
            return;
        getSchedulePoll();
    }, [router.isReady]);

    useEffect(() => {
        const { poll_id } = router.query;
        if (poll_id) {
            setFormMode('edit')
        }
    }, [router.query]);

    /* 
   Hook used to tell the parent it is valid. 
   This will cause the parent to run any additional code when this condition is reached
   */
    useEffect(() => {
        if (formik.isValid && formik.dirty && pollOptionsRef.current.length >= 2) {
            if (props.onValidCallback) {

                props?.onValidCallback(true, () => formik.handleSubmit());
            }
        } else {
            if (props.onValidCallback) {
                props?.onValidCallback(false);
            }
        }
        console.log('Is valid?', formik.isValid);
        console.log('Is valid?', pollOptionsRef.current.length >= 2);


    }, [formik.isValid, schedulePoll])

    useEffect(() => {
        // Update related only runs if in edit mode
        if (mode === 'edit') {
            formik.values.id = schedulePoll.id;
            formik.values.event_id = schedulePoll.event_id;
            formik.values.closing_date = schedulePoll.closing_date;
            formik.values.return_option_count = schedulePoll.return_option_count;

            formik.setFieldValue('return_option_count', schedulePoll.return_option_count);
            formik.setFieldValue('closing_date', schedulePoll.closing_date);
        }

    }, [schedulePoll]);

    const getSchedulePoll = async () => {

        if (eventId) {
            // setIsLoading(true);

            const response = await fetch(
                `${apiUrl}/schedule-poll/event/${eventId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const data = await response.json();
            setSchedulePoll(data);
            // router.push(`?poll_id=${data.id}`, undefined, {shallow: true});
            // setIsLoading(false);
        }
    }
    const handlePollSubmit = async (values:any) => {
        if (mode === 'create') {
            createPoll(values).then();
        } else if (mode === 'edit') {
            updatePoll(values).then();
        }
    }

    const handlePollOptionSubmit = async (values:any) => {
        setIsLoading(true);

        if (mode === 'create') {
            const data = {
                'poll_id': 0,
                ...values
            }
            setSchedulePoll((prevState:any) => {
                prevState.pollOptions.push(data);
                return ({ ...prevState });
            }
            );

            formikPollOption.resetForm();
        } else if (mode === 'edit') {
            const data = {
                'poll_id': schedulePoll.id !== 0 ? schedulePoll.id : 0,
                ...values
            }
            addPollOption(data).then();
            formikPollOption.resetForm();
        }
        setIsLoading(false);

    }

    const createPoll = async (values:any) => {
        setIsLoading(true);
        console.log(values);
        // Set the event id
        values.event_id = Number(eventId);
        // @ts-ignore
        const data = {
            'pollOptions': pollOptionsRef.current,
            ...values
        }
        const response = await fetch(
            `${apiUrl}/schedule-poll`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values)
            }
        );
        // If successful
        if (response.status == 201) {
            props.onSuccess("Schedule Poll created!");
            const data = await response.json();
            console.log(data);
            // Update local state
            setSchedulePoll(data);
            // Update Route args
            await router.push(`?eventId=${data.event_id}&poll_id=${data.id}`, undefined, { shallow: true });

            // Tells parent component to execute whatever code it has set for when a submission is done
            if (props.onSubmitDone) {
                props.onSubmitDone();
            }

        } else {
            props.onError("An error occurred when creating the schedule poll");
            console.log('Something went wrong when creating schedule poll: ');
            console.log(response);
        }
        setIsLoading(false);

    }

    const updatePoll = async (values: any) => {
        setIsLoading(true);
        console.log('Update Values');
        values.pollOptions = pollOptionsRef.current;
        console.log(values);
        const response = await fetch(
            `${apiUrl}/schedule-poll`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values)
            }
        );
        // If successful
        if (response.status === 201 || response.status === 200) {
            const data = await response.json();
            console.log(data);
            // Update local state
            setSchedulePoll(data);
        } else {
            console.log('Something went wrong when updating schedule poll: ' + response);
        }
        setIsLoading(false);
    }

    const handleClosePoll = async () => {
        // console.log('Update Values');
        // let eid = parseInt(event_id);
        // values.pollOptions = pollOptionsRef.current;
        // console.log(values);
        // const response = await fetch(
        //     `${apiUrl}/schedule-poll`,
        //     {
        //         method: 'PATCH',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(values)
        //     }
        // );
        // // If successful
        // if (response.status === 201 || response.status === 200) {
        //     const data = await response.json();
        //     console.log(data);
        //     // Update local state
        //     setSchedulePoll(data);
        // } else {
        //     console.log('Something went wrong when updating schedule poll: ' + response);
        // }
    }

    const handleDelete = async (option:any) => {
        if (mode === 'create') {
            setSchedulePoll((prevState:any) => {
                let filteredOptions = prevState.pollOptions.filter((op:any) => op.label !== option.label);
                prevState.pollOptions = filteredOptions;
                return ({ ...prevState });
            }
            );
        } else if (mode === 'edit') {
            deletePollOption(option.id);
        }
    }

    const addPollOption = async (option:any) => {
        setIsLoading(true);
        const response = await fetch(
            `${apiUrl}/schedule-poll/poll_option`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(option)
            }
        );
        // If successful
        if (response.status === 201) {
            const data = await response.json();
            console.log('Added poll option');
            setSchedulePoll((prevState:any) => {
                prevState.pollOptions.push(data);
                return ({ ...prevState });
            }
            );
        } else {
            console.log('Something went wrong when adding poll option: ' + response);
        }
        setIsLoading(false);
    }
    const deletePollOption = async (optionId:any) => {
        setIsLoading(true);
        const response = await fetch(
            `${apiUrl}/schedule-poll/poll_option/${optionId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        // If successful
        if (response.status === 200) {
            // const data = await response.json();
            console.log('Deleted poll option');
            setSchedulePoll((prevState:any) => {
                let newOptions = prevState.pollOptions.filter((op:any) => {
                    return op.id !== optionId;
                });
                prevState.pollOptions = newOptions;
                return ({ ...prevState });
            }
            );
        } else {
            console.log('Something went wrong when updating schedule poll: ' + response);
        }
        setIsLoading(false);
    }

    return (
        <div>
            {
                isLoading &&
                <LinearProgress />
            }
            <Box sx={{ p: 2 }}>
                {
                    mode === 'edit' && (
                        <div>
                            <Button onClick={() => router.push(`schedule-poll/results?poll_id=${schedulePoll.id}`)}>
                                View Current Results
                            </Button>
                            <br />
                            <Button onClick={() => handleClosePoll()}>
                                Close Poll
                            </Button>
                        </div>
                    )
                }
                <Grid container spacing={3} m={2}>
                    <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>

                        <Grid container item spacing={3} sx={{ mt: 1 }}>
                            <Grid item>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DateTimePicker
                                        inputVariant="outlined"
                                        label="Closing Date"
                                        disablePast
                                        value={formik.values.closing_date}
                                        onChange={(val:any) => {
                                            formik.setFieldValue("closing_date", val)
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item>
                                <TextField
                                    required
                                    fullWidth
                                    id="outlined-basic"
                                    variant="outlined"
                                    name="return_option_count"
                                    label="Return Option Count"
                                    type="number"
                                    value={formik.values.return_option_count}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.errors.return_option_count)}
                                    helperText={formik.errors.return_option_count}
                                />
                            </Grid>

                        </Grid>
                        <Grid item sx={{ mt: 1 }} xs={12}>
                            {mode === 'edit' && <Button color="primary" variant="contained" fullWidth
                                type="submit"
                                disabled={!(formik.isValid && formik.dirty)}
                            >
                                Edit Poll
                            </Button>}
                        </Grid>
                    </form>

                    <form noValidate autoComplete="off" onSubmit={formikPollOption.handleSubmit}>
                        <Grid container item spacing={3} sx={{ mt: 2 }}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid item>
                                    <TextField
                                        required
                                        fullWidth
                                        id="outlined-basic"
                                        variant="outlined"
                                        name="label"
                                        label="Label"
                                        value={formikPollOption.values.label}
                                        onChange={formikPollOption.handleChange}
                                        error={Boolean(formikPollOption.errors.label)}
                                        helperText={formikPollOption.errors.label}
                                    />
                                </Grid>
                                <Grid item>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <DateTimePicker
                                            inputVariant="outlined"
                                            label="Start Date"
                                            clearable
                                            value={formikPollOption.values.start_date_option}
                                            onChange={val => {
                                                formikPollOption.setFieldValue("start_date_option", val)
                                            }} />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <DateTimePicker
                                            inputVariant="outlined"
                                            clearable
                                            label="End Date"
                                            value={formikPollOption.values.end_date_option}
                                            onChange={val => {
                                                formikPollOption.setFieldValue("end_date_option", val)
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item>
                                    <Button color="primary" variant="contained" fullWidth
                                        onClick={() => handlePollOptionSubmit(formikPollOption.values)}
                                        disabled={!(formikPollOption.isValid && formikPollOption.dirty)}
                                    >
                                        Add Poll Option
                                    </Button>
                                </Grid>
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </form>
                    <Container>
                        <h1>Added Poll Options</h1>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Label</TableCell>
                                        <TableCell align="center">Start Date</TableCell>
                                        <TableCell align="center">End Date </TableCell>
                                        <TableCell align="center">Action </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {schedulePoll?.pollOptions?.map((option:any) => (
                                        <TableRow
                                            key={option.label + '-' + option.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" align="left">
                                                {option.label}
                                            </TableCell>
                                            <TableCell align="center">
                                                {format(new Date(option.start_date_option), "H:mma MMMM do, yyyy")}
                                            </TableCell>
                                            <TableCell align="center">
                                                {format(new Date(option.end_date_option), "H:mma MMMM do, yyyy")}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button onClick={() => handleDelete(option)}>
                                                    Remove
                                                </Button>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Container>
                </Grid>
            </Box>
        </div>
    )
        ;
};
