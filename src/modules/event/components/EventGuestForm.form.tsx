import {
    Box,
    Button,
    Card,
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
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import Container from "@mui/material/Container";
import ConfirmationDialog from "./ConfirmationDialog";



import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const { apiUrl } = publicRuntimeConfig
const validationSchema = z.object({
    guest_name: z
        .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        })
        .min(1, 'Name should be of minimum 1 character length'),
    guest_email: z
        .string()
        .email({
            message: "Invalid email",
        }),
    invite_message: z
        .string({
            required_error: "Invite message is required",
            invalid_type_error: "Description must be a string",
        })
        .min(8, 'Invite message should be of minimum 8 characters length'),

});
export default function EventGuestForm(props: any) {
    const formik = useFormik({
        initialValues: {
            guest_email: '',
            guest_name: '',
            invite_message: '',
            status: 0,
        },
        validationSchema: toFormikValidationSchema(validationSchema),
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
    const [guestForDialog, setGuestForDialog]: any = React.useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleDialogOpen = (guest: any) => {
        setGuestForDialog(guest);
        setOpenConfirmDialog(true);

    };
    const handleDialogClose = () => {
        setOpenConfirmDialog(false);
    }

    const [eventGuests, setEventGuests]: any = useState([]);
    const [guestEmailUsed, setGuestEmailUsed] = useState(false);

    const { eventId } = props;

    useEffect(() => {
        const eventGuestsData = async () => {
            setIsLoading(true);

            const response = await fetch(
                `${apiUrl}/event-guest/filter?event_id=${eventId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            const data = await response.json();
            setEventGuests(data);
            setIsLoading(false);
        }
        eventGuestsData();
    }, []);


    /* 
        Hook used to tell the parent it is valid. 
        This will cause the parent to run any additional code when this condition is reached
    */
    useEffect(() => {
        if (eventGuests && eventGuests.length >= 1) {
            if (props?.onValidCallback) {

                // Tells parent component to execute whatever code it has set for when a submission is done
                if (props.onSubmitDone) {
                    props?.onValidCallback(true, () => props?.onSubmitDone());

                } else {

                    props?.onValidCallback(true);
                }
                props?.onValidCallback(true);

            }
        } else {
            if (props?.onValidCallback) {
                props?.onValidCallback(false);
            }
        }
    }, [eventGuests]);


    const handleSubmit = async (values: any) => {

        setIsLoading(true);
        const data = {
            'event_id': parseInt(eventId),
            ...values
        }
        const response = await fetch(
            `${apiUrl}/event-guest`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }
        );
        // If successful
        if (response.status == 201) {
            const data = await response.json();
            console.log(data);

            formik.resetForm();

            // Update local state
            setEventGuests([...eventGuests, data]);

            // Show Success notifier
            props.onSuccess('Guest Added');


        } else {
            // Show Error notifier
            props.onError('An error occurred while adding the guest');
            console.log('Something went wrong when adding an event guest: ' + response);
        }
        console.log(eventGuests);
        setIsLoading(false);
    }

    const handleDelete = async (id: number) => {
        setIsLoading(true);
        console.log('delete: ' + id);
        const response = await fetch(
            `${apiUrl}/event-guest/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        // If successful
        if (response.status == 200) {
            console.log('Event Guest deleted');
            // Update local state
            const guests = eventGuests.filter((g:any) => g.id !== id);
            setEventGuests(guests);
            // Show Success notifier
            props.onSuccess('Guest removed successfully');

        } else {
            // Show Error notifier
            props.onError('Something went wrong while removing the guest');
            console.log('Something went wrong when removing a participant : ' + response);
        }
        setIsLoading(false);
    }
// @ts-ignore
    const validateGuestEmail = async () => {
        // This is to stop it from firing on render
        if (formik.touched.guest_email) {
            const response = await fetch(
                `${apiUrl}/event-guest/filter-guest?event_id=${eventId}&guest_email=${formik.values.guest_email}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            // If successful
            if (response.status == 200) {
                let data = await response.json();
                console.log('response: ' + data);
                if (data.length > 0) {
                    console.log('me log')
                    formik.errors.guest_email = 'A guest with this email already exists';
                    setGuestEmailUsed(true);
                } else {
                    formik.setFieldError('guest_email', undefined);
                    setGuestEmailUsed(false);
                }

            }
            else {
                console.log('An error occurred while validating the guest email', response)
            }
        }

    }

    return (
        <div>
            {
                isLoading &&
                <LinearProgress />
            }
            <Box sx={{ p: 2 }}>
                <Card elevation={0}>
                    <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3} xs={12} sx={{ p: 2, m: 2}} alignItems="center">
                            <Grid item xs={10}>
                                <TextField
                                    required
                                    fullWidth
                                    id="outlined-basic"
                                    variant="outlined"
                                    name="guest_name"
                                    label="Guest Name"
                                    value={formik.values.guest_name}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched.guest_name && formik.errors.guest_name)}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.errors.guest_name}
                                />
                            </Grid>
                            <Grid item xs={10}>
                                <TextField
                                    required
                                    fullWidth
                                    id="outlined-basic"
                                    variant="outlined"
                                    name="guest_email"
                                    label="Guest Email"
                                    value={formik.values.guest_email}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched.guest_email && guestEmailUsed || formik.touched.guest_email && formik.errors.guest_email
                                    )}
                                    onBlur={() => {
                                        formik.handleBlur
                                        // validateGuestEmail().then(() => formik.handleBlur);
                                    }}
                                    helperText={formik.errors.guest_email}
                                />
                            </Grid>
                            <Grid item xs={10}>
                                <TextField
                                    required
                                    fullWidth
                                    id="invite_message"
                                    name="invite_message"
                                    label="Invite Message"
                                    type="text"
                                    multiline
                                    rows={4}
                                    value={formik.values.invite_message}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={Boolean(formik.touched.invite_message && formik.errors.invite_message)}
                                    helperText={formik.errors.invite_message}
                                />
                            </Grid>
                        </Grid>
                        <Button color="primary" variant="contained" fullWidth type="submit"
                            disabled={!(formik.isValid && formik.dirty)}
                        >
                            Add Guest
                        </Button>
                    </form>
                </Card>

                <Container>
                    <h1>Added Guests</h1>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Guest Name</TableCell>
                                    <TableCell align="center">Guest Email</TableCell>
                                    <TableCell align="center">Invite Message </TableCell>
                                    <TableCell align="center">Action </TableCell>
                                </TableRow>
                            </TableHead>
                            {
                                eventGuests.length > 0

                                    ? <TableBody>
                                        {eventGuests?.map((guest: any) => (
                                            <TableRow
                                                key={guest.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" align="left">
                                                    {guest.guest_name}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {guest.guest_email}
                                                </TableCell>
                                                <TableCell align="center">{guest.invite_message}</TableCell>
                                                <TableCell align="center">
                                                    <Button onClick={() => handleDialogOpen(guest)}>
                                                        Remove
                                                    </Button>
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    :
                                    <TableBody>
                                        <Grid
                                            container
                                            direction="column"
                                            alignItems="center"
                                            justifyContent="center"
                                            style={{ minHeight: '10vh' }}
                                        >

                                            <Grid item>
                                                <h5>No Guests Added</h5>
                                            </Grid>

                                        </Grid>
                                    </TableBody>
                            }
                        </Table>
                    </TableContainer>
                </Container>

                <ConfirmationDialog
                    open={openConfirmDialog}
                    guest={guestForDialog}
                    handleClose={() => handleDialogClose()}
                    handleCancel={() => handleDialogClose()}
                    handleAgree={() => {
                        handleDialogClose();
                        handleDelete(guestForDialog.id);
                    }}
                />
            </Box>
        </div>
    )
}
