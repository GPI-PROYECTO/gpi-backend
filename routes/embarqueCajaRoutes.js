const express = require("express");
const multer = require("multer");
const router = express.Router();
const EmbarqueCaja = require("../models/EmbarqueCaja");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// --- RUTA GET PARA EL HISTORIAL DE LA OFICINA ---
router.get("/", async (req, res) => {
  try {
    const embarques = await EmbarqueCaja.find().sort({ createdAt: -1 });
    res.json(embarques);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener embarques", error: error.message });
  }
});

// --- RUTA POST PARA REGISTRAR DESDE LA TABLET ---
router.post("/registrar", upload.array("evidenciaFotos"), async (req, res) => {
  try {
    const { folioEmbarque, fechaEmbarque, scan, tipoEmbarque, totalPiezas, pesoTotal, observaciones } = req.body;
    const spools = JSON.parse(req.body.spools);

    if (!req.files || req.files.length !== spools.length) {
      return res.status(400).json({ 
        mensaje: `Error: Se esperaban ${spools.length} fotografías, pero se recibieron ${req.files ? req.files.length : 0}.` 
      });
    }

    const spoolsConFoto = spools.map((spool, index) => {
      return { ...spool, foto: req.files[index].path };
    });

    const folioExistente = await EmbarqueCaja.findOne({ folioEmbarque });
    if (folioExistente) {
      return res.status(409).json({ mensaje: "Ya existe un embarque de caja con ese folio" });
    }

    const nuevoEmbarque = await EmbarqueCaja.create({
      folioEmbarque,
      fechaEmbarque,
      scan,
      tipoEmbarque: tipoEmbarque || "CAJA",
      totalPiezas: Number(totalPiezas),
      pesoTotal: Number(pesoTotal),
      observaciones,
      spools: spoolsConFoto,
    });

    res.status(201).json({ mensaje: "Embarque de caja guardado correctamente", embarque: nuevoEmbarque });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al guardar en el servidor", error: error.message });
  }
});

module.exports = router;