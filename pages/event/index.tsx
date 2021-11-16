import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "../../src/common/components/elements/Link";
import Container from "@mui/material/Container";
import * as React from "react";

import { useEffect, useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import DashboardComponent from "../../src/common/components/Dashboard";
import useUser from "../../lib/useUser";

import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const { apiUrl } = publicRuntimeConfig;

export default function EventIndex() {
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEventsData]: any = useState([]);
  const { user } = useUser();

  useEffect(() => {
    setIsLoading(true);
    const events = async () => {
      const response = await fetch(`${apiUrl}/events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      setEventsData(data);
      setIsLoading(false);
    };
    events();
  }, [user]);

  // Copies text to clipboard
  const copyToClipBoard = (value: string) => {
    console.log(value);
    navigator.clipboard.writeText(value);
  };

  return (
    <DashboardComponent sectionTitle="My Events">
      {isLoading ? (
        <LinearProgress />
      ) : (
        <Container>
          <Box sx={{ my: 3 }}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography variant="h4" component="h1" gutterBottom>
                  My Events
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  component={Link}
                  noLinkStyle
                  href="/event/create"
                >
                  New Event
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          <Box sx={{ my: 3 }}>
            {events.length > 0 ? (
              <Grid
                container
                spacing={{ py: 2, xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                {events.map((event: any, index: any) => {
                  return (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                      <Card sx={{ maxWidth: 345 }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={event.cover_image}
                          alt={event.name}
                        />
                        <CardContent>
                          <Grid
                            container
                            item
                            xs={12}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
                              {event.name}
                            </Typography>
                            {event.is_sharable && (
                              <Grid item>
                                <Tooltip title="Copy to event link clipboard">
                                  <IconButton
                                    aria-label="delete"
                                    onClick={() =>
                                      copyToClipBoard(
                                        window.location.hostname +
                                          `/event/${event?.eventLink?.handle}`
                                      )
                                    }
                                  >
                                    <ContentCopyIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                            )}
                          </Grid>

                          <Typography variant="body2" color="text.secondary">
                            {event.description}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Event Experiences: {event?.eventExperiences.length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            No. of Invitees: {event?.eventGuests.length}
                          </Typography>
                          {event.is_sharable ? (
                            <Typography variant="body2" color="text.secondary">
                              Public: Yes
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Public: No
                            </Typography>
                          )}

                          {event.has_poll ? (
                            <Typography variant="body2" color="text.secondary">
                              Has Schedule Poll: Yes
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Has Schedule Poll: No
                            </Typography>
                          )}
                          {event.has_poll &&
                            event.schedulePoll &&
                            (event.schedulePoll.closing_date > new Date() ? (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Schedule Poll Status: Complete
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Schedule Poll Status: Ongoing
                              </Typography>
                            ))}
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            component={Link}
                            href={`event/${event.id}`}
                          >
                            Edit
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Grid
                container
                direction="column"
                spacing={2}
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: "50vh" }}
              >
                <Grid item xs={5}>
                  <h1>No Events Created</h1>
                </Grid>
              </Grid>
            )}
          </Box>
        </Container>
      )}
    </DashboardComponent>
  );
}
