import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import {Chip} from "@mui/material";

// import Link from "../src/common/components/elements/Link";
import Link from "next/link";




export default function ExperienceCard({ experience }:any) {
  return (
    <Card>
      <CardHeader title={experience.name} subheader={experience.status} />
      <CardMedia
        component="img"
        height="194"
        image={experience.banner_image}
        alt={experience.name}
      />
      <CardContent>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <Chip label={`$${experience.unit_cost}`} variant="outlined" />
        </Typography>
      </CardContent>
      <CardActions>
        <Link href={`/marketplace/detail/${experience.id}`} passHref>
          <Button size="small">Learn More</Button>
        </Link>
      </CardActions>
    </Card>
  );
}
