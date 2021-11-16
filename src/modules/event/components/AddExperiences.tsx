import { useEffect, useRef, useState } from "react";
import Container from "@mui/material/Container";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useRouter } from "next/router";
import ErrorSnackbar from "../../../common/components/elements/ErrorSnackbar";
import SuccessSnackbar from "../../../common/components/elements/SucessSnackbar";
import ExperienceModal from "./ExperienceModal";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const { apiUrl } = publicRuntimeConfig;
export default function AddExperiences() {


  
  const [isLoading, setIsLoading] = useState(true);
  const [experiences, setExperiencesData] = useState([]);
  const [eventExperiences, setEventExperiences] = useState([]);

  // Modal variables
  const [openExperienceModal, setExperienceModalOpen] = React.useState({
    state: false,
    id: 0,
  });

  const experienceModalRef = useRef(openExperienceModal);
  experienceModalRef.current = openExperienceModal;

  const [openSuccessSnackbar, setSuccessSnackbarOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [openErrorSnackbar, setErrorSnackbarOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSnackbarClose = (event: any, reason: string) => {
      console.log(event)
    if (reason === "clickaway") {
      return;
    }
    if (openSuccessSnackbar) {
      setSuccessSnackbarOpen(false);
    }
    if (openErrorSnackbar) {
      setErrorSnackbarOpen(false);
    }
  };

  const onSuccess = (message: string) => {
    console.log("On Success ran");
    setSuccessMessage(message);
    setSuccessSnackbarOpen(true);
  };

  const onError = (message: string) => {
    console.log("On Error ran");
    setErrorMessage(message);
    setErrorSnackbarOpen(true);
  };

  const handleExperienceModalClose = () =>
    setExperienceModalOpen({ state: false, id: 0 });

  // Route args collection
  const router = useRouter();

  const { eventId } = router.query;

  useEffect(() => {
    setIsLoading(true);

    if (!router.isReady) return;

    const getExperiences = async () => {
      const response = await fetch(`${apiUrl}/experience`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setExperiencesData(data);
    };
    getExperiences();
    getEventExperiences();
    setIsLoading(false);
  }, [router.isReady, router.query]);

  const handleExperienceModalOpen = (experienceId: any) => {
    setExperienceModalOpen((_) => {
      return { state: true, id: experienceId };
    });
  };

  const getEventExperiences = async () => {
    if (eventId) {
      const response = await fetch(
        `${apiUrl}/event-experience/filter?event_id=${eventId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setEventExperiences(data);
      console.log(eventExperiences);
    }
  };

  const handleAddedExperience = async (expId: any) => {
    const { eventId } = router.query;
    const existingExperience = eventExperiences.find(
      (exp: any) => exp.id === expId
    );

    const data = {
      event_id: Number(eventId),
      experience_id: expId,
      experience_config: "default config",
    };
    if (!existingExperience) {
      const response = await fetch(`${apiUrl}/event-experience`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      // If successful
      if (response.status == 201) {
        await response.json();
        onSuccess("Experience added");
        // Update local state
        await getEventExperiences();
      } else {
        onError("Something went wrong when adding an experience");
        console.log(
          "Something went wrong when adding an experience: " + response
        );
      }
    }
    console.log("Event experiences");
    console.log(eventExperiences);
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`${apiUrl}/event-experience/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // If successful
    console.log(response);
    if (response.status == 200) {
      console.log("Event experience deleted ", id);
      onSuccess("Experience removed");
      // Update local state
      await getEventExperiences();
    } else {
      onError("Something went wrong when removing experience ");
      console.log(
        "Something went wrong when removing experience : " + response
      );
    }
  };

  const getExperincesTotalCost = (): number => {
    let total = 0;
    if (eventExperiences.length > 0) {
      eventExperiences.forEach((experience: any) => {
        total += experience.experience.unit_cost;
      });
    }

    return total;
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Paper>
            <Container sx={{ py: 2, m: 1 }}>
              <h1>Added Experiences</h1>
              <TableContainer>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Experience Name</TableCell>
                      <TableCell align="right">
                        Experience Description
                      </TableCell>
                      <TableCell align="right">Experience Config</TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {eventExperiences &&
                      eventExperiences?.map((exp: any) => (
                        <TableRow
                          key={exp.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {exp.experience.name}
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              sx={{
                                display: "-webkit-box",
                                overflow: "hidden",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
                              }}
                              variant="body1"
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: `${exp.experience.description}`,
                                }}
                              ></div>
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            {exp.experience_config}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            ${exp.experience.unit_cost}
                          </TableCell>
                          <TableCell align="right">
                            <Button onClick={() => handleDelete(exp.id)}>
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    <TableRow
                      key={"total-row"}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Typography
                          variant="body1"
                          gutterBottom
                          component="div"
                          fontWeight="fontWeightMedium"
                        >
                          Total
                        </Typography>
                      </TableCell>
                      <TableCell align="right"></TableCell>
                      <TableCell align="right"></TableCell>
                      <TableCell align="right">
                        ${getExperincesTotalCost()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
          </Paper>
          <Paper>
            <Container sx={{ py: 2, m: 1 }}>
              <h1>Available Experiences</h1>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                {experiences &&
                  experiences.map((exp: any, index) => {
                    //   const price  =  `$${exp.unit_cost}`;
                    return (
                      <Grid item xs={2} sm={4} md={4} key={index}>
                        <Card sx={{ maxWidth: 345 }}>
                          <CardMedia
                            component="img"
                            height="140"
                            image={exp.banner_image}
                            alt={exp.name}
                          />
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
                              {exp.name}
                            </Typography>
                            <Chip label={`$${exp.unit_cost}`}></Chip>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: "-webkit-box",
                                overflow: "hidden",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
                              }}
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: `${exp.description}`,
                                }}
                              ></div>
                            </Typography>
                          </CardContent>
                          <CardActions>
                            {eventExperiences.find((e: any) => {
                              return exp.id === e.experience_id;
                            }) ? (
                              <Button size="small" disabled={true}>
                                Added
                              </Button>
                            ) : (
                              <Button
                                size="small"
                                onClick={() => handleAddedExperience(exp.id)}
                              >
                                Add
                              </Button>
                            )}
                            <Button
                              size="small"
                              onClick={() => handleExperienceModalOpen(exp.id)}
                            >
                              Learn More
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    );
                  })}
              </Grid>
            </Container>
          </Paper>

          {openExperienceModal.id != 0 && (
            <ExperienceModal
              experience_id={openExperienceModal.id}
              open={openExperienceModal.state}
              handleClose={handleExperienceModalClose}
            >
              {eventExperiences.find((e: any) => {
                return openExperienceModal.id === e.experience_id;
              }) ? (
                <Button
                  size="small"
                  onClick={() => {
                    handleDelete(openExperienceModal.id);
                    handleExperienceModalClose();
                  }}
                >
                  Remove from Event
                </Button>
              ) : (
                <Button
                  size="small"
                  onClick={() => {
                    handleAddedExperience(openExperienceModal.id);
                    handleExperienceModalClose();
                  }}
                >
                  Add to Event
                </Button>
              )}
            </ExperienceModal>
          )}
        </>
      )}

      <SuccessSnackbar
        open={openSuccessSnackbar}
        duration={3000}
        onClosed={handleSnackbarClose}
        message={successMessage}
        action={null}
      ></SuccessSnackbar>
      <ErrorSnackbar
        open={openErrorSnackbar}
        duration={3000}
        onClosed={handleSnackbarClose}
        message={errorMessage}
        action={null}
      ></ErrorSnackbar>
    </>
  );
}
