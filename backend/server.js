const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const PORT = 3000;

app.get("/", (req, res) => {
  res.json({
    mensaje: "Hola desde mi primer servicio Cloud",
    materia: "Cloud Computing",
    servidor: "Node.js + Express",
    estado: "Activo"
  });
});

app.get("/estado", (req, res) => {
  res.json({
    servidor: "Cloud Server",
    estado: "Funcionando",
    usuarios: 1,
    version: "1.0"
  });
});

app.get("/api/productos", (req, res) => {
  const productos = [
    {
      id: 1,
      nombre: "Laptop",
      precio: 15000,
      categoria: "Computadoras"
    },
    {
      id: 2,
      nombre: "Mouse",
      precio: 350,
      categoria: "Accesorios"
    },
    {
      id: 3,
      nombre: "Teclado",
      precio: 700,
      categoria: "Accesorios"
    }
  ];

  res.json(productos);
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en puerto ${PORT}`);
});