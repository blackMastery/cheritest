import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import Container from "@mui/material/Container";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const { apiUrl } = publicRuntimeConfig
export default function PollOptionVoteForm() {
    const [schedulePoll, setSchedulePoll]:any = useState({});

    const router = useRouter();
    const {poll_id} = router.query;

    useEffect(() => {
        if (!router.isReady)
            return;

        const schedulePollData = async () => {
            const response = await fetch(
                `${apiUrl}/schedule-poll/${poll_id}`,
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
                setSchedulePoll(data);
            } else {
                console.log('Something went wrong when retrieving: ' + response);
            }
        }
        schedulePollData();
    }, [router.isReady]);

    const handleVoteSubmit = async (pollOptionId: any) => {
        const data = {
            'user_id': 1,
            'poll_option_id': parseInt(pollOptionId)
        };
        const response = await fetch(
            `${apiUrl}/schedule-poll/poll-user-vote`,
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
            console.log('Something went wrong when casting the vote ' + response);
        }

    };

    return (
        <div>
            <Container>
                <h1>Available Schedule Options</h1>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Label</TableCell>
                                <TableCell align="right">Start Date</TableCell>
                                <TableCell align="right">End Date</TableCell>
                                <TableCell align="right"> </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {schedulePoll.pollOptions?.map((option:any) => (
                                <TableRow
                                    key={option.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">
                                        {option.label}
                                    </TableCell>
                                    <TableCell align="right">
                                        {option.start_date_option}
                                    </TableCell>
                                    <TableCell align="right">
                                        {option.end_date_option}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button onClick={() => handleVoteSubmit(option.id)}>
                                            Vote On this Option
                                        </Button>
                                    </TableCell>

                                </TableRow>
                            ))
                            }
                        </TableBody>

                    </Table>
                </TableContainer>
            </Container>
        </div>
    );
};
