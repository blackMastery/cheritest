# Next.js with TypeScript example

## How to use

Download the example [or clone the repo](https://github.com/mui-org/material-ui):

<!-- #default-branch-switch -->

```sh
curl https://codeload.github.com/mui-org/material-ui/tar.gz/master | tar -xz --strip=2  material-ui-master/examples/nextjs-with-typescript
cd nextjs-with-typescript
```

Install it and run:

```sh
npm install
npm run dev
```

or:

<!-- #default-branch-switch -->

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/mui-org/material-ui/tree/master/examples/nextjs-with-typescript)

## The idea behind the example

The project uses [Next.js](https://github.com/zeit/next.js), which is a framework for server-rendered React apps.
It includes `@mui/material` and its peer dependencies, including `emotion`, the default style engine in MUI v5. If you prefer, you can [use styled-components instead](https://mui.com/guides/interoperability/#styled-components).

## The link component

Next.js has [a custom Link component](https://nextjs.org/docs/api-reference/next/link).
The example folder provides adapters for usage with MUI.
More information [in the documentation](https://mui.com/guides/routing/#next-js).

## What's next?

<!-- #default-branch-switch -->

You now have a working example project.
You can head back to the documentation, continuing browsing it from the [templates](https://mui.com/getting-started/templates/) section.



## FrontEnd

### Components
React components used by pages or by other React components. Global components are in the root /components folder and feature specific components are in subfolders (e.g. /components/account, /components/users).
data


### Helpers
Anything that doesn't fit into the other folders and doesn't justify having its own folder. Front-end React helpers are in the root /helpers folder and back-end API helpers are in the /helpers/api subfolder.


### Pages
Pages and API route handlers for the Next.js login tutorial app. The /pages folder contains all routed pages with the route to each page defined by its file name. The /pages/api folder contains all API route handlers which are also routed based on each file name. For more info on Next.js Page Routing and file name patterns see https://nextjs.org/docs/routing/introduction, for API Routing see https://nextjs.org/docs/api-routes/introduction.


### Services

Services handle all http communication with backend apis for the React front-end application, each service encapsulates the api calls for a content type (e.g. users) and exposes methods for performing various operations (e.g. CRUD operations). Services can also perform actions that don't involve http calls, such as displaying and clearing alerts with the alert service.
styles
CSS stylesheets used by the Next.js tutorial app.
