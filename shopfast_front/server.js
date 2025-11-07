// shopfast_front/server.js
const path = require("path");
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 10000;

// 1) Proxy: redirige /api/* -> backend EC2 (HTTP)
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://3.145.28.63:8000", // <-- tu backend EC2 (HTTP)
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
    // opcional: timeouts, logging, etc.
  })
);

// 2) Servir archivos estáticos (build de Vite en /dist)
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// 3) SPA fallback: cualquier ruta devuelve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Proxy+Static server running on port ${PORT}`);
});
