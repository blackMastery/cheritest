import fetchJson from "../../lib/fetchJson";
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export default async function handler(req:any, res:any) {
  const { apiUrl } = publicRuntimeConfig

  let { hostid } = req.query;

  const url = `${apiUrl}/events/myevents/${hostid}`;
  const data = await fetchJson(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
console.log({data})
  // Get data from your database
  res.status(200).json(data);
}
