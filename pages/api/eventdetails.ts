import fetchJson from "../../lib/fetchJson";
import useUser from "../../lib/useUser";
// import useSWR from "swr";
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();


const { user } = useUser();
export default async function handler(req: any, res: any) {
 
 
  console.log("user from event request", user);

  
  const { apiUrl } = publicRuntimeConfig

  // console.log("QUERY", req.query);
  let url;
  let { id } = req.query;

  url = `${apiUrl}/events/${id}`;

  const data = await fetchJson(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  res.status(200).json(data);
}
