import Box from "@mui/material/Box";

import Container from "@mui/material/Container";
import * as React from "react";
import Layout from "../../components/layout";
import {
  LinearProgress,
  Grid,
} from "@mui/material";
import EventCard from "../../components/eventcard";
import Button from "@mui/material/Button";
import Link from "../../src/common/components/elements/Link";
import useUser from "../../lib/useUser";
import { useEffect, useState } from "react";
import ProductHeroLayout from "../../components/ProductHeroLayout";
import Typography from "@mui/material/Typography";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const { apiUrl } = publicRuntimeConfig;

export default function EventIndex() {
  const [loading, setLoading] = useState(false);

  const [events, setEvents] = useState([]);
  const { user } = useUser();

  // const { user } = userService.userValue;
  console.log({ user });

  // const { data=[],error,loading } =  useFetch(`/api/events?hostid=${user.id}`,{})

  // console.log( {data,error,loading });

  useEffect(() => {
    setLoading(true);

    const getEvents = async () => {
      const response = await fetch(`${apiUrl}/events/myevents/${user?.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);

      setEvents(data);
      setLoading(false);
    };
    getEvents();
  }, [user]);

  console.log(events);

  return (
    <Layout title="My Events">
      {loading && (
        <Box>
          <LinearProgress  />
        </Box>
      )}

      {events.length == 0 ? (
        <ProductHeroLayout
          sxBackground={{
            backgroundImage: `url(${"backgroundImage"})`,
            backgroundColor: "#fff", // Average color of the background image.
            backgroundPosition: "center",
          }}
        >
          <Typography color="black" align="center" variant="h2" >
            Get Started With Your Event
          </Typography>
          <Button
            component={Link}
            noLinkStyle
            size="large"
            variant="outlined"
            href="/event/create"
            style={{ width: "100%" }}
          >
            Create Event Add Experiences
          </Button>
        </ProductHeroLayout>
      ) : (
        <>
          <Container style={{ marginBottom: "60px", marginTop: "50px" }}>
            <Box>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                <Grid item xs={2} sm={4} md={4}>
                  <Button
                    variant="contained"
                    component={Link}
                    noLinkStyle
                    href="/event/create"
                    size="large"
                    style={{width:"50%", height:"100%"}}
                  >
                    Create Event
                  </Button>
                </Grid>

                {events?.map((ev, idx) => (
                  <Grid item xs={2} sm={4} md={4} key={idx}>
                    <EventCard event={ev} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Container>
        </>
      )}
    </Layout>
  );
}
