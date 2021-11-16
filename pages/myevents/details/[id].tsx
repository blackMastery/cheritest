import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useFetch from "use-http";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

import Layout from "../../../components/layout";
import { Chip, Button, LinearProgress, CircularProgress } from "@mui/material";
import Link from "../../../src/common/components/elements/Link";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const { apiUrl } = publicRuntimeConfig;

function ExperienceProps({ id }: any) {
  let { loading,  data } = useFetch(
    `/api/experiencedetail?id=${id}`,
    {},
    []
  );
  console.log({ data });
  return (
    <>
      <Link
        // onClick={handleOpen}
        underline="none"
        href={`/loadexperience/${id}`}
        style={{ width: "100%" }}
        passHref
      >
        <Button variant="outlined" size="small">
          {loading ? <CircularProgress color="secondary" /> : data.name}
        </Button>
      </Link>
    </>
  );
}

export default function Index({ id }: any) {
  // const router = useRouter();
  // const { id } = router.query;

  const options = {}; // these options accept all native `fetch` options

  let {
    loading,
    error,
    data = [],
  } = useFetch(`${apiUrl}/events/${id}`, options, []);

  console.log(loading, error, data, id);

  if (loading) return <LinearProgress />;

  // description: "The main mealtime in Spain is lunch (la comida, el almuerzo), which usually takes place between 2 p.m. and 3 p.m., has at least two courses and may involve a short half-hour 'siesta' afterwards. Breakfast (el desayuno) is light and nowaways often takes place midmorning at 10 or 11 a.m. rather than first thing"
  // end_on: "2021-10-23T00:00:00.000Z"
  // eventExperiences: [{…}]
  // has_poll: false
  // host_user_id: 1
  // id: 4
  // is_sharable: false
  // name: "Dinner night with cherimoya staff"
  // room_id: 2
  // start_on: "2021-10-23T00:00:00.000Z"
  // status: "event_active"
  return (
    <Layout title="Event Details">
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Card>
            <CardHeader title={data.name} />

            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                {data.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Guests:
              </Typography>

              {data.eventGuests.map((t: any) => (
                <Chip label={t.guest_name} variant="outlined" />
              ))}
            </CardActions>

            <CardActions>
              {data.eventExperiences?.map((e: any, idx:number) => (
                <ExperienceProps  key={idx} id={e.experience_id} />
              ))}
            </CardActions>
          </Card>
        </Box>
      </Container>
    </Layout>
  );
}
export async function getServerSideProps({ params }: any) {
  return {
    props: { id: params.id },
  };
}
