const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    proxy.createProxyMiddleware({
      target: process.env.REACT_APP_DOCKER
        ? process.env.REACT_APP_API_ROUTE
        : "http://localhost:3080",
      changeOrigin: true,
    })
  );
};
