import React from 'react'
import {Typography, Paper} from '@mui/material'

export default function Success() {

  return (
    <Paper sx={{mb: 4}}>
      <Typography variant="h2" align="center" sx={{ py: 4 }}>
        Your event has been created!
      </Typography>

    </Paper>
  )
}
