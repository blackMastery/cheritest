import fetchJson from '../../lib/fetchJson'
import withSession from '../../lib/session'
// import useSWR from 'swr';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig


export default withSession(async (req:any, res:any) => {
  // const { username } = await req.body
  const url = new URL('/users',apiUrl) 


  console.log('req',JSON.stringify(req.body))
  console.log('req>>>>',req.body)


  try {
    // we check that the user exists on GitHub and store some data in session
  await fetchJson(
      url,
      {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body) } );


    const user = { isLoggedIn: false }
    
    // await req.session.save()
    res.json(user)

  } catch (error:any) {
    console.log('here', error)
    const { response: fetchResponse } = error
    res.status(fetchResponse?.status || 500).json(error.data)
  }
})
