import Link from "next/link";
import React from "react";
import {ZodType} from "zod";
// import validateSchema from "../utils/validateSchema";
import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import {Field, Form, Formik} from "formik";
import {TextField} from 'formik-material-ui';


type AuthFormProps = {
    isLoading?: boolean;
    submitText: string;
    schema: ZodType<any, any>;
    onSubmit: (firstName: string, lastName: string, email: string, password: string) => any;
};


function validateSchema(values: any, schema: ZodType<any, any>) {
    if (!schema) return;
    try {
        schema.parse(values);
    } catch (error:any) {
        return error.formErrors.fieldErrors;
    }
}


function RegisterForm({onSubmit, schema}: AuthFormProps) {
    return (
        <div>
            <Formik
                initialValues={{firstName: "", lastName: "", email: "", password: ""}}
                onSubmit={({firstName, lastName, email, password}) => onSubmit(firstName, lastName, email, password)}
                validate={(values) => validateSchema(values, schema)}
            >
                {(_) => (
                    <>
                        <Form>

                            <Box sx={{flexGrow: 1}}>
                                <Box>
                                    <Field
                                        style={{width: "100%"}}
                                        component={TextField}
                                        name="firstName"
                                        type="text"
                                        label="First Name"
                                    />
                                </Box>
                                <Box>

                                    <Field
                                        style={{width: "100%"}}
                                        component={TextField}
                                        name="lastName"
                                        type="text"
                                        label="Last Name"
                                    />
                                </Box>
                                <Box>

                                    <Field
                                        style={{width: "100%"}}
                                        component={TextField}
                                        name="email"
                                        type="email"
                                        label="Email"
                                    />
                                </Box>
                                <Box>
                                    <Field
                                        style={{width: "100%"}}
                                        component={TextField}
                                        type="password"
                                        label="Password"
                                        name="password"
                                    />
                                </Box>


                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{mt: 3, mb: 2}}
                                >
                                    Register
                                </Button>
                                <Grid container>
                                    <Grid item>
                                        <Link href="#">
                                            {"Have an account? Log In"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Form>
                    </>
                )}
            </Formik>
        </div>
    );
}

export default RegisterForm;
