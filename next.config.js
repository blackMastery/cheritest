module.exports = {
//      typescript: {
//     ignoreBuildErrors: true,
//   },
    webpackDevMiddleware: (config) => {
        swcMinify: false,
        // Solve compiling problem via vagrant
        config.watchOptions = {
            poll: 1000,   // Check for changes every second
            aggregateTimeout: 300,   // delay before rebuilding
        };
        return config;
    },
    serverRuntimeConfig: {
        secret: 'THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING'
    },
    publicRuntimeConfig: {
        apiUrl: process.env.STAGING === '1'
            ? 'http://localhost:3001' // development api
            : 'http://ec2-54-87-46-91.compute-1.amazonaws.com' // production api
    }
};
