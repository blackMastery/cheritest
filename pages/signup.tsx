import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import fetchJson from "../lib/fetchJson";
import {SignUpSchema} from '../schemas/loginSchema';
import Head from "next/head";
import RegisterForm from "../components/forms/signupform";
import {useRouter} from "next/router";



const theme = createTheme();

export default function SignUp() {
    const router = useRouter();
    return (
        <ThemeProvider theme={theme}>
            <Head>
                <title>Sign Up</title>

            </Head>

            <Container component="main">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >


                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        {/* <LockOutlinedIcon /> */}
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>

                    <RegisterForm
                        isLoading={false}
                        submitText="Register"
                        onSubmit={async (firstName, lastName, email, password) => {
                            // setEmail(email);
                            try {
                                await fetchJson("/api/register", {
                                    method: "POST",
                                    headers: {"Content-Type": "application/json"},
                                    body: JSON.stringify({
                                        "firstName": firstName,
                                        "lastName": lastName,
                                        "email": email,
                                        password,
                                    }),
                                });
                                router.push('/login')
                            } catch (error) {
                                console.error("An unexpected error happened:", error);
                                // setErrorMsg(error.data.message)
                            }

                            console.log(email, password);
                            // login({ email, password });
                        }}
                        schema={SignUpSchema}

                    />
                </Box>
            </Container>
        </ThemeProvider>
    );
}
