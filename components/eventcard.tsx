import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { CardActionArea} from "@mui/material";
import { useRouter } from "next/router";

// import Link from '../src/common/components/elements/Link';
import Link from "next/link";

export default function EventCard(props:any) {
  const { event } = props;

  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const router =  useRouter();

  React.useEffect(() => {
    console.log(event.start_on)
    const _startDate = new Date(event.start_on);
    const _endDate = new Date(event.end_on);

    setStartDate(_startDate.toLocaleString());
    setEndDate(_endDate.toLocaleString());
  });
  return (
    <Card>
      <CardActionArea 
      onClick={()=>router.push(`/myevents/details/${event.id}`)}
      >
      <CardHeader title={event.name} />

      <CardContent>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {event.description}
        </Typography>

        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {startDate} to {endDate}
        </Typography>
      </CardContent>
      </CardActionArea >

      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
          <Link href={`/event/${event.id}`} passHref>
            <Button   size="small">Edit Event Details</Button>
          </Link>
      </CardActions>
    </Card>
  );
}
