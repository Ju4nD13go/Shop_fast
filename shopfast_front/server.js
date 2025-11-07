import path from "path";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Configurar el proxy para las solicitudes API
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://3.145.28.63:8000", 
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
    
  })
);

//Servir archivos estáticos (build de Vite en /dist)
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// SPA fallback: cualquier ruta devuelve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Proxy + Static server running on port ${PORT}`);
});
