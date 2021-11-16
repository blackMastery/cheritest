import fetchJson from "../../lib/fetchJson";
import withSession from "../../lib/session";
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig

export default withSession(async (req, res) => {
  // const { username } = await req.body
  const url = new URL("/auth/login", apiUrl);

  try {
    // we check that the user exists on GitHub and store some data in session
    const data = await fetchJson(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    console.log("api response", data);
    const { access_token, email, user: authUser } = data;

    // const { data, error } = useSWR(url, fetchJson);

    const user = { isLoggedIn: true, email, ...authUser };

    // console.log('AUTH',token, user, role , user)

    req.session.set("user", user);
    req.session.set("token", access_token);

    await req.session.save();

    res.json(user);
  } catch (error) {
    console.log("here", error);
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
