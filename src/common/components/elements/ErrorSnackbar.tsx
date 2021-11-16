import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
// import EventCard from '../../../../components/eventcard';


export default function ErrorSnackbar(props: any) {
    const {
        open,
        duration,
        message,
        action,
        onClosed
    } = props;

    const [state, _]:any = React.useState({
        vertical: 'bottom',
        horizontal: 'center',
    });
    const { vertical, horizontal } = state;

    const handleClose = (reason:any) => {
        if (reason === 'clickaway') {
            return;
        }

        onClosed();
    };

    //   const action = (
    //     <React.Fragment>
    //       <Button color="secondary" size="small" onClick={handleClose}>
    //         UNDO
    //       </Button>
    //       <IconButton
    //         size="small"
    //         aria-label="close"
    //         color="inherit"
    //         onClick={handleClose}
    //       >
    //         <CloseIcon fontSize="small" />
    //       </IconButton>
    //     </React.Fragment>
    //   );

    
    return (
        <div>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}

                open={open}
                autoHideDuration={duration}
                onClose={handleClose}
                message={message}
                action={action}
            >
                <Alert onClose={(_)=>handleClose('clickaway')} severity="error" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}