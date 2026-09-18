import { useEffect, useState } from "react";

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  // Estados para los retos 1, 2 y 3
  const [estadoServidor, setEstadoServidor] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  useEffect(() => {
    // 1. Obtener los productos
    fetch("http://localhost:3000/api/productos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en el servidor");
        }
        return response.json();
      })
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        setCargando(false);
      });

    // 2. Reto 3: Consumir el endpoint /api/estado
    fetch("http://localhost:3000/api/estado")
      .then((response) => response.json())
      .then((data) => setEstadoServidor(data))
      .catch((error) => console.error("Error al obtener estado:", error));
  }, []);

  // Reto 1 y 2: Lógica de filtrado por nombre y por categoría
  const productosFiltrados = productos.filter((producto) => {
    const coincideNombre = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoria === "Todas" || producto.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
        maxWidth: "600px",
        margin: "0 auto"
      }}
    >
      <h1>Mi Primer Servicio Cloud</h1>
      <p>Aplicación React consumiendo una API desarrollada con Node.js</p>

      {/* Reto 3: Mostrar el estado del servicio */}
      {estadoServidor && (
        <div
          style={{
            background: "#222",
            color: "#fff",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px"
          }}
        >
          <p style={{ margin: "2px 0" }}>
            <strong>Estado del servicio:</strong> {estadoServidor.estado} (
            {estadoServidor.servicio} v{estadoServidor.version})
          </p>
          <small style={{ color: "#aaa" }}>
            Servidor: {estadoServidor.servidor}
          </small>
        </div>
      )}

      {/* Reto 1: Cuadro de búsqueda */}
      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Buscar producto: </strong>
        </label>
        <input
          type="text"
          placeholder="Ej. Laptop..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            padding: "8px",
            width: "60%",
            borderRadius: "4px",
            border: "1px solid gray"
          }}
        />
      </div>

      {/* Reto 2: Filtro por categoría */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          <strong>Categoría: </strong>
        </label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid gray"
          }}
        >
          <option value="Todas">Todas las categorías</option>
          <option value="Computadoras">Computadoras</option>
          <option value="Accesorios">Accesorios</option>
        </select>
      </div>

      {cargando && <p>Cargando información...</p>}

      {error && <p>No fue posible conectar con el servicio.</p>}

      {/* Renderizado de productos filtrados */}
      {!cargando &&
        !error &&
        productosFiltrados.map((producto) => (
          <div
            key={producto.id}
            style={{
              border: "1px solid gray",
              padding: "15px",
              marginTop: "10px",
              borderRadius: "8px"
            }}
          >
            <h3 style={{ margin: "0 0 8px 0" }}>{producto.nombre}</h3>
            <p style={{ margin: "4px 0" }}>Precio: ${producto.precio}</p>
            <p style={{ margin: "4px 0" }}>Categoría: {producto.categoria}</p>
          </div>
        ))}

      {!cargando && !error && productosFiltrados.length === 0 && (
        <p>No se encontraron productos con esos filtros.</p>
      )}
    </div>
  );
}

export default App;