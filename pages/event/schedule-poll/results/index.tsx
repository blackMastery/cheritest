import Container from "@mui/material/Container";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import DashboardComponent from "../../../../src/common/components/Dashboard";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const { apiUrl } = publicRuntimeConfig

export default function SchedulePollResults() {

    const [pollResult, setPollResult] = useState([]);

    const router = useRouter();
    const {poll_id} = router.query;

    useEffect(() => {
        if (!router.isReady)
            return;

        const pollData = async () => {
            const response = await fetch(
                `${apiUrl}/schedule-poll/poll_option/${poll_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            if (response.status == 200) {
                const data = await response.json();
                console.log(data);
                // Update local state
                setPollResult(data);
            } else {
                console.log('Something went wrong when retrieving: ' + response);
            }
        }
        pollData();
    }, [router.isReady]);

    const handleOptionConfirm = async (pollOptionId:any) => {
        const data = {
            'user_id': 1,
            'poll_option_id': parseInt(pollOptionId)
        };
        const response = await fetch(
            `${apiUrl}/schedule-poll/confirm-event-date`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }
        );
        if(response.status == 201){
            const data = await response.json();
            console.log(data)
        }
        else {
            console.log('Something went wrong when confirming an option ' + response);
        }

    };

    return (
        <DashboardComponent>
            <Container>
                <Container>
                    <h1>Schedule Poll Results</h1>
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Label Name</TableCell>
                                    <TableCell align="right">Start Date</TableCell>
                                    <TableCell align="right">End Date</TableCell>
                                    <TableCell align="right">Vote Count</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pollResult && (pollResult.map((option:any) => (
                                        <TableRow
                                            key={option.id}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell component="th" scope="row">
                                                {option.label}
                                            </TableCell>
                                            <TableCell align="center">
                                                {option.start_date_option}
                                            </TableCell>
                                            <TableCell align="center">
                                                {option.end_date_option}
                                            </TableCell>
                                            <TableCell align="center">
                                                {option.voteCount}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button onClick={() => handleOptionConfirm(option.id)}>
                                                    Confirm Option
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Container>
        </DashboardComponent>
    )
}
