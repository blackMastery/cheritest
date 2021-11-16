import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useUser from "../lib/useUser";
import Link from "../src/common/components/elements/Link";
import { Button,  Drawer, IconButton } from "@mui/material";
import fetchJson from "../lib/fetchJson";
import AppFooter from "./AppFooter";
import { LinearProgress } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import List from "@mui/material/List";

import ListItem from "@mui/material/ListItem";

const Layout = ({ children, title = "Cherimoya" }: any) => {
  const { user, mutateUser } = useUser();
  const router = useRouter();

  const [open, setOpen] = React.useState(false);

  // const [state, setState] = React.useState({
  //   top: false,
  //   left: false,
  //   bottom: false,
  //   right: false,
  // });

  const toggleDrawer = (newOpen: any) => () => {
    setOpen(newOpen);
  };

  if (!user || user.isLoggedIn === false) {
    return <LinearProgress color="secondary" />;
  }
  return (
    <div style={{ width: "100% !important" }}>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
      </Head>
      <header>
        <Box>
          <Drawer open={open} onClose={toggleDrawer(false)}>
            <List>
              <ListItem button>
                <Typography variant="h6" component="div">
                  <Link href="/" underline="none" color="inherit">
                    Cherimoya
                  </Link>
                </Typography>
              </ListItem>
              <ListItem button>
                <Typography component="div" style={{ margin: "10px" }}>
                  <Link underline="none" href="/marketplace" color="inherit">
                    Marketplace
                  </Link>
                </Typography>
              </ListItem>

              <ListItem button>
                <Typography component="div" style={{ margin: "10px" }}>
                  <Link underline="none" href="/myevents" color="inherit">
                    Events
                  </Link>
                </Typography>
              </ListItem>

              <ListItem button>
                <Typography component="div" style={{ margin: "10px" }}>
                  <Link underline="none" href="/dashboard" color="inherit">
                    Dashboard
                  </Link>
                </Typography>
              </ListItem>
            </List>
          </Drawer>

          <AppBar position="static" style={{ backgroundColor: "green" }}>
            <Toolbar>
         
                {title != "Cherimoya" && (
                  <IconButton
                    size="small"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => router.back()}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                )}
                {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link href="/" underline="none" color="inherit">
                  Cherimoya
                </Link>
              </Typography> */}

                <IconButton
                  size="small"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  // sx={{ mr: 2 }}
                  sx={{ display: { xs: "block", md: "none", lg: "none" } }}
                  // sx={{ display: { xs: 'block', lg: 'none', xl: 'block' } }}
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>

                <Typography variant="h5" component="div" sx={{ flexGrow: 0.9 }}>
                  <Link href="/" underline="none" color="inherit">
                    Cherimoya
                  </Link>
                </Typography>

              {user?.isLoggedIn ? (
                <Box
                  sx={{
                    display: {
                      md: "flex",
                      flexWrap: "nowrap",
                      p: 1,
                      m: 1,
                      maxWidth: 300,
                      lg: "flex",
                      xs: "none",
                    },
                  }}
                >
                  <Typography component="div" style={{ margin: "10px" }}>
                    <Link underline="none" href="/marketplace" color="inherit">
                      Marketplace
                    </Link>
                  </Typography>
                  <Typography component="div" style={{ margin: "10px" }}>
                    <Link underline="none" href="/myevents" color="inherit">
                      Events
                    </Link>
                  </Typography>

                  <Typography component="div" style={{ margin: "10px" }}>
                    <Link underline="none" href="/dashboard" color="inherit">
                      
                      Dashboard
                    </Link>
                  </Typography>
                  <Button
                    color="inherit"
                    onClick={async (e) => {
                      e.preventDefault();
                      mutateUser(
                        await fetchJson("/api/logout", { method: "POST" }),
                        false
                      );
                      router.push("/login");
                    }}
                  >
                    Logout
                  </Button>
                </Box>
              ) : (
                <>
                  <Typography component="div" style={{ margin: "10px" }}>
                    <Link underline="none" href="/marketplace" color="inherit">
                      Marketplace
                    </Link>
                  </Typography>
                  <Typography component="div" style={{ margin: "10px" }}>
                    <Link underline="none" href="/signup" color="inherit">
                      Register
                    </Link>
                  </Typography>

                  <Link underline="none" href="/login" color="inherit">
                    Login
                  </Link>
                </>
              )}
            </Toolbar>
          </AppBar>
        </Box>
      </header>

      {children}

      <AppFooter />
    </div>
  );
};

export default Layout;
