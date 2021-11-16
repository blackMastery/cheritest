import * as React from "react";
import Layout from "../../components/layout";
import useFetch from "use-http";
import Box from "@mui/material/Box";
import {
  LinearProgress,
  Typography,
  Card,
  Container
} from "@mui/material";



function removeTags(str: any) {
  if (str === null || str === "" || str == undefined) return false;
  else str = str.toString();
  return str.replace(/(<([^>]+)>)/gi, "");
}

export default function EventIndex({ experience_id }: any) {
  let {
    loading,
    data: view,
  } = useFetch(`/api/experienceview?id=${experience_id}`, {}, []);

  return (
    <Layout title="My Events">
      {loading && (
        <Box>
          <LinearProgress />
        </Box>
      )}

      {!loading && (
        <Box sx={{ flexGrow: 1 }}>
          <Container>
            <Card elevation={2}>
        
              <Typography variant="h5"sx={{ textAlign: 'center', m: 1 }}>
              {view.name}
                </Typography>
              <Typography
                variant="h5"
                component="div"
                sx={{ flexGrow: 1, alignSelf: "flex-end", padding: "10px",  }}
              >
                {removeTags(view.description)}
              </Typography>
            </Card>
          </Container>

          <div
            style={{ height: "800px" }}
            dangerouslySetInnerHTML={{ __html: view.view }}
          />
        </Box>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }:any) {
  return {
    props: { experience_id: params.experience_id },
  };
}
