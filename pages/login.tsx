import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthForm from "../components/forms/authform";
import { LoginSchema } from "../schemas/loginSchema";
import Head from "next/head";
import fetchJson from '../lib/fetchJson'
import useUser from '../lib/useUser'
import { useState } from 'react'
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig


function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const theme = createTheme();

export default function LoginIn() {
  const [open, setOpen] = useState(false);

  const { mutateUser } = useUser({
    redirectTo: '/marketplace',
    redirectIfFound: true,
  })


  const handleClick = () => {
    setOpen(true);
  };


  const handleClose = (reason:any) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  async function handleSubmit(email:string, password:string) {

    const body = {
     email: email, 
      password:password
    }

    try {
      mutateUser(
        await fetchJson(`${ apiUrl }/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      )
    } catch (error) {
      console.error('An unexpected error happened:', error)
      handleClick()
      // setErrorMsg(error.data.message)
    }
  }



  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Login</title>
      </Head>

      <Container component="main">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            {/* <LockOutlinedIcon /> */}
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <AuthForm
            isLoading={false}
            submitText="Login"
            onSubmit={async(email, password)=> await handleSubmit(email, password)}
            schema={LoginSchema}
          />
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>

                <Alert onClose={handleClose}  severity="error">
                  Incorrect Password Or Don't Have An Account
                </Alert>
                </Snackbar>

        </Box>
      </Container>
    </ThemeProvider>
  );
}
