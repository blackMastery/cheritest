import * as React from "react";
import Layout from "../components/layout";
import ProductHero from "../components/ProductHero";
import useUser from '../lib/useUser'

import {LinearProgress} from "@mui/material";

export default function Index() {
  const { user } = useUser({ redirectTo: "/login" });

  if (!user || user.isLoggedIn === false) {
    return (
      <Layout>
        <LinearProgress color="secondary" />
      </Layout>
    );
  }
  return (
    <Layout>
      <ProductHero />
    </Layout>
  );
}
