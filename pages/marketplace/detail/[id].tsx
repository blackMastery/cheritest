import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import useFetch from "use-http";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import ReactMarkdown from "react-markdown";

import Layout from "../../../components/layout";
import { LinearProgress } from "@mui/material";

function removeTags(str: any) {
  if (str === null || str === "" || str == undefined) return false;
  else str = str.toString();
  return str.replace(/(<([^>]+)>)/gi, "");
}

export default function Index() {
  const options = {}; // these options accept all native `fetch` options
  const router = useRouter();
  const { id } = router.query;

  let {
    loading,
    error,
    data = [],
  } = useFetch(`/api/experiencedetail?id=${id}`, options, []);

  console.log(loading, error, data, id);
  if (loading)
    return (
      <Box>
        <LinearProgress />
      </Box>
    );
  return (
    <Layout title="Experience Detail">
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Card>
            <CardHeader title={data.name} subheader={data.status} />
            <CardMedia
              component="img"
              height="194"
              image={data.banner_image}
              alt={data.name}
            />
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                {removeTags(data.description)}
              </Typography>

              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                ${data.unit_cost} {data.curremcy}
              </Typography>

              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Third party details
              </Typography>

              <ReactMarkdown>{data.vendor_req}</ReactMarkdown>
            </CardContent>
            <CardActions>
              {/* <Button onClick={handleOpen} variant="outlined">
                View Experience
              </Button> */}
            </CardActions>
          </Card>
        </Box>
      </Container>


    </Layout>
  );
}
