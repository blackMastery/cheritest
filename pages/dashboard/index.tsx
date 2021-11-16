import { Grid } from "@mui/material";
import React from "react";
import DashboardComponent from "../../src/common/components/Dashboard";

export default function DashboardPage() {


    return (
        <DashboardComponent>
            <Grid
                container
                direction="column"
                spacing={2}
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '100vh' }}
            >

                <Grid item xs={5}>
                    <h1>Dashboard View</h1>
                </Grid>

            </Grid>

        </DashboardComponent>
    );
}
