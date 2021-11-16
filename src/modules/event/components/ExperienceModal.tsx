import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Card, CardContent,  CardMedia, Chip,  Dialog,    Grid } from '@mui/material';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const { apiUrl } = publicRuntimeConfig




export default function ExperienceModal(props: any) {
    const [experience, setExperience]:any = React.useState({
        banner_image:'',
        unit_cost:'',
        description:'',
        name:''
    });

    const { experience_id } = props;

    React.useEffect(() => {
        if (experience_id === 0 || experience_id === null) {
            return;
        }
        const getExperience = async () => {
            const response = await fetch(
                `${apiUrl}/experience/${experience_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            const data = await response.json();
            setExperience(data);
        }
        getExperience();
    }, []);
    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.handleClose}
                scroll={'paper'}
                aria-labelledby="experience-dialog-title"
                keepMounted
                aria-describedby="experience-dialog-slide-description"
                maxWidth='sm'
            >
                <Card elevation={0}>

                    {/* <CardHeader title="X">
                        <CloseIcon></CloseIcon>
                    </CardHeader> */}
                    <CardMedia
                        component="img"
                        height="250"
                        width="200"
                        image={experience.banner_image}
                        alt={experience.name}
                    />
                    <CardContent>
                        <Grid container item xs={12}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center">
                            <Typography gutterBottom variant="h5" component="div">
                                {experience.name}
                            </Typography>
                            <Chip label={`$${experience.unit_cost}`}/>
                        </Grid>

                        <Typography variant="body2" color="text.secondary">

                            <div dangerouslySetInnerHTML={{ __html: `${experience.description}` }}></div>
                        </Typography>
                    </CardContent>
                </Card>

                {props.children && props?.children}
            </Dialog>
        </div >
    );
}
