require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');


// Crear la carpeta de uploads automáticamente si no existe en el servidor de Render
const dir = path.join(__dirname, 'uploads');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// --- IMPORTACIÓN DE RUTAS ---
const embarquePlanaRoutes = require("./routes/embarquePlanaRoutes");
const embarqueCajaRoutes = require("./routes/embarqueCajaRoutes");
const recepcionLPRoutes = require("./routes/recepcionLPRoutes");
const fotomasterRoutes = require("./routes/fotomasterRoutes");
const masterRoutes = require("./routes/spoolRoutes");
const consultaRoutes = require("./routes/consultaRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// --- MODELO PARA EMBARQUES CONSOLIDADOS ---
const ViajeConsolidado = mongoose.model('ViajeConsolidado', new mongoose.Schema({
  numeroEmbarque: String,
  empresaDestino: String,
  nombreChofer: String,
  placaAutobus: String,
  placaPlana: String,
  pesoTotal: Number,
  fechaSalida: String,
  encargadoEmbarque: String,
  spoolsCaja: [String],
  spoolsPlana: [String],
  cantidadCaja: Number,
  cantidadPlana: Number
}, { timestamps: true }));

// --- ACTIVACIÓN DE RUTAS ---
app.use("/api/master", masterRoutes);
app.use("/api/fotomaster", fotomasterRoutes);
app.use("/api/embarque-plana", embarquePlanaRoutes);
app.use("/api/embarque-caja", embarqueCajaRoutes);
app.use("/api/recepcion-lp", recepcionLPRoutes);
app.use("/api/consulta", consultaRoutes);

// --- RUTAS PARA EL MÓDULO DE EMBARQUES CONSOLIDADOS ---
app.post("/api/embarques/nuevo", async (req, res) => {
  try {
    const nuevoViaje = new ViajeConsolidado(req.body);
    await nuevoViaje.save();
    res.status(201).json({ mensaje: "Viaje consolidado guardado exitosamente." });
  } catch (error) {
    console.error("Error al guardar viaje:", error);
    res.status(500).json({ error: "Error al guardar el viaje." });
  }
});

app.get("/api/consulta/historial/embarques-consolidados", async (req, res) => {
  try {
    const historial = await ViajeConsolidado.find().sort({ createdAt: -1 });
    res.json(historial);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ error: "Error al obtener el historial." });
  }
});

// --- CONEXIÓN A MONGO ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado correctamente a MongoDB Atlas"))
  .catch((error) => console.log("Error al conectar con MongoDB:", error));

app.get("/", (req, res) => {
  res.send("Servidor backend de Embarques GPI funcionando");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});