import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import * as React from "react";
import PollOptionVoteForm from "../../../../src/modules/schedule-poll/components/PollOptionVotingForm.form";

export default function SchedulePollVotingPage() {

    return (
        <Container>
            <Box sx={{my: 4, mx: 3, py: 1}}>
                <PollOptionVoteForm/>
            </Box>
        </Container>
    )
}
