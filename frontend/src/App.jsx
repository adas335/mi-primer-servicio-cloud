import { useEffect, useState } from "react";

// 1. Reemplaza con tu URL de Apps Script (terminada en /exec)
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwDMmgRJWIjb0qztKAKR1-4OwBeB1GsINUJql0_0f6-vawM-jpeC2x99DetNWpEAVmthg/exec";
const API_URL = "https://backend-cloud-br1r.onrender.com";

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [estadoServidor, setEstadoServidor] = useState(null);

  // Estados de filtrado
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  // Estados del formulario para nuevos productos
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Función para obtener productos desde tu backend en Render
  const cargarProductos = () => {
    fetch(`${API_URL}/api/productos`)
      .then((res) => {
        if (!res.ok) throw new Error("Error en la petición de productos");
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarProductos();

    // Consultar estado del servicio
    fetch(`${API_URL}/api/estado`)
      .then((res) => res.json())
      .then((data) => setEstadoServidor(data))
      .catch((err) => console.error("Error al obtener estado:", err));
  }, []);

  // Enviar nuevo producto a Google Sheets vía Apps Script
  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevoPrecio || !nuevaCategoria) return;

    setGuardando(true);
    const siguienteId = productos.length + 1;

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: siguienteId,
          nombre: nuevoNombre,
          precio: nuevoPrecio,
          categoria: nuevaCategoria
        })
      });

      // Limpiar campos
      setNuevoNombre("");
      setNuevoPrecio("");
      setNuevaCategoria("");

      // Esperar 2 segundos para que Google Sheets procese y recargar datos
      setTimeout(() => {
        cargarProductos();
        setGuardando(false);
      }, 2000);
    } catch (err) {
      console.error("Error al guardar producto:", err);
      setGuardando(false);
    }
  };

  // Categorías dinámicas basadas en los productos existentes
  const categorias = [
    "Todas",
    ...new Set(productos.map((p) => p.categoria).filter(Boolean))
  ];

  // Filtro reactivo por nombre y por categoría
  const productosFiltrados = productos.filter((producto) => {
    const coincideNombre = producto.nombre
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoria === "Todas" || producto.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "650px",
        margin: "0 auto",
        color: "#fff"
      }}
    >
      <h1 style={{ textAlign: "center" }}>Mi Primer Servicio Cloud</h1>
      <p style={{ textAlign: "center", color: "#aaa" }}>
        Aplicación React consumiendo una API desarrollada con Node.js
      </p>

      {/* Reto 3: Estado del servicio */}
      {estadoServidor && (
        <div
          style={{
            background: "#1e1e1e",
            border: "1px solid #333",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            textAlign: "center"
          }}
        >
          <p style={{ margin: "2px 0", fontWeight: "bold" }}>
            Estado del servicio:{" "}
            <span style={{ color: "#4caf50" }}>{estadoServidor.estado}</span> (
            {estadoServidor.servicio} v{estadoServidor.version})
          </p>
          <small style={{ color: "#888" }}>
            Servidor: {estadoServidor.servidor}
          </small>
        </div>
      )}

      {/* Reto 4: Formulario para registrar nuevo producto en Google Sheets */}
      <form
        onSubmit={handleAgregarProducto}
        style={{
          background: "#161616",
          border: "1px solid #2e2e2e",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "25px"
        }}
      >
        <h3 style={{ marginTop: 0 }}>Agregar nuevo producto a Google Sheets</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            placeholder="Nombre del producto (ej. Impresora 3D)"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #444",
              background: "#222",
              color: "#fff"
            }}
          />
          <input
            type="number"
            placeholder="Precio (ej. 4500)"
            value={nuevoPrecio}
            onChange={(e) => setNuevoPrecio(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #444",
              background: "#222",
              color: "#fff"
            }}
          />
          <input
            type="text"
            placeholder="Categoría (ej. Impresión, Hardware)"
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #444",
              background: "#222",
              color: "#fff"
            }}
          />
          <button
            type="submit"
            disabled={guardando}
            style={{
              padding: "12px",
              background: guardando ? "#555" : "#0070f3",
              color: "white",
              fontWeight: "bold",
              border: "none",
              borderRadius: "4px",
              cursor: guardando ? "not-allowed" : "pointer"
            }}
          >
            {guardando ? "Guardando en Google Sheets..." : "Guardar Producto"}
          </button>
        </div>
      </form>

      {/* Retos 1 y 2: Buscador y Filtro por Categoría */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          alignItems: "center"
        }}
      >
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            flex: 2,
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #444",
            background: "#222",
            color: "#fff"
          }}
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #444",
            background: "#222",
            color: "#fff"
          }}
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {cargando && <p style={{ textAlign: "center" }}>Cargando información...</p>}
      {error && (
        <p style={{ textAlign: "center", color: "#ff4d4f" }}>
          No fue posible conectar con el servicio.
        </p>
      )}

      {/* Lista de Productos Filtrados */}
      {!cargando &&
        !error &&
        productosFiltrados.map((producto, index) => (
          <div
            key={producto.id || index}
            style={{
              border: "1px solid #2e2e2e",
              background: "#161616",
              padding: "15px",
              marginTop: "12px",
              borderRadius: "8px"
            }}
          >
            <h3 style={{ margin: "0 0 6px 0" }}>{producto.nombre}</h3>
            <p style={{ margin: "3px 0", color: "#ccc" }}>
              Precio: ${producto.precio}
            </p>
            <p style={{ margin: "3px 0", color: "#888", fontSize: "14px" }}>
              Categoría: {producto.categoria}
            </p>
          </div>
        ))}

      {!cargando && !error && productosFiltrados.length === 0 && (
        <p style={{ textAlign: "center", color: "#888", marginTop: "20px" }}>
          No se encontraron productos coincidentes.
        </p>
      )}
    </div>
  );
}

export default App;