import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {
  FormControl,
  LinearProgress,
  Grid,
  AppBar,
  MenuItem,
  Select,
  Chip,
  Toolbar,
} from "@mui/material";
import Layout from "../../components/layout";
import ExperienceCard from "../../components/experience_card";
import useFetch from "use-http";
import InputLabel from "@mui/material/InputLabel";

//


export default function Index() {
  const options = {}; // these options accept all native `fetch` options
  let {
    get,
    response,
    loading,
  } = useFetch("/api/experience", options, []);

  let {
    data: tags = [],
  } = useFetch("/api/tags", options, []);

  const [newData, setData] = React.useState([]);

  React.useEffect(() => {
    initializeTodos();
  }, []); // componentDidMount

  async function initializeTodos() {
    const initialData = await get("?name=id&order=ASC");
    if (response.ok) setData(initialData);
  }

  const [age, setAge] = React.useState("");

  const handleChange = async (event: any) => {
    setAge(event.target.value);
    console.log(event.target.value, order);
    const sorted_data = await get(`?name=${event.target.value}&order=${order}`);
    setData(sorted_data);
  };

  const [order, setOrder] = React.useState("");

  const orderChange = async (event: any) => {
    setOrder(event.target.value);
    const sorted_data = await get(`?name=${age}&order=${event.target.value}`);
    setData(sorted_data);
  };

  return (
    <Layout title="Marketplace">
      <Box>
        <Box>
          <Container>
            {loading && (
              <Box>
                <LinearProgress />
              </Box>
            )}
            <AppBar
              position="static"
              color="transparent"
              style={{ marginBottom: "60px", marginTop: "20px" }}
            >
              <Toolbar>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    sort by
                  </InputLabel>

                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-helper"
                    value={age}
                    label="sort by"
                    onChange={handleChange}
                  >
                    <MenuItem value="unit_cost">Price</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                    {/* <MenuItem value=>Thirty</MenuItem> */}
                  </Select>
                  {/* <FormHelperText>sort by</FormHelperText> */}
                </FormControl>

                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="order-simple-select-standard-label">
                    order by
                  </InputLabel>

                  <Select
                    labelId="order-simple-select-standard-label"
                    value={order}
                    onChange={orderChange}
                    displayEmpty
                    label="order by"
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="ASC">Ascending</MenuItem>
                    <MenuItem value="DESC">Decending</MenuItem>
                  </Select>
                  {/* <FormHelperText>order by</FormHelperText> */}
                </FormControl>

                {tags.map((t:any) => (
                  <Chip label={t.name} variant="outlined" />
                ))}
              </Toolbar>
            </AppBar>

            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {newData
                .filter((e: any) => e.status == "published")
                .map((ex, idx) => (
                  <Grid item xs={2} sm={4} md={4} key={idx}>
                    <ExperienceCard experience={ex} />
                  </Grid>
                ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </Layout>
  );
}
