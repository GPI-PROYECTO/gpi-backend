const express = require("express");
const multer = require("multer");
const router = express.Router();
const EmbarquePlana = require("../models/EmbarquePlana");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// --- NUEVA RUTA: ESTA ES LA QUE TE FALTABA PARA EL HISTORIAL ---
// Como en server.js usaste app.use("/api/embarque-plana", ...), esta ruta responde a GET /api/embarque-plana/
router.get("/", async (req, res) => {
  try {
    const embarques = await EmbarquePlana.find().sort({ createdAt: -1 });
    res.json(embarques);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener embarques", error: error.message });
  }
});

// --- RUTA DE REGISTRO ---
router.post("/registrar", upload.array("evidenciaFotos"), async (req, res) => {
  try {
    const { folioEmbarque, fechaEmbarque, scan, tipoEmbarque, totalPiezas, pesoTotal, observaciones } = req.body;
    
    const spools = JSON.parse(req.body.spools);

    if (!req.files || req.files.length !== spools.length) {
      return res.status(400).json({ 
        mensaje: `Error: Se esperaban ${spools.length} fotos, pero se recibieron ${req.files ? req.files.length : 0}.` 
      });
    }

    const spoolsConFoto = spools.map((spool, index) => ({
      ...spool,
      foto: req.files[index].path
    }));

    const folioExistente = await EmbarquePlana.findOne({ folioEmbarque });
    if (folioExistente) {
      return res.status(409).json({ mensaje: "Ya existe un embarque con ese folio" });
    }

    const nuevoEmbarque = await EmbarquePlana.create({
      folioEmbarque,
      fechaEmbarque,
      scan,
      tipoEmbarque: tipoEmbarque || "PLANA",
      totalPiezas: Number(totalPiezas),
      pesoTotal: Number(pesoTotal),
      observaciones,
      spools: spoolsConFoto,
    });

    res.status(201).json({ mensaje: "Embarque guardado correctamente", embarque: nuevoEmbarque });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al guardar el embarque", error: error.message });
  }
});

module.exports = router;