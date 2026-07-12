const express = require("express");
const multer = require("multer");
const router = express.Router();
const FotoMaster = require("../models/FotoMaster");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, '-'));
  },
});

const upload = multer({ storage });

const subidaFotos = upload.fields([
  { name: "fotoEtiqueta", maxCount: 1 },
  { name: "fotoFigura", maxCount: 1 }
]);

router.post("/nuevo-spool", subidaFotos, async (req, res) => {
  try {
    // 1. Atrapamos TODOS los datos que manda la tablet en el req.body
    const { cc, spool, area, pesoKg, usuario, color, pl, fecha } = req.body;

    const rutaEtiqueta = req.files && req.files['fotoEtiqueta'] ? req.files['fotoEtiqueta'][0].path : null;
    const rutaFigura = req.files && req.files['fotoFigura'] ? req.files['fotoFigura'][0].path : null;

    // 2. Mapeamos exactamente con los nombres que exige tu modelo FotoMaster
    const nuevoRegistro = await FotoMaster.create({
      codigoCorto: cc,
      spool: spool,
      area: area,
      peso: Number(pesoKg), // Tu base exige 'peso', la tablet manda 'pesoKg'
      scan: usuario,        // Tu base exige 'scan', la tablet manda 'usuario'
      color: color,         // Agregado
      pl: pl,               // Agregado
      fecha: fecha,         // Agregado
      fotoEtiqueta: rutaEtiqueta,
      fotoFigura: rutaFigura
    });

    res.status(201).json({ mensaje: "Guardado correctamente en FotoMaster", dato: nuevoRegistro });
  } catch (error) {
    console.error("Error al guardar en FotoMaster:", error);
    res.status(500).json({ mensaje: "Error al guardar en el servidor", error: error.message });
  }
});

module.exports = router;