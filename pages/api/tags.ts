import fetchJson from '../../lib/fetchJson'
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig



export default async function handler(req:any, res:any) {


  
  if (req.query) {
    let url;
  

    url = `${apiUrl}/tag`

    const data = await fetchJson(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

    console.log('first', data[0]);
    res.status(200).json(data)

  }

  res.status(200).json({
    message: "nextjs sever"
  })



}
