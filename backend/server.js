const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 3000;

// Pega aquí la URL que copiaste al publicar como .csv
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRaXnbVavWcOWUPB-z4Ek47kc5KhtaL0FzlaiIkgyh5ZUBV5IQGGo7KqXBhOHXn0IMliCxVkZaawlcX/pub?output=csv";

app.get("/", (req, res) => {
  res.json({
    mensaje: "Hola desde mi primer servicio Cloud",
    materia: "Cloud Computing",
    servidor: "Node.js + Express",
    estado: "Activo"
  });
});

app.get("/api/estado", (req, res) => {
  res.json({
    estado: "Online",
    servidor: "Node.js",
    servicio: "Cloud API",
    version: "1.0"
  });
});

app.get("/api/productos", async (req, res) => {
  try {
    const respuesta = await fetch(SHEET_CSV_URL);
    const textoCSV = await respuesta.text();

    const filas = textoCSV.trim().split("\n");
    const encabezados = filas[0].split(",").map((h) => h.trim());

    const productos = filas.slice(1).map((fila) => {
      const valores = fila.split(",").map((v) => v.trim());
      const obj = {};
      encabezados.forEach((encabezado, index) => {
        obj[encabezado] = valores[index];
      });
      return obj;
    });

    res.json(productos);
  } catch (error) {
    console.error("Error al obtener datos de Google Sheets:", error);
    res.status(500).json({ error: "Error al consultar la hoja de cálculo" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en puerto ${PORT}`);
});